import { Link } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import { URGENCIES } from '../utils/constants'
import { formatDate, isOverdue } from '../utils/dates'
import Avatar from './Avatar'
import StatusBadge from './StatusBadge'
import UrgencyBadge from './UrgencyBadge'

export default function IssueTable({ issues, dimmed = false }) {
  if (issues.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-2 px-6 py-14 text-center animate-fade">
        <SearchX className="h-8 w-8 text-ink-soft" aria-hidden="true" />
        <p className="font-display text-lg font-semibold">Aucun problème ne correspond</p>
        <p className="text-sm text-ink-soft">Modifiez ou réinitialisez les filtres pour voir plus de résultats.</p>
      </div>
    )
  }

  return (
    <div className={`card overflow-x-auto transition-opacity duration-200 ${dimmed ? 'opacity-60' : ''}`}>
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="border-b border-line text-ink-soft">
            <th scope="col" className="py-3 pl-6 pr-4 font-medium">Problème</th>
            <th scope="col" className="px-4 py-3 font-medium">Appareil concerné</th>
            <th scope="col" className="px-4 py-3 font-medium">Urgence</th>
            <th scope="col" className="px-4 py-3 font-medium">Responsable</th>
            <th scope="col" className="px-4 py-3 font-medium">État</th>
            <th scope="col" className="px-4 py-3 font-medium">Échéance</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue, i) => {
            const overdue = isOverdue(issue)
            return (
              <tr
                key={issue.id}
                className="animate-rise border-b border-line transition-colors last:border-0 hover:bg-mist/60"
                style={{ animationDelay: `${Math.min(i, 8) * 35}ms` }}
              >
                <td className="relative py-4 pl-6 pr-4">
                  <span
                    aria-hidden="true"
                    className={`absolute inset-y-0 left-0 w-1 ${URGENCIES[issue.urgency]?.rail ?? 'bg-line'}`}
                  />
                  <Link to={`/issues/${issue.id}`} className="font-medium hover:text-tide-deep hover:underline">
                    {issue.title}
                  </Link>
                </td>
                <td className="px-4 py-4 text-ink-soft">{issue.device}</td>
                <td className="px-4 py-4"><UrgencyBadge value={issue.urgency} /></td>
                <td className="px-4 py-4">
                  <span className="flex items-center gap-2">
                    <Avatar name={issue.assignee_name} size="sm" />
                    {issue.assignee_name}
                  </span>
                </td>
                <td className="px-4 py-4"><StatusBadge value={issue.status} /></td>
                <td className="px-4 py-4">
                  <span className={overdue ? 'font-semibold text-alert-ink' : 'text-ink-soft'}>
                    {formatDate(issue.due_date)}
                  </span>
                  {overdue && <span className="block text-xs text-alert-ink">En retard</span>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}