import { AllFlashCardsResponse } from "../types/api";

export async function getFlashCards(showDueOnly: boolean = false): Promise<AllFlashCardsResponse> {
  // If showDueOnly is true, call /flashcards/due; otherwise, fetch all flashcards
  const endpoint = showDueOnly
    ? "http://localhost:8080/flashcards/due"
    : "http://localhost:8080/flashcards";
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error("Failed to fetch flashcards");
  }
  return response.json();
}
