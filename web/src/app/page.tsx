"use client";

import { useQuery } from "@tanstack/react-query";
import { getFlashCards } from "./query/getFlashCards";
import { Card, CardHeader, CardContent } from "~/components/ui/card";
import type { FlashCard } from "./types/flashcard";
import { useState } from "react";
import { Button } from "~/components/ui/button";

export default function Home() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["flashcards"],
    queryFn: getFlashCards,
  });

  if (isLoading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Error fetching flashcards: {error.message}
      </div>
    );
  }

  if (data?.status === "failure") {
    return (
      <div className="text-center text-red-500">
        {data.error || "Something went wrong!"}
      </div>
    );
  }

  if (!data) {
    return <div>No data found</div>
  }

  if (!data.flashcards || data.flashcards.length === 0) {
    return <div className="text-center">No flashcards available.</div>;
  }

  const handleNext = () => {
    setCurrentCardIndex((prev) =>
      prev < data.flashcards.length - 1 ? prev + 1 : 0
    );
  };

  const handlePrev = () => {
    setCurrentCardIndex((prev) =>
      prev > 0 ? prev - 1 : data.flashcards.length - 1
    );
  };

  return (
    <div className="p-5 max-w-lg mx-auto text-center">
      <h1 className="text-4xl font-bold mb-4">FlashCard Learning</h1>
      <div className="grid gap-4">
        <FlashCard card={data.flashcards[currentCardIndex]} />
        <div className="flex justify-between">
          <Button onClick={handlePrev} variant="outline">
            Previous
          </Button>
          <Button onClick={handleNext}>Next</Button>
        </div>
      </div>
    </div>
  );
}

function FlashCard({ card }: { card: FlashCard }) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <Card className="p-4 shadow-md">
      <CardHeader className="text-xl font-semibold">{card.question}</CardHeader>
      {showAnswer && (
        <CardContent className="text-gray-600 mt-2">{card.answer}</CardContent>
      )}
      <div className="text-center mt-4">
        <Button onClick={() => setShowAnswer((prev) => !prev)}>
          {showAnswer ? "Hide Answer" : "Show Answer"}
        </Button>
      </div>
    </Card>
  );
}
