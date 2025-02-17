import express, { json } from 'express';
import cors from 'cors';
import { connect } from 'mongoose';
import flashcardRoutes from './routes/flashcards.js';
import { config } from 'dotenv';
import morgan from 'morgan';

config()
const app = express();
app.use(json());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(morgan('dev'))

// Connect to MongoDB
connect(process.env.MONGO_URI, {})
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/flashcards', flashcardRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
