"use client";

import { useState } from "react";

type Outcome = "Advance to interview" | "Hold" | "Do not advance";

export function OutcomeControl() {
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  if (outcome) {
    return (
      <div>
        <p>
          <span className="status">{outcome} recorded</span>
        </p>
        <button
          className="button secondary small"
          type="button"
          onClick={() => setOutcome(null)}
        >
          Change outcome
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
      {(["Advance to interview", "Hold", "Do not advance"] as const).map(
        (value, index) => (
          <button
            className={`button ${index === 0 ? "" : "secondary"} small`}
            key={value}
            onClick={() => setOutcome(value)}
            type="button"
          >
            {value}
          </button>
        ),
      )}
    </div>
  );
}
