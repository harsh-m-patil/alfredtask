import { AllFlashCardsResponse } from "../types/api";

export async function getFlashCards(): Promise<AllFlashCardsResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/flashcards`)
  const json = await response.json()
  return json;
}
