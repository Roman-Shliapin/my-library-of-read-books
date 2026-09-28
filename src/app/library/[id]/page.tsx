import Link from "next/link";
import { notFound } from "next/navigation";
import { getBookById } from "@/lib/actions/books";
import { getQuotes } from "@/lib/actions/quotes";
import { statusLabels } from "@/lib/serialize";
import { QuoteCard } from "@/components/QuoteCard/QuoteCard";
import { DeleteBookButton } from "@/components/DeleteBookButton/DeleteBookButton";
import css from "./page.module.css";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BookDetailPage({ params }: Props) {
  const { id } = await params;
  const book = await getBookById(id);
  if (!book) notFound();

  const quotes = await getQuotes({ bookId: id });

  const badgeClass =
    book.status === "finished"
      ? "badgeFinished"
      : book.status === "reading"
        ? "badgeReading"
        : "badgeWant";

  return (
    <div className="rise">
      <div className={css.hero}>
        <div className={css.cover} aria-hidden>
          {book.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={book.coverUrl} alt="" />
          ) : (
            <span>{book.title.slice(0, 1)}</span>
          )}
        </div>
        <div>
          <span className={`badge ${badgeClass}`}>{statusLabels[book.status]}</span>
          <h1 className={css.title}>{book.title}</h1>
          <p className={css.author}>{book.author}</p>
          {(book.startDate || book.endDate) && (
            <p className={css.dates}>
              {book.startDate ?? "…"} → {book.endDate ?? "зараз"}
            </p>
          )}
          {book.rating ? (
            <p className="stars">{"★".repeat(book.rating)}{"☆".repeat(5 - book.rating)}</p>
          ) : null}
        </div>
      </div>

      {book.tags.length > 0 && (
        <div className="row" style={{ marginBottom: 14 }}>
          {book.tags.map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
        </div>
      )}

      {book.notes ? (
        <div className="card" style={{ marginBottom: 16 }}>
          <h2 className={css.blockTitle}>Нотатки</h2>
          <p className={css.notes}>{book.notes}</p>
        </div>
      ) : null}

      <div className="row" style={{ marginBottom: 24 }}>
        <Link href={`/library/${book._id}/edit`} className="btn btnSecondary">
          Редагувати
        </Link>
        <Link href={`/quotes/new?bookId=${book._id}`} className="btn">
          + Цитата
        </Link>
        <DeleteBookButton id={book._id} />
      </div>

      <section>
        <div className={css.sectionHead}>
          <h2>Цитати ({quotes.length})</h2>
        </div>
        {quotes.length === 0 ? (
          <div className="empty card">
            <strong>Поки без цитат</strong>
            <p>Збережи уривок, який хочеш памʼятати.</p>
          </div>
        ) : (
          <div className="stack">
            {quotes.map((quote) => (
              <QuoteCard key={quote._id} quote={quote} showBook={false} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}