import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { listTechnicians } from '../api/issues'
import { issueSchema } from '../schemas/issueSchema'
import { URGENCIES } from '../utils/constants'

const FIELDS = ['title', 'description', 'device', 'urgency', 'assignee', 'due_date']

function Field({ label, id, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-600 mt-1">{error.message}</p>}
    </div>
  )
}

export default function IssueForm({ onSubmit }) {
  const [globalError, setGlobalError] = useState('')
  const { data: technicians = [] } = useQuery({
    queryKey: ['technicians'],
    queryFn: listTechnicians,
  })

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(issueSchema) })

  const submit = async (values) => {
    setGlobalError('')
    try {
      await onSubmit({
        title: values.title,
        description: values.description,
        device: values.device,
        urgency: values.urgency,
        assignee: Number(values.assignee),
        due_date: values.due_date || null,
      })
    } catch (e) {
      if (e.status === 400 && e.data) {
        // Erreurs de validation renvoyées par le serveur, champ par champ
        Object.entries(e.data).forEach(([field, messages]) => {
          if (FIELDS.includes(field)) {
            setError(field, { message: [].concat(messages).join(' ') })
          }
        })
        setGlobalError('Certains champs sont invalides.')
      } else if (e.status === 403) {
        setGlobalError("Vous n'avez pas le droit de créer un problème.")
      } else {
        setGlobalError('Une erreur est survenue. Réessayez.')
      }
    }
  }

  const input = 'w-full border rounded px-3 py-2'

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="bg-white rounded-xl shadow p-6 space-y-4 max-w-2xl"
      noValidate
    >
      {globalError && (
        <p role="alert" className="text-sm text-red-700 bg-red-50 p-2 rounded">
          {globalError}
        </p>
      )}

      <Field label="Titre du problème" id="title" error={errors.title}>
        <input id="title" className={input} {...register('title')} />
      </Field>

      <Field label="Description" id="description" error={errors.description}>
        <textarea id="description" rows={4} className={input} {...register('description')} />
      </Field>

      <Field label="Appareil ou site concerné" id="device" error={errors.device}>
        <input id="device" className={input} {...register('device')} />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Niveau d'urgence" id="urgency" error={errors.urgency}>
          <select id="urgency" className={input} defaultValue="" {...register('urgency')}>
            <option value="" disabled>
              Choisir…
            </option>
            {Object.entries(URGENCIES).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Responsable" id="assignee" error={errors.assignee}>
          <select id="assignee" className={input} defaultValue="" {...register('assignee')}>
            <option value="" disabled>
              Choisir…
            </option>
            {technicians.map((t) => (
              <option key={t.id} value={t.id}>
                {t.first_name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Date d'échéance (facultatif)" id="due_date" error={errors.due_date}>
        <input id="due_date" type="date" className={input} {...register('due_date')} />
      </Field>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-slate-800 text-white rounded px-5 py-2 hover:bg-slate-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Enregistrement…' : 'Ajouter le problème'}
      </button>
    </form>
  )
}