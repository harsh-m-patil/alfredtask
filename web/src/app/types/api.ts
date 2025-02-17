import { FlashCard } from "./flashcard";

interface AllFlashCardsSuccessResponse {
  status: "success";
  results: number;
  flashcards: FlashCard[];
}

interface AllFlashCardsFailureResponse {
  status: "failure";
  error: string;
}

export type AllFlashCardsResponse =
  | AllFlashCardsSuccessResponse
  | AllFlashCardsFailureResponse;
