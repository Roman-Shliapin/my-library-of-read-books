import Link from "next/link";
import { getQuotes } from "@/lib/actions/quotes";
import { QuoteCard } from "@/components/QuoteCard/QuoteCard";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ favorite?: string; q?: string }>;
};

export default async function QuotesPage({ searchParams }: Props) {
  const params = await searchParams;
  const favorite = params.favorite === "1";
  const q = params.q ?? "";

  const quotes = await getQuotes({ favorite: favorite || undefined, q });

  return (
    <div className="rise">
      <h1 className="pageTitle">Цитати</h1>
      <p className="pageLead">Усі уривки з твоїх книг в одному місці.</p>

      <form className="searchBar" action="/quotes">
        {favorite ? <input type="hidden" name="favorite" value="1" /> : null}
        <input name="q" defaultValue={q} placeholder="Пошук цитат..." />
      </form>

      <div className="filters">
        <Link
          href={q ? `/quotes?q=${encodeURIComponent(q)}` : "/quotes"}
          className={`filterLink ${!favorite ? "filterLinkActive" : ""}`}
        >
          Усі
        </Link>
        <Link
          href={`/quotes?favorite=1${q ? `&q=${encodeURIComponent(q)}` : ""}`}
          className={`filterLink ${favorite ? "filterLinkActive" : ""}`}
        >
          Улюблені
        </Link>
        <Link href="/quotes/new" className="filterLink">
          + Нова
        </Link>
      </div>

      {quotes.length === 0 ? (
        <div className="empty card">
          <strong>Цитат ще немає</strong>
          <p>Додай першу — з будь-якої книги.</p>
        </div>
      ) : (
        <div className="stack">
          {quotes.map((quote) => (
            <QuoteCard key={quote._id} quote={quote} />
          ))}
        </div>
      )}
    </div>
  );
}