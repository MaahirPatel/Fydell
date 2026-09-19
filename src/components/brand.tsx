import Link from "next/link";

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link className={`brand${inverse ? " brand-inverse" : ""}`} href="/">
      <svg aria-hidden="true" viewBox="0 0 32 32">
        <path d="M8 3.5 15.3 8v8.5L8 21 0.7 16.5V8L8 3.5Z" />
        <path d="m24 11 7.3 4.5V24L24 28.5 16.7 24v-8.5L24 11Z" />
        <path d="m8 12 8 4.5L24 12v8l-8 4.5L8 20v-8Z" />
      </svg>
      <span>fydell</span>
    </Link>
  );
}
