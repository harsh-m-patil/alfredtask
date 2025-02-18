import express from 'express';
import Flashcard from '../models/flashcard.js';

const router = express.Router();

// GET /flashcards → Retrieve all flashcards
// Optionally filter by "due" if a route parameter is provided (e.g., /flashcards/due)
router.get('/:due?', async (req, res) => {
  const { due } = req.params;
  const filters = {};

  // If "due" is provided in the URL, filter for flashcards that are due on or before now
  if (due) {
    filters.nextReviewDate = { $lte: new Date() };
  }

  try {
    const flashcards = await Flashcard.find(filters);
    res.json({
      status: 'success',
      results: flashcards.length,
      flashcards
    });
  } catch (error) {
    res.status(500).json({
      status: 'failure',
      error: error.message
    });
  }
});

// POST /flashcards → Add a new flashcard
router.post('/', async (req, res) => {
  try {
    const { question, answer } = req.body;
    const newCard = await Flashcard.create({ question, answer });
    res.status(201).json(newCard);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT /flashcards/:id → Update a flashcard (Leitner System logic)
router.put('/:id', async (req, res) => {
  try {
    const { correct } = req.body;
    const card = await Flashcard.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }

    // If correct, move to the next box; if incorrect, reset to box 1
    if (correct) {
      card.box = (card.box + 1) % 3 + 1;
    } else {
      card.box = 1;
    }

    // Simple Leitner-like intervals (example only); adjust as needed
    const now = new Date();
    const daysToAdd = card.box * 2;
    card.nextReviewDate = new Date(now.setDate(now.getDate() + daysToAdd));

    await card.save();
    res.json(card);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /flashcards/:id → Delete a flashcard
router.delete('/:id', async (req, res) => {
  try {
    const deletedCard = await Flashcard.findByIdAndDelete(req.params.id);
    if (!deletedCard) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }
    res.json({ message: 'Flashcard deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
