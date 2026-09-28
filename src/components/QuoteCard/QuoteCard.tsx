"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { Quote } from "@/types";
import { deleteQuote, toggleFavoriteQuote } from "@/lib/actions/quotes";
import css from "./QuoteCard.module.css";

export function QuoteCard({ quote, showBook = true }: { quote: Quote; showBook?: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onFavorite() {
    startTransition(async () => {
      await toggleFavoriteQuote(quote._id);
      router.refresh();
    });
  }

  function onDelete() {
    if (!confirm("Видалити цитату?")) return;
    startTransition(async () => {
      await deleteQuote(quote._id, quote.bookId);
      router.refresh();
    });
  }

  return (
    <article className={`${css.card} rise`}>
      <p className={css.text}>«{quote.text}»</p>
      <div className={css.meta}>
        {showBook && quote.book ? (
          <Link href={`/library/${quote.book._id}`} className={css.book}>
            {quote.book.title} · {quote.book.author}
          </Link>
        ) : null}
        {quote.page ? <span>с. {quote.page}</span> : null}
      </div>
      <div className={css.actions}>
        <button className="btnGhost" type="button" onClick={onFavorite} disabled={pending}>
          {quote.favorite ? "★ Улюблене" : "☆ В улюблені"}
        </button>
        <button className="btnGhost" type="button" onClick={onDelete} disabled={pending}>
          Видалити
        </button>
      </div>
    </article>
  );
}