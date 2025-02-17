# Flashcard Learning App (Leitner System)

## 📌 Overview

This is a **MERN stack** (MongoDB, Express.js, React, Node.js) web application that implements the **Leitner System**, a powerful spaced repetition technique for efficient learning. Users can create, review, and progress through flashcards while tracking their learning progress.

## 🚀 Features

### Backend (Node.js, Express, MongoDB, Mongoose)

✅ REST API Endpoints:

- `POST /flashcards` → Add a new flashcard
- `GET /flashcards` → Retrieve all flashcards
- `PUT /flashcards/:id` → Update flashcard (move to next level if correct)
- `DELETE /flashcards/:id` → Delete a flashcard

✅ Leitner System Logic:

- Flashcards start in **Box 1**.
- Correct answers move them to the **next box**.
- Incorrect answers return them to **Box 1**.
- Higher boxes have **longer review intervals**.
- Stores **box level, question, answer, and next review date** in MongoDB.

### Frontend (React, Axios, Tailwind/Bootstrap)

✅ Flashcard Interactions:

- "Show Answer" button to reveal the answer.
- "Got it Right" and "Got it Wrong" buttons to track progress.
- Fetches flashcards based on **next review date**.
- Displays progress: "You have X flashcards due today".
- Simple, distraction-free UI for efficient studying.

### Bonus Features (if implemented)

- 🔒 **JWT Authentication** → Users can log in and save progress.
- 🌙 **Dark Mode Toggle** → Improve UX for night-time study.
- 🎭 **Framer Motion Animations** → Smooth transitions when answering flashcards.
- 🌎 **Deployment on Vercel/Render** → Live demo available.

## 🛠️ Tech Stack

- **Frontend**: React, React Hooks, Axios, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (optional bonus)
- **Animations**: Framer Motion (optional bonus)
- **Deployment**: Vercel/Render (optional bonus)

## 🏗️ Installation & Setup

### 1. Clone the repository

```sh
git clone https://github.com/harsh-m-patil/alfredtask.git
cd alfredtask
```

### 2. Backend Setup

```sh
cd backend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `backend/` folder and add:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key (if auth is implemented)
```

Start the server:

```sh
npm start
```

### 3. Frontend Setup

```sh
cd frontend
npm install
npm start
```

## 📖 How It Works

1. Users create flashcards (question & answer) which are stored in **Box 1**.
2. When reviewing, users mark whether they got it right or wrong.
3. Correct answers move the flashcard **to the next box** (spaced repetition increases).
4. Incorrect answers reset the flashcard to **Box 1**.
5. Flashcards are fetched based on their **next review date** for efficient learning.

## 📬 Submission Details

- **GitHub Repo**: [alfredtask](https://github.com/harsh-m-patil/alfredtask)
- **Submission**: Push code and share the repository link via Internshala
- **Email Subject**: `[Your Name] - MERN Internship Task Submission`

## 📊 Evaluation Criteria

✔ Code Quality & Best Practices
✔ Leitner System Implementation
✔ UI/UX Simplicity & Usability
✔ Proper API Integration & State Management
✔ Bonus Features (if implemented)

## 📌 Resources

- [Leitner System (Wikipedia)](https://en.wikipedia.org/wiki/Leitner_system)
- [Example Flashcards](https://gre.magoosh.com/flashcards/vocabulary/decks)

---
💡 **Happy Coding! 🚀**
