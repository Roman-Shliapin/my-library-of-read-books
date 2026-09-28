"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Book } from "@/types";
import { createQuote } from "@/lib/actions/quotes";

type Props = {
  books: Book[];
  defaultBookId?: string;
};

export function QuoteForm({ books, defaultBookId }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createQuote(formData);
      if (!result.ok) {
        setError(result.error ?? "Помилка збереження");
        return;
      }
      const bookId = String(formData.get("bookId"));
      router.push(`/library/${bookId}`);
      router.refresh();
    });
  }

  if (books.length === 0) {
    return (
      <div className="empty card">
        <strong>Спочатку додай книгу</strong>
        <p>Цитату можна зберегти лише до наявної книги.</p>
      </div>
    );
  }

  return (
    <form action={onSubmit} className="stack">
      <div className="field">
        <label htmlFor="bookId">Книга</label>
        <select id="bookId" name="bookId" required defaultValue={defaultBookId ?? books[0]._id}>
          {books.map((book) => (
            <option key={book._id} value={book._id}>
              {book.title} — {book.author}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="text">Цитата</label>
        <textarea id="text" name="text" required placeholder="Текст цитати..." />
      </div>

      <div className="field">
        <label htmlFor="page">Сторінка (необовʼязково)</label>
        <input id="page" name="page" type="number" min={1} placeholder="42" />
      </div>

      <label className="row" style={{ gap: 8 }}>
        <input type="checkbox" name="favorite" />
        <span>Додати в улюблені</span>
      </label>

      {error ? <p style={{ color: "#8f2f2f" }}>{error}</p> : null}

      <button className="btn" type="submit" disabled={pending}>
        {pending ? "Зберігаю..." : "Зберегти цитату"}
      </button>
    </form>
  );
}