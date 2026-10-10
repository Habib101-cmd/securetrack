import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, Loader2 } from 'lucide-react'
import { listTechnicians } from '../api/issues'
import { issueSchema } from '../schemas/issueSchema'
import { URGENCIES } from '../utils/constants'

const FIELDS = ['title', 'description', 'device', 'urgency', 'assignee', 'due_date']

function FieldError({ error }) {
  if (!error) return null
  return (
    <p role="alert" className="mt-1.5 flex animate-fade items-center gap-1.5 text-xs text-alert-ink">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {error.message}
    </p>
  )
}

function Field({ label, id, error, hint, children }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-medium">{label}</label>
        {hint}
      </div>
      {children}
      <FieldError error={error} />
    </div>
  )
}

export default function IssueForm({ onSubmit }) {
  const [globalError, setGlobalError] = useState('')
  const { data: technicians = [] } = useQuery({ queryKey: ['technicians'], queryFn: listTechnicians })

  const {
    register,
    control,
    watch,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(issueSchema),
    defaultValues: { title: '', description: '', device: '', urgency: '', assignee: '', due_date: '' },
  })

  const description = watch('description') ?? ''

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
        Object.entries(e.data).forEach(([field, messages]) => {
          if (FIELDS.includes(field)) setError(field, { message: [].concat(messages).join(' ') })
        })
        setGlobalError('Certains champs sont invalides. Corrigez-les puis réessayez.')
      } else if (e.status === 403) {
        setGlobalError("Vous n'avez pas le droit de créer un problème.")
      } else {
        setGlobalError("Le problème n'a pas pu être enregistré. Réessayez.")
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="card max-w-3xl space-y-6 p-6 sm:p-8">
      {globalError && (
        <p role="alert" className="animate-shake rounded-lg bg-alert-soft px-3.5 py-2.5 text-sm text-alert-ink">
          {globalError}
        </p>
      )}

      <Field label="Titre du problème" id="title" error={errors.title}>
        <input id="title" className="field" placeholder="Exemple : Logiciel ancien" {...register('title')} />
      </Field>

      <Field
        label="Description"
        id="description"
        error={errors.description}
        hint={<span className="text-xs tabular-nums text-ink-soft">{description.length}/1000</span>}
      >
        <textarea
          id="description"
          rows={4}
          className="field"
          placeholder="Que se passe-t-il, et quel risque cela représente-t-il ?"
          {...register('description')}
        />
      </Field>

      <Field label="Appareil ou site concerné" id="device" error={errors.device}>
        <input id="device" className="field" placeholder="Exemple : Ordinateur 01" {...register('device')} />
      </Field>

      <fieldset>
        <legend className="mb-1.5 text-sm font-medium">Niveau d'urgence</legend>
        <Controller
          name="urgency"
          control={control}
          render={({ field }) => (
            <div role="radiogroup" aria-label="Niveau d'urgence" className="grid grid-cols-3 gap-2">
              {Object.entries(URGENCIES).map(([value, u]) => {
                const active = field.value === value
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => field.onChange(value)}
                    className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                      active
                        ? `border-transparent ${u.soft} ${u.text} shadow-[inset_0_0_0_2px_currentColor]`
                        : 'border-line bg-paper text-ink-soft hover:border-ink-soft hover:text-ink'
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${u.dot}`} aria-hidden="true" />
                    {u.label}
                  </button>
                )
              })}
            </div>
          )}
        />
        <FieldError error={errors.urgency} />
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Responsable" id="assignee" error={errors.assignee}>
          <select id="assignee" className="field" {...register('assignee')}>
            <option value="" disabled>Choisir un technicien</option>
            {technicians.map((t) => (
              <option key={t.id} value={t.id}>{t.first_name}</option>
            ))}
          </select>
        </Field>

        <Field label="Date d'échéance (facultatif)" id="due_date" error={errors.due_date}>
          <input id="due_date" type="date" className="field" {...register('due_date')} />
        </Field>
      </div>

      <div className="flex items-center gap-3 border-t border-line pt-6">
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {isSubmitting ? 'Enregistrement…' : 'Ajouter le problème'}
        </button>
        <Link to="/issues" className="btn-secondary">Annuler</Link>
      </div>
    </form>
  )
}