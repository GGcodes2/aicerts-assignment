"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [content, setContent] = useState("");
  const [versions, setVersions] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/versions")
      .then((r) => r.json())
      .then((data) => setVersions(data));
  }, []);

  async function saveVersion() {
    setSaving(true);
    const res = await fetch("/api/save-version", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    const saved = await res.json();
    setVersions((prev) => [saved, ...prev]);
    setSaving(false);
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Content Editor</h1>

      <textarea
        placeholder="Write here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          width: "100%",
          minHeight: 180,
          padding: 12,
          borderRadius: 8,
          border: "1px solid #ddd",
        }}
      />

      <button
        onClick={saveVersion}
        disabled={saving}
        style={{
          marginTop: 12,
          padding: "8px 16px",
          background: "#2563eb",
          color: "white",
          borderRadius: 8,
          border: "none",
        }}
      >
        {saving ? "Saving..." : "Save Version"}
      </button>

      <hr style={{ margin: "20px 0" }} />

      <h2>Version History</h2>

      {versions.length === 0 && <p>No versions yet.</p>}

      <div style={{ display: "grid", gap: 12 }}>
        {versions.map((v) => (
          <div
            key={v.id}
            style={{
              border: "1px solid #ddd",
              padding: 12,
              borderRadius: 8,
              background: "#fafafa",
            }}
          >
            <strong>{v.timestamp}</strong>
            <div style={{ fontSize: 14, marginTop: 4 }}>ID: {v.id}</div>

            <div style={{ marginTop: 10, fontSize: 14 }}>
              <strong>Added:</strong> {v.addedWords.join(", ") || "—"}
              <br />
              <strong>Removed:</strong> {v.removedWords.join(", ") || "—"}
              <br />
              <strong>oldLength:</strong> {v.oldLength} |{" "}
              <strong>newLength:</strong> {v.newLength}
            </div>

            <details style={{ marginTop: 8 }}>
              <summary>Show content</summary>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  border: "1px solid #eee",
                  padding: 10,
                  marginTop: 6,
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
