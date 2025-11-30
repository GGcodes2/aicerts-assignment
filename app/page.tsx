"use client";

import { useEffect, useState } from "react";

// ---------- Types ----------
type Version = {
  id: string;
  timestamp: string;
  addedWords: string[];
  removedWords: string[];
  oldLength: number;
  newLength: number;
  content: string;
};

export default function Page() {
  // ---------- State ----------
  const [content, setContent] = useState<string>("");
  const [versions, setVersions] = useState<Version[]>([]); // IMPORTANT: typed array
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // ---------- Load existing versions ----------
  useEffect(() => {
    fetch("/api/versions")
      .then((res) => res.json())
      .then((data: Version[]) => {
        if (Array.isArray(data)) {
          setVersions(data);
        }
      })
      .catch(() => setError("Failed to load versions"));
  }, []);

  // ---------- Save Version ----------
  const saveVersion = async () => {
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/save-version", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Save failed");
      }

      const saved: Version = json;

      // THIS is now valid because versions is Version[]
      setVersions((prev: Version[]) => [saved, ...prev]);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Content Editor</h1>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write something..."
        style={{
          width: "100%",
          minHeight: 180,
          padding: 12,
          fontSize: 16,
          borderRadius: 8,
          border: "1px solid #ddd",
          marginTop: 8,
        }}
      />

      <div style={{ marginTop: 12 }}>
        <button
          onClick={saveVersion}
          disabled={saving}
          style={{
            padding: "8px 16px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          {saving ? "Saving..." : "Save Version"}
        </button>

        {error && (
          <p style={{ color: "red", marginTop: 10 }}>
            {error}
          </p>
        )}
      </div>

      <hr style={{ margin: "20px 0" }} />

      <h2>Version History</h2>

      {versions.length === 0 && <p>No versions saved yet.</p>}

      <div style={{ display: "grid", gap: 12 }}>
        {versions.map((v) => (
          <div
            key={v.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 12,
              background: "#fafafa",
            }}
          >
            <strong>{v.timestamp}</strong>
            <div style={{ fontSize: 14, marginTop: 4 }}>ID: {v.id}</div>

            <div style={{ marginTop: 8, fontSize: 14 }}>
              <strong>Added:</strong>{" "}
              {v.addedWords.length ? v.addedWords.join(", ") : "—"} <br />
              <strong>Removed:</strong>{" "}
              {v.removedWords.length ? v.removedWords.join(", ") : "—"} <br />
              <strong>Old Length:</strong> {v.oldLength} |{" "}
              <strong>New Length:</strong> {v.newLength}
            </div>

            <details style={{ marginTop: 10 }}>
              <summary>Show content</summary>
              <pre
                style={{
                  background: "white",
                  padding: 10,
                  borderRadius: 6,
                  marginTop: 8,
                  whiteSpace: "pre-wrap",
                  border: "1px solid #eee",
                }}
              >
                {v.content}
              </pre>
            </details>
          </div>
        ))}
      </div>
    </main>
  );
}
