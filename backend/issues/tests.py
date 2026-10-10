from datetime import date, timedelta

from django.core.cache import cache
from rest_framework.test import APIClient, APITestCase

from accounts.models import User
from .models import Issue, IssueHistory

PWD = "MotDePasseTest123!"


def make_user(first, role):
    email = f"{first.lower()}@test.test"
    return User.objects.create_user(
        username=email, email=email, password=PWD, first_name=first, role=role
    )


class SecurityTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.analyste = make_user("Amel", "analyste")
        self.sami = make_user("Sami", "technicien")
        self.lina = make_user("Lina", "technicien")

        def issue(title, assignee):
            return Issue.objects.create(
                title=title, description="Description de test suffisante",
                device="Ordinateur 01", urgency="elevee", assignee=assignee,
                author=self.analyste, due_date=date.today() + timedelta(days=5),
            )

        self.issue_sami = issue("Problème de Sami", self.sami)
        self.issue_lina = issue("Problème de Lina", self.lina)

    # --- Accès ---
    def test_anonymous_cannot_list(self):
        self.assertEqual(self.client.get("/api/issues/").status_code, 403)

    def test_technician_sees_only_own_issues(self):
        self.client.force_login(self.sami)
        data = self.client.get("/api/issues/").json()
        self.assertEqual([i["id"] for i in data], [self.issue_sami.id])

    def test_technician_cannot_read_other_issue(self):
        self.client.force_login(self.sami)
        r = self.client.get(f"/api/issues/{self.issue_lina.id}/")
        self.assertEqual(r.status_code, 404)

    def test_technician_cannot_update_other_issue(self):
        self.client.force_login(self.sami)
        r = self.client.patch(f"/api/issues/{self.issue_lina.id}/",
                              {"status": "corrige"}, format="json")
        self.assertEqual(r.status_code, 404)

    # --- Droits d'écriture ---
    def test_technician_cannot_change_urgency(self):
        self.client.force_login(self.sami)
        r = self.client.patch(f"/api/issues/{self.issue_sami.id}/",
                              {"urgency": "faible"}, format="json")
        self.assertEqual(r.status_code, 403)

    def test_technician_can_change_status_and_history_is_written(self):
        self.client.force_login(self.sami)
        r = self.client.patch(f"/api/issues/{self.issue_sami.id}/",
                              {"status": "en_cours"}, format="json")
        self.assertEqual(r.status_code, 200)
        h = IssueHistory.objects.get(issue=self.issue_sami)
        self.assertEqual((h.field, h.old_value, h.new_value),
                         ("status", "a_traiter", "en_cours"))

    def test_technician_cannot_create_issue(self):
        self.client.force_login(self.sami)
        r = self.client.post("/api/issues/", {}, format="json")
        self.assertEqual(r.status_code, 403)

    def test_author_is_always_the_logged_in_user(self):
        self.client.force_login(self.analyste)
        r = self.client.post("/api/issues/", {
            "title": "Nouveau problème", "description": "Description suffisamment longue",
            "device": "Serveur", "urgency": "faible", "assignee": self.sami.id,
            "author": self.lina.id,
        }, format="json")
        self.assertEqual(r.status_code, 201)
        self.assertEqual(Issue.objects.get(id=r.json()["id"]).author, self.analyste)

    def test_assignee_must_be_a_technician(self):
        self.client.force_login(self.analyste)
        r = self.client.post("/api/issues/", {
            "title": "Nouveau problème", "description": "Description suffisamment longue",
            "device": "Serveur", "urgency": "faible", "assignee": self.analyste.id,
        }, format="json")
        self.assertEqual(r.status_code, 400)

    # --- Protections techniques ---
    def test_write_without_csrf_token_is_refused(self):
        client = APIClient(enforce_csrf_checks=True)
        client.force_login(self.analyste)
        r = client.post("/api/issues/", {}, format="json")
        self.assertEqual(r.status_code, 403)

    def test_password_is_hashed_with_argon2(self):
        self.assertTrue(self.sami.password.startswith("argon2$"))

    def test_script_in_comment_is_stored_as_plain_text(self):
        self.client.force_login(self.analyste)
        payload = "<script>alert(1)</script>"
        r = self.client.post(f"/api/issues/{self.issue_sami.id}/comments/",
                             {"content": payload}, format="json")
        self.assertEqual(r.status_code, 201)
        self.assertEqual(r.json()["content"], payload)

    def test_sql_injection_string_is_treated_as_text(self):
        self.client.force_login(self.analyste)
        r = self.client.get("/api/issues/", {"q": "' OR 1=1 --"})
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json(), [])

    # --- Connexion ---
    def test_wrong_password_gives_generic_error(self):
        r = self.client.post("/api/auth/login/",
                             {"email": "sami@test.test", "password": "faux"}, format="json")
        self.assertEqual(r.status_code, 401)
        r2 = self.client.post("/api/auth/login/",
                              {"email": "inconnu@test.test", "password": "faux"}, format="json")
        self.assertEqual(r.json(), r2.json())

    def test_login_is_rate_limited(self):
        codes = [
            self.client.post("/api/auth/login/",
                             {"email": "sami@test.test", "password": "faux"},
                             format="json").status_code
            for _ in range(6)
        ]
        self.assertEqual(codes[-1], 429)

    def test_technician_cannot_reject_issue(self):
        self.client.force_login(self.sami)
        r = self.client.patch(f"/api/issues/{self.issue_sami.id}/",
                              {"status": "rejete"}, format="json")
        self.assertEqual(r.status_code, 403)

    def test_analyst_can_reject_issue(self):
        self.client.force_login(self.analyste)
        r = self.client.patch(f"/api/issues/{self.issue_sami.id}/",
                              {"status": "rejete"}, format="json")
        self.assertEqual(r.status_code, 200)
