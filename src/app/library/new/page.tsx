import { BookForm } from "@/components/BookForm/BookForm";

export default function NewBookPage() {
  return (
    <div className="rise">
      <h1 className="pageTitle">Нова книга</h1>
      <p className="pageLead">Додай назву, автора, статус і дати читання.</p>
      <div className="card">
        <BookForm />
      </div>
    </div>
  );
}