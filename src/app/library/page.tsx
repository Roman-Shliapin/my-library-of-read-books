import Link from "next/link";
import { getBooks } from "@/lib/actions/books";
import { BookCard } from "@/components/BookCard/BookCard";
import type { BookStatus } from "@/types";

export const dynamic = "force-dynamic";

const filters: { value: "all" | BookStatus; label: string }[] = [
  { value: "all", label: "Усі" },
  { value: "reading", label: "Читаю" },
  { value: "finished", label: "Прочитано" },
  { value: "want", label: "Хочу" },
];

type Props = {
  searchParams: Promise<{ status?: string; q?: string }>;
};

export default async function LibraryPage({ searchParams }: Props) {
  const params = await searchParams;
  const status = (params.status as BookStatus | "all" | undefined) ?? "all";
  const q = params.q ?? "";

  const books = await getBooks({ status, q });

  return (
    <div className="rise">
      <h1 className="pageTitle">Бібліотека</h1>
      <p className="pageLead">Усі книги з датами початку і кінця читання.</p>

      <form className="searchBar" action="/library">
        {status !== "all" ? <input type="hidden" name="status" value={status} /> : null}
        <input name="q" defaultValue={q} placeholder="Пошук за назвою, автором, тегом..." />
      </form>

      <div className="filters">
        {filters.map((filter) => {
          const href =
            filter.value === "all"
              ? q
                ? `/library?q=${encodeURIComponent(q)}`
                : "/library"
              : `/library?status=${filter.value}${q ? `&q=${encodeURIComponent(q)}` : ""}`;
          const active = status === filter.value;
          return (
            <Link
              key={filter.value}
              href={href}
              className={`filterLink ${active ? "filterLinkActive" : ""}`}
            >
              {filter.label}
            </Link>
          );
        })}
      </div>

      {books.length === 0 ? (
        <div className="empty card">
          <strong>Нічого не знайдено</strong>
          <p>Спробуй інший фільтр або додай нову книгу.</p>
          <div style={{ marginTop: 16 }}>
            <Link href="/library/new" className="btn">
              Додати книгу
            </Link>
          </div>
        </div>
      ) : (
        <div className="stack">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}