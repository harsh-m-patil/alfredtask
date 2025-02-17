import { Schema, model } from 'mongoose';

const flashcardSchema = new Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  box: {
    type: Number,
    default: 1
  },
  nextReviewDate: {
    type: Date,
    default: new Date()
  }
});

export default model('Flashcard', flashcardSchema);
