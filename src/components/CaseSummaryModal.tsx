import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  X,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  ArrowRight,
  Home,
  CheckCircle,
  ClipboardList,
} from 'lucide-react'
import CaseTimeline from './CaseTimeline'
import type { TimelineStep } from '../App'

type Props = {
  open: boolean
  onClose: () => void
  endReason: 'handoff' | 'timeout'
  score: number
  timeRemainingStr: string
  wrongMovePenaltyStr: string
  hintDeductionPts: number
  decisionSpeedPct: number
  guidelineAdherencePct: number
  interventionTimePct: number
  hintsUsed: string[]
  timeline: TimelineStep[]
  criticalActionDone: boolean
  pendingActions: { id: string; label: string; critical: boolean }[]
}

export default function CaseSummaryModal({
  open,
  onClose,
  endReason,
  score,
  timeRemainingStr,
  wrongMovePenaltyStr,
  hintDeductionPts,
  decisionSpeedPct,
  guidelineAdherencePct,
  interventionTimePct,
  hintsUsed,
  timeline,
  criticalActionDone,
  pendingActions,
}: Props) {
  const [hintsExpanded, setHintsExpanded] = useState(false)
  const [timelineExpanded, setTimelineExpanded] = useState(true)
  const [feedback, setFeedback] = useState<string | null>(null)
  const navigate = useNavigate()

  if (!open) return null

  // Calculate SVG circular stroke properties
  const radius = 42
  const strokeWidth = 8
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  const isSuccess = criticalActionDone

  return (
    <div
      className="reports-modal-overlay reports-modal-visible"
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      {/* Wrapper to allow overlapping doctor mascot */}
      <div className="relative overflow-visible mx-auto my-auto max-w-[95vw]">
        
        {/* Main modal container */}
        <div
          className="reports-modal-content reports-modal-content-visible !mx-0 !w-[520px] !max-w-full !max-h-[85vh] !p-6 flex flex-col overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button className="reports-close-btn" onClick={onClose} type="button">
            <X size={16} />
          </button>

          {/* Dynamic Top Status Badge */}
          <div className="flex justify-center mb-3">
            <div
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-sm ${
                isSuccess
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                  : 'bg-red-50 border-red-200 text-red-600'
              }`}
            >
              <CheckCircle size={12} className="fill-current" />
              <span>
                {criticalActionDone
                  ? endReason === 'timeout'
                    ? 'Stabilized (Time Expired)'
                    : 'Proficient'
                  : endReason === 'timeout'
                    ? 'Failed / Timeout'
                    : 'Unstable Handoff'}
              </span>
            </div>
          </div>

          {/* Score Circular Progress Ring */}
          <div className="relative flex items-center justify-center h-28 w-full mb-3">
            <svg className="w-24 h-24 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="text-gray-100"
                strokeWidth={strokeWidth}
                stroke="currentColor"
                fill="transparent"
              />
              {/* Fill circle */}
              <circle
                cx="48"
                cy="48"
                r={radius}
                className={`${isSuccess ? 'text-emerald-500' : 'text-red-500'} transition-all duration-1000 ease-out`}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-[28px] font-black text-gray-800 leading-none">{score}</span>
              <span className="text-[10px] text-gray-400 font-bold mt-0.5">/ 100</span>
            </div>
          </div>

          {/* Main heading & Subtitle */}
          <h2 className="text-center text-[20px] font-extrabold text-gray-800 tracking-tight leading-snug">
            {criticalActionDone
              ? endReason === 'timeout'
                ? 'Patient Stabilized'
                : 'Well Done, Karthik S'
              : endReason === 'timeout'
                ? 'Simulation Failed'
                : 'Handed Off — Patient Unstable'}
          </h2>
          <p className="text-center text-[12px] text-gray-400 font-medium mt-0.5 mb-5">
            ICU deterioration assessment · Session ended
          </p>

          {/* Metrics Row (3 Colored Cards) */}
          <div className="grid grid-cols-3 gap-2.5 mb-5">
            {/* 1. Time Remaining */}
            <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-xl p-3 flex flex-col items-center justify-center text-center">
              <span className="text-[15px] font-extrabold text-emerald-600 leading-none mb-1">
                {timeRemainingStr}
              </span>
              <span className="text-[9px] font-semibold text-emerald-500 tracking-wide">
                Time Remaining
              </span>
            </div>

            {/* 2. Wrong Move Penalty */}
            <div className="bg-red-50/50 border border-red-100/50 rounded-xl p-3 flex flex-col items-center justify-center text-center">
              <span className="text-[15px] font-extrabold text-red-600 leading-none mb-1">
                {wrongMovePenaltyStr}
              </span>
              <span className="text-[9px] font-semibold text-red-500 tracking-wide">
                Wrong Move Penalty
              </span>
            </div>

            {/* 3. Hint Deduction */}
            <div className="bg-amber-50/50 border border-amber-100/50 rounded-xl p-3 flex flex-col items-center justify-center text-center">
              <span className="text-[15px] font-extrabold text-amber-600 leading-none mb-1">
                {hintDeductionPts} pts
              </span>
              <span className="text-[9px] font-semibold text-amber-500 tracking-wide">
                Hint Deduction
              </span>
            </div>
          </div>

          {pendingActions.length > 0 && (
            <div className={`mb-5 rounded-xl border px-4 py-3 ${pendingActions.some((action) => action.critical) ? 'border-red-200 bg-red-50/60' : 'border-amber-200 bg-amber-50/60'}`}>
              <p className={`mb-1.5 text-[11px] font-bold uppercase tracking-wide ${pendingActions.some((action) => action.critical) ? 'text-red-600' : 'text-amber-600'}`}>
                Outstanding at Handoff
              </p>
              <ul className="space-y-1">
                {pendingActions.map((action) => (
                  <li key={action.id} className={`text-[12px] font-medium ${action.critical ? 'text-red-700' : 'text-amber-700'}`}>
                    • {action.label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Performance Breakdown Section */}
          <div className="border-t border-gray-100 pt-4 mb-4">
            <h3 className="text-[12px] font-bold text-gray-800 mb-3">Performance breakdown</h3>
            <div className="space-y-2.5">
              {/* Decision Speed */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-gray-500">Decision speed</span>
                  <span className="text-gray-800">{decisionSpeedPct}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                    style={{ width: `${decisionSpeedPct}%` }}
                  />
                </div>
              </div>

              {/* Guideline Adherence */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-gray-500">Guideline adherence</span>
                  <span className="text-gray-800">{guidelineAdherencePct}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                    style={{ width: `${guidelineAdherencePct}%` }}
                  />
                </div>
              </div>

              {/* Intervention Time */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-gray-500">Intervention Time</span>
                  <span className="text-gray-800">{interventionTimePct}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all duration-1000"
                    style={{ width: `${interventionTimePct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Expandable Accordions */}
          <div className="space-y-1.5 border-t border-gray-100 pt-4 mb-4">
            
            {/* Case Timeline */}
            <div className="mb-1.5 overflow-hidden rounded-xl border border-gray-100">
              <button
                type="button"
                onClick={() => setTimelineExpanded(!timelineExpanded)}
                className="flex w-full items-center justify-between bg-gray-50/50 px-3.5 py-2.5 text-left text-[12px] font-bold text-gray-700 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <ClipboardList size={14} className="text-primary" />
                  <span>Case Timeline</span>
                </div>
                {timelineExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {timelineExpanded && (
                <div className="max-h-[280px] overflow-y-auto border-t border-gray-100 bg-white px-4 py-4">
                  <CaseTimeline timeline={timeline} endReason={endReason} isSuccess={isSuccess} finalScore={score} />
                </div>
              )}
            </div>

            {/*
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setDeductionsExpanded(!deductionsExpanded)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-gray-50/50 hover:bg-gray-50 text-[12px] font-bold text-gray-700 text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ClipboardList size={14} className="text-primary" />
                  <span>Clinical Decision Log</span>
                  <div className="flex items-center gap-1">
                    {creditPoints.length > 0 && (
                      <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600">
                        {creditPoints.length} correct
                      </span>
                    )}
                    {deductions.length > 0 && (
                      <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] font-bold text-red-600">
                        {deductions.length} deducted
                      </span>
                    )}
                  </div>
                </div>
                {deductionsExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {deductionsExpanded && (
                <div className="max-h-[220px] space-y-1.5 overflow-y-auto border-t border-gray-100 bg-white px-3.5 py-2.5">
                  {creditPoints.length === 0 && deductions.length === 0 && (
                    <div className="py-1 text-center text-[11px] italic text-gray-400">
                      No clinical actions recorded yet.
                    </div>
                  )}

                  {creditPoints.map((credit, index) => (
                    <div key={`credit-${index}`} className="flex items-start gap-2 rounded-lg border border-emerald-100/50 bg-emerald-50/60 px-2.5 py-2">
                      <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-emerald-500" />
                      <span className="text-[11px] font-medium leading-snug text-emerald-700">{credit}</span>
                    </div>
                  ))}

                  {deductions.map((deduction, index) => (
                    <div key={`deduction-${index}`} className="flex items-start gap-2 rounded-lg border border-red-100/50 bg-red-50/60 px-2.5 py-2 [&>span:first-child]:hidden">
                        <span className="text-red-500 font-bold shrink-0">•</span>
                      <AlertTriangle size={13} className="mt-0.5 shrink-0 text-red-500" />
                      <span className="text-[11px] font-medium leading-snug text-red-700">{deduction}</span>
                      </div>
                  ))}
                </div>
              )}
            </div>

            */}

            {/* Hint Summary */}
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setHintsExpanded(!hintsExpanded)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-gray-50/50 hover:bg-gray-50 text-[12px] font-bold text-gray-700 text-left transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <Lightbulb size={14} className="text-amber-500" />
                  <span>Hint Summary</span>
                </div>
                {hintsExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {hintsExpanded && (
                <div className="px-3.5 py-2.5 bg-white border-t border-gray-100 text-[11px] text-gray-500 space-y-1.5 max-h-[140px] overflow-y-auto">
                  {hintsUsed.length > 0 ? (
                    hintsUsed.map((h, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold shrink-0">•</span>
                        <span>{h}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 italic text-center py-1">No hints requested. Good clinical judgment.</div>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* User Feedback Section */}
          <div className="border-t border-gray-100 pt-4 mb-5 text-center">
            <h4 className="text-[12px] font-bold text-gray-800 mb-2">How was this simulation?</h4>
            <div className="flex justify-center gap-1.5">
              {['Too easy', 'About right', 'Too hard', 'Unclear'].map((option) => (
                <button
                  key={option}
                  onClick={() => setFeedback(option)}
                  type="button"
                  className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold tracking-tight transition-all duration-200 ${
                    feedback === option
                      ? 'bg-primary border-primary text-white scale-[1.02] shadow-sm'
                      : 'bg-white border-gray-250 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 mt-auto pt-3 border-t border-gray-100 shrink-0">
            <button
              onClick={() => { onClose(); navigate('/dashboard') }}
              type="button"
              className="flex-1 py-3 border border-gray-250 rounded-xl text-[13px] font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
            >
              <Home size={15} />
              <span>Go to Home</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="flex-1 py-3 bg-primary rounded-xl text-[13px] font-bold text-white hover:bg-primary-hover active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10"
            >
              <span>Find Similar Case</span>
              <ArrowRight size={15} />
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
