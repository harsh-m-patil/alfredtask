"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { MoonIcon, SunIcon } from "lucide-react";
import { getFlashCards } from "./query/getFlashCards";
import type { FlashCard } from "./types/flashcard";

export default function Home() {
  const queryClient = useQueryClient();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showDueOnly, setShowDueOnly] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });

  // Fetch flashcards using react-query. The getFlashCards function should
  // accept a boolean indicating if only due cards are needed.
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["flashcards", showDueOnly],
    queryFn: () => getFlashCards(showDueOnly),
  });

  // Extract flashcards from the successful response.
  const flashcards: FlashCard[] =
    data && data.status === "success" ? data.flashcards : [];

  // Apply filtering on the client side as well (if needed).
  const filteredFlashcards = showDueOnly
    ? flashcards.filter((card) => new Date(card.nextReviewDate).valueOf() <= Date.now())
    : flashcards;

  // Mutation to update flashcards with the Leitner logic.
  const updateFlashcardMutation = useMutation({
    mutationFn: async ({
      cardId,
      correct,
    }: {
      cardId: string;
      correct: boolean;
    }) => {
      const response = await fetch(`http://localhost:8080/flashcards/${cardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correct }),
      });
      if (!response.ok) {
        throw new Error("Failed to update flashcard");
      }
      return response.json();
    },
    onSuccess: () => {
      // Invalidate queries so that new data is fetched.
      queryClient.invalidateQueries({ queryKey: ["flashcards"] });
      queryClient.invalidateQueries({ queryKey: ["flashcards", true] });
      queryClient.invalidateQueries({ queryKey: ["flashcards", false] });
    },
  });

  // Toggle dark mode by adding or removing a class on the document element.
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const handleMarkCorrect = (id: string | undefined) => {
    if (!id) return;
    updateFlashcardMutation.mutate({ cardId: id, correct: true });
    setStats((prev) => ({ ...prev, correct: prev.correct + 1 }));
    handleNext();
  };

  const handleMarkIncorrect = (id: string | undefined) => {
    if (!id) return;
    updateFlashcardMutation.mutate({ cardId: id, correct: false });
    setStats((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
    handleNext();
  };

  const handleNext = () => {
    setCurrentCardIndex((prev) =>
      prev < filteredFlashcards.length - 1 ? prev + 1 : 0
    );
  };

  const handlePrev = () => {
    setCurrentCardIndex((prev) =>
      prev > 0 ? prev - 1 : filteredFlashcards.length - 1
    );
  };

  const toggleDueOnly = () => {
    setCurrentCardIndex(0);
    setShowDueOnly((prev) => !prev);
  };

  // Render loading and error states.
  if (isLoading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Error fetching flashcards: {error instanceof Error ? error.message : "Unknown Error"}
      </div>
    );
  }

  if (!data) {
    return <div className="text-center">No data found</div>;
  }

  if (data.status === "failure") {
    return (
      <div className="text-center text-red-500">
        {data.error || "Something went wrong!"}
      </div>
    );
  }

  // If there are no flashcards to display.
  if (!filteredFlashcards.length) {
    return (
      <div className="min-h-screen p-5 transition-colors dark:bg-slate-950">
        <div className="max-w-2xl mx-auto text-center p-8">
          <h2 className="text-2xl font-bold mb-4">No flashcards available</h2>
          <p className="text-muted-foreground">
            {showDueOnly
              ? "No cards are due for review. Great job!"
              : "Add some flashcards to get started, or try toggling Show Due Only."}
          </p>
          <Button onClick={toggleDueOnly} variant="outline" className="mt-4">
            {showDueOnly ? "Show All" : "Show Due Only"}
          </Button>
        </div>
      </div>
    );
  }

  const progress = ((currentCardIndex + 1) / filteredFlashcards.length) * 100;

  return (
    <div className="min-h-screen p-5 transition-colors dark:bg-slate-950">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Leitner FlashCard Learning</h1>
          <Button variant="ghost" size="icon" onClick={() => setIsDark((prev) => !prev)}>
            {isDark ? <SunIcon /> : <MoonIcon />}
          </Button>
        </div>

        <div className="flex items-center justify-between mb-8">
          <Button onClick={toggleDueOnly} variant="outline">
            {showDueOnly ? "Show All" : "Show Due Only"}
          </Button>
          <div className="text-sm text-muted-foreground">
            Card {currentCardIndex + 1} of {filteredFlashcards.length}
          </div>
        </div>

        <Progress value={progress} className="mb-8" />

        <div className="grid gap-8">
          <FlashCardComponent
            card={filteredFlashcards[currentCardIndex]}
            onMarkCorrect={handleMarkCorrect}
            onMarkIncorrect={handleMarkIncorrect}
          />

          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <Button onClick={handlePrev} variant="outline">
                ← Previous
              </Button>
              <Button onClick={handleNext}>Next →</Button>
            </div>

            {(stats.correct > 0 || stats.incorrect > 0) && (
              <div className="text-center mt-4 p-4 rounded-lg bg-muted">
                <p className="font-semibold mb-2">Session Statistics</p>
                <div className="flex justify-center gap-4">
                  <p className="text-green-600 dark:text-green-400">Correct: {stats.correct}</p>
                  <p className="text-red-600 dark:text-red-400">Incorrect: {stats.incorrect}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FlashCardComponent({
  card,
  onMarkCorrect,
  onMarkIncorrect,
}: {
  card: FlashCard;
  onMarkCorrect: (id: string) => void;
  onMarkIncorrect: (id: string) => void;
}) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <Card
      className="p-6 shadow-lg transition-all hover:shadow-xl dark:bg-slate-900"
      data-flashcard
      onClick={() => setShowAnswer((prev) => !prev)}
    >
      <CardHeader className="text-2xl font-semibold text-center pb-4">
        {card.question}
      </CardHeader>
      <CardContent className="space-y-6">
        {showAnswer && (
          <div className="animate-fadeIn">
            <p className="text-lg text-center mb-4">{card.answer}</p>
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    onMarkCorrect(card._id);
                  }}
                  className="bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30"
                >
                  Got it Right
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    onMarkIncorrect(card._id);
                  }}
                  className="bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30"
                >
                  Got it Wrong
                </Button>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-between text-sm text-muted-foreground">
          <p>Box: {card.box}</p>
          <p>Next Review: {new Date(card.nextReviewDate).toLocaleDateString()}</p>
        </div>
        {!showAnswer && (
          <p className="text-center text-sm cursor-pointer text-muted-foreground mt-4">
            Click to reveal answer
          </p>
        )}
      </CardContent>
    </Card>
  );
}
