export interface FlashCard {
  _id: string
  question: string
  answer: string
  box?: number
  nextReviewDate: Date
}
