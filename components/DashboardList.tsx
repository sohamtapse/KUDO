"use client";

import { useEffect, useState } from "react";

export default function DashboardList() {
  const [reviews, setReviews] = useState([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then(setReviews)
      .catch((err) => console.error("Failed to fetch reviews:", err));
  }, []);

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Latest AI Code Reviews</h2>

      {reviews.length === 0 && (
        <p className="text-white">No reviews yet. Push a commit!</p>
      )}

      {reviews.map((r: any) => (
        <div
          key={r._id}
          className="border rounded-xl p-5 bg-white shadow space-y-3"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg font-semibold">{r.repo}</p>
              <p className="text-sm text-white">
                Commit: <span className="font-mono">{r.commitSha}</span>
              </p>
            </div>

            <button
              onClick={() => toggleExpand(r._id)}
              className="bg-blue-600 text-white px-4 py-1 rounded-lg"
            >
              {expanded === r._id ? "Hide" : "View"}
            </button>
          </div>

          {expanded === r._id && (
            <div className="space-y-5 mt-4">
              {/* --- AI Review --- */}
              <section>
                <h3 className="font-bold text-lg mb-1">AI Review</h3>
                <pre className="p-4 bg-gray-100 rounded whitespace-pre-wrap text-sm">
                  {r.review}
                </pre>
              </section>

              {/* --- Code Diff --- */}
              <section>
                <h3 className="font-bold text-lg mb-1">Code Diff</h3>
                <pre className="p-4 bg-black text-white overflow-auto rounded text-xs">
                  {r.diff}
                </pre>
              </section>

              {/* --- Original Code --- */}
              <section>
                <h3 className="font-bold text-lg mb-1">
                  Original Code Before Commit
                </h3>
                <pre className="p-4 text-white  overflow-auto rounded text-xs whitespace-pre-wrap">
                  {r.originalCode}
                </pre>
              </section>

              <p className="text-white text-xs">
                Reviewed at: {new Date(r.createdAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
