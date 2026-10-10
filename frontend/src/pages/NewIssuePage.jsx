import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { createIssue } from '../api/issues'
import IssueForm from '../components/IssueForm'

export default function NewIssuePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleSubmit = async (data) => {
    await createIssue(data)
    await queryClient.invalidateQueries({ queryKey: ['issues'] })
    await queryClient.invalidateQueries({ queryKey: ['stats'] })
    navigate('/issues')
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Ajouter un problème</h1>
      <IssueForm onSubmit={handleSubmit} />
    </div>
  )
}