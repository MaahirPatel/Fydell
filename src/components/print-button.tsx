"use client";

export function PrintButton() {
  return <button className="button secondary small" onClick={() => window.print()} type="button">Print / save PDF</button>;
}
