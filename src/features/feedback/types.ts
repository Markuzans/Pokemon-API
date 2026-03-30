export type FeedbackRequest = {
  trainerName: string
  message: string
  createdAtIso: string
}

export type HttpBinPostResponse = {
  json: FeedbackRequest | null
  url: string
}

