from datetime import date, timedelta

from django.core.management.base import BaseCommand

from accounts.models import User
from issues.models import Issue

DEMO_PASSWORD = "MotDePasseDemo123!"   # mot de passe fictif, démonstration uniquement


class Command(BaseCommand):
    help = "Crée des utilisateurs et des problèmes de sécurité fictifs"

    def handle(self, *args, **options):
        users = {}
        for first, email, role in [
            ("Amel", "analyste@demo.test", "analyste"),
            ("Sami", "sami@demo.test", "technicien"),
            ("Lina", "lina@demo.test", "technicien"),
        ]:
            user, created = User.objects.get_or_create(
                username=email,
                defaults={"email": email, "first_name": first, "role": role},
            )
            if created:
                user.set_password(DEMO_PASSWORD)
                user.save()
            users[first] = user

        if not Issue.objects.exists():
            today = date.today()
            data = [
                ("Logiciel ancien", "Le navigateur n'est plus mis à jour depuis un an.",
                 "Ordinateur 01", "elevee", "a_traiter", "Sami", 3),
                ("Mauvais réglage", "Le site de démonstration affiche des erreurs détaillées.",
                 "Site de démonstration", "moyenne", "en_cours", "Lina", 7),
                ("Mot de passe par défaut", "Le routeur utilise encore le mot de passe d'origine.",
                 "Routeur bureau", "elevee", "a_traiter", "Sami", 2),
                ("Pare-feu désactivé", "Le pare-feu est désactivé sur le poste de test.",
                 "Ordinateur 02", "elevee", "en_cours", "Sami", 5),
                ("Certificat expiré", "Le certificat HTTPS expire bientôt.",
                 "Site de démonstration", "moyenne", "corrige", "Lina", 10),
                ("Port ouvert inutile", "Un port de test reste ouvert sur le serveur.",
                 "Serveur de test", "faible", "a_traiter", "Lina", 14),
            ]
            for title, desc, device, urgency, status, assignee, days in data:
                Issue.objects.create(
                    title=title, description=desc, device=device,
                    urgency=urgency, status=status,
                    assignee=users[assignee], author=users["Amel"],
                    due_date=today + timedelta(days=days),
                )

        self.stdout.write(self.style.SUCCESS("Données fictives créées"))
