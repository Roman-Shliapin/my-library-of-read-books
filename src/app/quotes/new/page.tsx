import { getBooks } from "@/lib/actions/books";
import { QuoteForm } from "@/components/QuoteForm/QuoteForm";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ bookId?: string }>;
};

export default async function NewQuotePage({ searchParams }: Props) {
  const params = await searchParams;
  const books = await getBooks();

  return (
    <div className="rise">
      <h1 className="pageTitle">Нова цитата</h1>
      <p className="pageLead">Збережи уривок і за потреби познач сторінку.</p>
      <div className="card">
        <QuoteForm books={books} defaultBookId={params.bookId} />
      </div>
    </div>
  );
}