import { AlertTriangle, X } from 'lucide-react'

export type PendingAction = {
  id: string
  label: string
  critical: boolean
}

type Props = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  pendingActions: PendingAction[]
}

export default function HandoffConfirmModal({ open, onClose, onConfirm, pendingActions }: Props) {
  if (!open) return null

  const hasCriticalPending = pendingActions.some((action) => action.critical)

  return (
    <div
      className="reports-modal-overlay reports-modal-visible"
      style={{ zIndex: 10000 }}
      onClick={onClose}
    >
      <div
        className="reports-modal-content reports-modal-content-visible !mx-auto !w-[440px] !max-w-[calc(100vw-2rem)] !p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="reports-close-btn" onClick={onClose} type="button" aria-label="Close handoff confirmation">
          <X size={16} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full ${hasCriticalPending ? 'bg-red-50' : 'bg-amber-50'}`}>
            <AlertTriangle size={22} className={hasCriticalPending ? 'text-red-500' : 'text-amber-500'} />
          </div>

          <h2 className="text-[18px] font-extrabold text-gray-800">Complete Handoff?</h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-gray-500">
            After handing over the patient, this simulation will be locked, and no further clinical actions can be performed.
          </p>

          {pendingActions.length > 0 && (
            <div className={`mt-4 w-full rounded-xl border px-4 py-3 text-left ${hasCriticalPending ? 'border-red-200 bg-red-50/60' : 'border-amber-200 bg-amber-50/60'}`}>
              <p className={`mb-1.5 text-[11px] font-bold uppercase tracking-wide ${hasCriticalPending ? 'text-red-600' : 'text-amber-600'}`}>
                {hasCriticalPending ? 'Critical actions not yet performed' : 'Actions not yet performed'}
              </p>
              <ul className="space-y-1">
                {pendingActions.map((action) => (
                  <li key={action.id} className={`text-[12px] font-medium ${action.critical ? 'text-red-700' : 'text-amber-700'}`}>
                    • {action.label}
                  </li>
                ))}
              </ul>
              {hasCriticalPending && (
                <p className="mt-2 text-[11px] font-semibold text-red-600">
                  Handing off now leaves the patient unstabilized. The receiving clinician will need to act immediately.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-gray-250 py-3 text-[13px] font-bold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98]">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className={`flex-1 rounded-xl py-3 text-[13px] font-bold text-white shadow-md transition-all active:scale-[0.98] ${hasCriticalPending ? 'bg-red-500 shadow-red-500/10 hover:bg-red-600' : 'bg-primary shadow-blue-500/10 hover:bg-primary-hover'}`}>
            Complete Handoff
          </button>
        </div>
      </div>
    </div>
  )
}
