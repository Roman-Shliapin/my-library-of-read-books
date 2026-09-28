import Link from "next/link";
import { getStats, getBooks } from "@/lib/actions/books";
import { getQuotes } from "@/lib/actions/quotes";
import { BookCard } from "@/components/BookCard/BookCard";
import { QuoteCard } from "@/components/QuoteCard/QuoteCard";
import type { Book, Quote, LibraryStats } from "@/types";
import css from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let stats: LibraryStats;
  let recentBooks: Book[] = [];
  let favoriteQuotes: Quote[] = [];

  try {
    [stats, recentBooks, favoriteQuotes] = await Promise.all([
      getStats(),
      getBooks(),
      getQuotes({ favorite: true }),
    ]);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Невідома помилка БД";
    return (
      <div className="rise">
        <h1 className="pageTitle">Моя бібліотека</h1>
        <p className="pageLead">Не вдалося підключитися до бази.</p>
        <div className="card">
          <p>{message}</p>
        </div>
      </div>
    );
  }

  const reading = recentBooks.filter((b) => b.status === "reading").slice(0, 3);
  const latest = recentBooks.slice(0, 4);

  return (
    <div className="rise">
      <h1 className="pageTitle">Твоя полиця</h1>
      <p className="pageLead">
        Книги, дати читання і цитати — усе під рукою на телефоні.
      </p>

      <div className={css.stats}>
        <div className={css.stat}>
          <strong>{stats.finishedThisYear}</strong>
          <span>цього року</span>
        </div>
        <div className={css.stat}>
          <strong>{stats.reading}</strong>
          <span>читаю зараз</span>
        </div>
        <div className={css.stat}>
          <strong>{stats.quotes}</strong>
          <span>цитат</span>
        </div>
        <div className={css.stat}>
          <strong>{stats.totalBooks}</strong>
          <span>усього книг</span>
        </div>
      </div>

      <div className="row" style={{ marginBottom: 20 }}>
        <Link href="/library/new" className="btn">
          Додати книгу
        </Link>
        <Link href="/quotes/new" className="btn btnSecondary">
          Додати цитату
        </Link>
      </div>

      {reading.length > 0 && (
        <section className={css.section}>
          <div className={css.sectionHead}>
            <h2>Зараз читаю</h2>
            <Link href="/library?status=reading">Усі</Link>
          </div>
          <div className="stack">
            {reading.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        </section>
      )}

      <section className={css.section}>
        <div className={css.sectionHead}>
          <h2>Останні книги</h2>
          <Link href="/library">Бібліотека</Link>
        </div>
        {latest.length === 0 ? (
          <div className="empty card">
            <strong>Полиця порожня</strong>
            <p>Додай першу книгу — і почнеться історія читання.</p>
          </div>
        ) : (
          <div className="stack">
            {latest.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </section>

      {favoriteQuotes.length > 0 && (
        <section className={css.section}>
          <div className={css.sectionHead}>
            <h2>Улюблені цитати</h2>
            <Link href="/quotes?favorite=1">Усі</Link>
          </div>
          <div className="stack">
            {favoriteQuotes.slice(0, 3).map((quote) => (
              <QuoteCard key={quote._id} quote={quote} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}