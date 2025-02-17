import express from 'express'
const router = express.Router();
import Flashcard from '../models/flashcard.js'

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

// GET /flashcards → Retrieve all flashcards
router.get('/', async (req, res) => {
  try {
    const flashcards = await Flashcard.find({});
    res.json({
      status: 'success',
      results: flashcards.length,
      flashcards
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /flashcards/:id → Update a flashcard (move to next box or reset to Box 1)
router.put('/:id', async (req, res) => {
  try {
    const { correct } = req.body;
    const card = await Flashcard.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ error: 'Flashcard not found' });
    }

    // If correct, move to next box; if incorrect, reset to box 1
    if (correct) {
      card.box = card.box + 1;
    } else {
      card.box = 1;
    }

    // Calculate the next review date
    const now = new Date();
    const daysToAdd = card.box * 2; // e.g., box 1 = 2 days, box 2 = 4 days, etc.
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

export default router
