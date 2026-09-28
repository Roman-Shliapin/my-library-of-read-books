import Link from "next/link";
import type { Book } from "@/types";
import { statusLabels } from "@/lib/serialize";
import css from "./BookCard.module.css";

function stars(rating?: number | null) {
  if (!rating) return null;
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

export function BookCard({ book }: { book: Book }) {
  const badgeClass =
    book.status === "finished"
      ? "badgeFinished"
      : book.status === "reading"
        ? "badgeReading"
        : "badgeWant";

  return (
    <Link href={`/library/${book._id}`} className={`${css.card} rise`}>
      <div className={css.cover} aria-hidden>
        {book.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={book.coverUrl} alt="" />
        ) : (
          <span>{book.title.slice(0, 1)}</span>
        )}
      </div>
      <div className={css.body}>
        <div className={css.top}>
          <h2 className={css.title}>{book.title}</h2>
          <span className={`badge ${badgeClass}`}>{statusLabels[book.status]}</span>
        </div>
        <p className={css.author}>{book.author}</p>
        {(book.startDate || book.endDate) && (
          <p className={css.dates}>
            {book.startDate ?? "…"} → {book.endDate ?? "зараз"}
          </p>
        )}
        {book.rating ? <p className="stars">{stars(book.rating)}</p> : null}
      </div>
    </Link>
  );
}