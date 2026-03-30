import { createHttpClient, toApiError, type ApiError } from '../../shared/api/http'
import type { FeedbackRequest, HttpBinPostResponse } from './types'

const httpbin = createHttpClient('https://httpbin.org')

export async function postFeedback(
  payload: FeedbackRequest,
): Promise<{ data: HttpBinPostResponse } | { error: ApiError }> {
  try {
    const data = await httpbin
      .post<HttpBinPostResponse>('/post', payload, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((r) => r.data)
    return { data }
  } catch (e) {
    return { error: toApiError(e, 'Failed to submit feedback') }
  }
}

