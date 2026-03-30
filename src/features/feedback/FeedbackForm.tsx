import { useState } from 'react'
import type { ApiError } from '../../shared/api/http'
import Alert from '../../shared/ui/Alert'
import Button from '../../shared/ui/Button'
import Input from '../../shared/ui/Input'
import Spinner from '../../shared/ui/Spinner'
import { postFeedback } from './api'
import type { FeedbackRequest } from './types'

export default function FeedbackForm({
  trainerName,
}: {
  trainerName: string
}) {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const [lastEcho, setLastEcho] = useState<FeedbackRequest | null>(null)

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-12 pt-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-xl font-semibold text-slate-900">Feedback (POST)</div>
        <div className="mt-1 text-sm text-slate-600">
          This uses Axios <span className="font-semibold">POST</span> to a public echo
          endpoint and shows the parsed JSON response.
        </div>

        <form
          className="mt-6 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault()
            const trimmed = message.trim()
            if (!trimmed) return

            setIsLoading(true)
            setError(null)
            setLastEcho(null)

            const payload: FeedbackRequest = {
              trainerName,
              message: trimmed,
              createdAtIso: new Date().toISOString(),
            }

            const result = await postFeedback(payload)
            if ('error' in result) {
              setError(result.error)
              setIsLoading(false)
              return
            }

            setLastEcho(result.data.json)
            setMessage('')
            setIsLoading(false)
          }}
        >
          <Input label="Trainer" value={trainerName} disabled />
          <Input
            label="Message"
            placeholder="Type your feedback..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div className="flex items-center gap-3">
            <Button type="submit" disabled={isLoading || message.trim().length === 0}>
              Submit
            </Button>
            {isLoading ? <Spinner label="Posting..." /> : null}
          </div>

          {error ? <Alert>{error.message}</Alert> : null}

          {lastEcho ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">
                Server echo
              </div>
              <pre className="mt-2 overflow-auto rounded-xl bg-white p-3 text-xs text-slate-800">
{JSON.stringify(lastEcho, null, 2)}
              </pre>
            </div>
          ) : null}
        </form>
      </div>
    </div>
  )
}

