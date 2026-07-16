import { CheckCircle2, XCircle, MinusCircle, Play, Flag } from 'lucide-react'
import type { TimelineStep } from '../App'

type Props = {
  timeline: TimelineStep[]
  endReason: 'handoff' | 'timeout'
  isSuccess: boolean
  finalScore: number
}

export default function CaseTimeline({ timeline, endReason, isSuccess, finalScore }: Props) {
  return (
    <div className="relative pl-7">
      <div className="absolute bottom-2 left-[13px] top-2 w-[2px] bg-gray-200" />

      <div className="relative mb-4">
        <div className="absolute -left-7 flex h-7 w-7 items-center justify-center rounded-full border-2 border-primary bg-primary/10">
          <Play size={12} className="fill-primary text-primary" />
        </div>
        <div className="pl-2">
          <p className="text-[12px] font-bold text-gray-800">Case Started</p>
          <p className="text-[10px] text-gray-400">Patient presenting with acute chest tightness</p>
        </div>
      </div>

      {timeline.map((step) => {
        const isGood = step.correct === true
        const isNeutral = step.correct === 'neutral'

        return (
          <div key={step.id} className="relative mb-4">
            <div className={`absolute -left-7 flex h-7 w-7 items-center justify-center rounded-full border-2 bg-white ${isGood ? 'border-emerald-400' : isNeutral ? 'border-gray-300' : 'border-red-400'}`}>
              {isGood && <CheckCircle2 size={14} className="text-emerald-500" />}
              {isNeutral && <MinusCircle size={14} className="text-gray-400" />}
              {!isGood && !isNeutral && <XCircle size={14} className="text-red-500" />}
            </div>

            <div className="flex items-start justify-between gap-2 pl-2">
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-gray-800">{step.label}</p>
                <p className="text-[10.5px] leading-snug text-gray-500">{step.reason}</p>
              </div>
              {step.points !== 0 && (
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-extrabold ${step.points > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                  {step.points > 0 ? `+${step.points}` : step.points}
                </span>
              )}
            </div>
          </div>
        )
      })}

      <div className="relative">
        <div className={`absolute -left-7 flex h-7 w-7 items-center justify-center rounded-full border-2 ${isSuccess ? 'border-emerald-400 bg-emerald-50' : 'border-red-400 bg-red-50'}`}>
          <Flag size={12} className={isSuccess ? 'text-emerald-500' : 'text-red-500'} />
        </div>
        <div className="pl-2">
          <p className="text-[12px] font-bold text-gray-800">{endReason === 'timeout' ? 'Time Expired' : 'Case Handed Off'}</p>
          <p className="text-[10px] text-gray-400">Final score: {finalScore} / 100</p>
        </div>
      </div>
    </div>
  )
}
