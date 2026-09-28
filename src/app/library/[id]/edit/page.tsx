import { notFound } from "next/navigation";
import { getBookById } from "@/lib/actions/books";
import { BookForm } from "@/components/BookForm/BookForm";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditBookPage({ params }: Props) {
  const { id } = await params;
  const book = await getBookById(id);
  if (!book) notFound();

  return (
    <div className="rise">
      <h1 className="pageTitle">Редагувати</h1>
      <p className="pageLead">{book.title}</p>
      <div className="card">
        <BookForm book={book} />
      </div>
    </div>
  );
}