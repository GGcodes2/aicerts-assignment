import crypto from "crypto";

let versions = []; // In-memory storage (Vercel-safe)

// Normalize into words
function words(text = "") {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}']/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

// Word diff logic
function diffWords(oldText, newText) {
  const A = words(oldText);
  const B = words(newText);

  const oldSet = new Set(A);
  const newSet = new Set(B);

  return {
    addedWords: [...newSet].filter((w) => !oldSet.has(w)),
    removedWords: [...oldSet].filter((w) => !newSet.has(w)),
    oldLength: A.length,
    newLength: B.length,
  };
}

export async function POST(req) {
  try {
    const { content } = await req.json();

    const last = versions[versions.length - 1];
    const previousContent = last?.content || "";

    const diff = diffWords(previousContent, content);

    const entry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
      ...diff,
      content,
    };

    versions.push(entry);

    return new Response(JSON.stringify(entry), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
