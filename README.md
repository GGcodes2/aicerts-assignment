📘 Mini Audit Trail Generator.

A lightweight full-stack versioning system built with Next.js, featuring a content editor, version history tracking, and custom backend diff logic.

This project was created as part of a 2-hour originality task and demonstrates full-stack skills including API development, custom algorithms, and UI design.

🚀 Features
📝 Content Editor

Simple text editor for writing and modifying content

“Save Version” button triggers backend version tracking

📜 Version History

Each saved version stores:

id (UUID)

timestamp

addedWords (words newly introduced)

removedWords (words deleted)

oldLength (word count before change)

newLength (word count after change)

content snapshot

⚙️ Backend (Next.js API Routes)

Custom backend logic:

Computes word-level diffs

Extracts added & removed words

Calculates old/new word counts

Generates version objects

Stores versions (in-memory, Vercel-friendly)

🧠 How Diff Logic Works

Normalize text:

lowercasing

removing punctuation

splitting by whitespace

Convert to arrays:

oldWords = ["hello", "world"]
newWords = ["hello", "nextjs", "world"]


Convert to sets and compute:

addedWords = newWords - oldWords
removedWords = oldWords - newWords


Count word lengths

Return summary object

🗂️ Project Structure
app/
  page.jsx                → UI
  api/
    save-version/
      route.js            → Save version API (POST)
    versions/
      route.js            → Fetch versions API (GET)

🔗 API Endpoints
▶️ POST /api/save-version

Request body:

{ "content": "your text here" }


Response example:

{
  "id": "c9329d36-42c7-4e96-9af3-52f17c1f88ef",
  "timestamp": "2025-11-26 13:40",
  "addedWords": ["dashboard"],
  "removedWords": ["pilot"],
  "oldLength": 43,
  "newLength": 51,
  "content": "updated text..."
}

▶️ GET /api/versions

Returns full history (newest → oldest):

[
  {
    "id": "...",
    "timestamp": "...",
    "addedWords": [...],
    "removedWords": [...],
    "oldLength": 0,
    "newLength": 12,
    "content": "..."
  }
]

🏗️ Technology Stack
Frontend

Next.js (App Router)

React (Client Components)

Backend

Next.js Route Handlers

In-memory storage (Vercel compatible)

Custom diff algorithm (no libraries)

🛠️ Running Locally
1. Clone repo
git clone <your-repo-url>
cd <project-folder>

2. Install dependencies
npm install

3. Start dev server
npm run dev


App will run at:

http://localhost:3000

🌐 Deployment (Vercel)

Push project to GitHub

Open https://vercel.com

Import project

Deploy (Next.js auto-detected)

Note:
App uses in-memory storage — ideal for assignment and supported by Vercel.

📌 Why In-Memory Storage?

The assignment allows:

JSON file

SQLite

In-memory array

On Vercel, writing files is not allowed, so in-memory storage is the most stable deployment method and 100% within task rules.

🎯 Evaluation Criteria Covered

✔ Full-stack architecture
✔ Custom diff algorithm
✔ Working API endpoints
✔ Clean and readable code
✔ Proper use of timestamp + UUID
✔ Deployed version available
✔ No external libraries for diffing

🧑‍💻 Author

Gaurav Katare
Full Stack Developer
React | Next.js | Node.js
