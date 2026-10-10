import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import UrgencyBadge from './UrgencyBadge'

export default function IssueTable({ issues }) {
  if (issues.length === 0) {
    return <p className="bg-white rounded-xl shadow p-6 text-slate-500">Aucun problème trouvé.</p>
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3">Problème</th>
            <th className="px-4 py-3">Appareil concerné</th>
            <th className="px-4 py-3">Urgence</th>
            <th className="px-4 py-3">Responsable</th>
            <th className="px-4 py-3">État</th>
            <th className="px-4 py-3">Échéance</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue.id} className="border-t hover:bg-slate-50">
              <td className="px-4 py-3">
                <Link to={`/issues/${issue.id}`} className="text-blue-700 hover:underline">
                  {issue.title}
                </Link>
              </td>
              <td className="px-4 py-3">{issue.device}</td>
              <td className="px-4 py-3">
                <UrgencyBadge value={issue.urgency} />
              </td>
              <td className="px-4 py-3">{issue.assignee_name}</td>
              <td className="px-4 py-3">
                <StatusBadge value={issue.status} />
              </td>
              <td className="px-4 py-3">{issue.due_date ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}