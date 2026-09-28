"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Book } from "@/types";
import { createBook, updateBook } from "@/lib/actions/books";

type Props = {
  book?: Book;
};

export function BookForm({ book }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = book
        ? await updateBook(book._id, formData)
        : await createBook(formData);

      if (!result.ok) {
        setError(result.error ?? "Помилка збереження");
        return;
      }

      const id = book?._id ?? ("id" in result ? result.id : null);
      router.push(id ? `/library/${id}` : "/library");
      router.refresh();
    });
  }

  return (
    <form action={onSubmit} className="stack">
      <div className="field">
        <label htmlFor="title">Назва</label>
        <input id="title" name="title" required defaultValue={book?.title ?? ""} placeholder="Назва книги" />
      </div>

      <div className="field">
        <label htmlFor="author">Автор</label>
        <input id="author" name="author" required defaultValue={book?.author ?? ""} placeholder="Ім'я автора" />
      </div>

      <div className="field">
        <label htmlFor="status">Статус</label>
        <select id="status" name="status" defaultValue={book?.status ?? "want"}>
          <option value="want">Хочу прочитати</option>
          <option value="reading">Читаю</option>
          <option value="finished">Прочитано</option>
        </select>
      </div>

      <div className="row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div className="field">
          <label htmlFor="startDate">Початок</label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            defaultValue={book?.startDate ?? ""}
          />
        </div>
        <div className="field">
          <label htmlFor="endDate">Кінець</label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            defaultValue={book?.endDate ?? ""}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="rating">Оцінка (1–5)</label>
        <select id="rating" name="rating" defaultValue={book?.rating?.toString() ?? ""}>
          <option value="">Без оцінки</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="coverUrl">Обкладинка (URL)</label>
        <input
          id="coverUrl"
          name="coverUrl"
          type="url"
          defaultValue={book?.coverUrl ?? ""}
          placeholder="https://..."
        />
      </div>

      <div className="field">
        <label htmlFor="tags">Теги (через кому)</label>
        <input
          id="tags"
          name="tags"
          defaultValue={book?.tags?.join(", ") ?? ""}
          placeholder="фантастика, класика"
        />
      </div>

      <div className="field">
        <label htmlFor="notes">Нотатки</label>
        <textarea
          id="notes"
          name="notes"
          defaultValue={book?.notes ?? ""}
          placeholder="Короткі враження..."
        />
      </div>

      {error ? <p style={{ color: "#8f2f2f" }}>{error}</p> : null}

      <button className="btn" type="submit" disabled={pending}>
        {pending ? "Зберігаю..." : book ? "Оновити книгу" : "Додати книгу"}
      </button>
    </form>
  );
}