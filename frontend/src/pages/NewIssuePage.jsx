import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { createIssue } from '../api/issues'
import { useToast } from '../context/ToastContext'
import IssueForm from '../components/IssueForm'
import PageHeader from '../components/PageHeader'

export default function NewIssuePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { notify } = useToast()

  const handleSubmit = async (data) => {
    await createIssue(data)
    await queryClient.invalidateQueries({ queryKey: ['issues'] })
    await queryClient.invalidateQueries({ queryKey: ['stats'] })
    notify('Problème ajouté')
    navigate('/issues')
  }

  return (
    <div>
      <PageHeader
        title="Ajouter un problème"
        description="Décrivez le problème, indiquez l'urgence et choisissez la personne qui le corrigera."
      />
      <IssueForm onSubmit={handleSubmit} />
    </div>
  )
}