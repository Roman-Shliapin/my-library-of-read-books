function toISO(value?: Date | null) {
  if (!value) return null;
  return value.toISOString().slice(0, 10);
}

type BookDoc = {
  _id: { toString(): string };
  title: string;
  author: string;
  status: "want" | "reading" | "finished";
  startDate?: Date | null;
  endDate?: Date | null;
  rating?: number | null;
  notes?: string;
  coverUrl?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
};

type PopulatedBook = {
  _id: { toString(): string };
  title: string;
  author: string;
};

export function serializeBook(doc: BookDoc) {
  return {
    _id: doc._id.toString(),
    title: doc.title,
    author: doc.author,
    status: doc.status,
    startDate: toISO(doc.startDate),
    endDate: toISO(doc.endDate),
    rating: doc.rating ?? null,
    notes: doc.notes ?? "",
    coverUrl: doc.coverUrl ?? "",
    tags: doc.tags ?? [],
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export function serializeQuote(doc: {
  _id: { toString(): string };
  bookId: { toString(): string } | PopulatedBook;
  text: string;
  page?: number | null;
  favorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  const populated =
    typeof doc.bookId === "object" &&
    doc.bookId !== null &&
    "title" in doc.bookId &&
    "author" in doc.bookId;

  const book = populated
    ? {
        _id: (doc.bookId as PopulatedBook)._id.toString(),
        title: (doc.bookId as PopulatedBook).title,
        author: (doc.bookId as PopulatedBook).author,
      }
    : undefined;

  const bookId = book
    ? book._id
    : typeof doc.bookId === "object" && doc.bookId !== null && "toString" in doc.bookId
      ? doc.bookId.toString()
      : String(doc.bookId);

  return {
    _id: doc._id.toString(),
    bookId,
    text: doc.text,
    page: doc.page ?? null,
    favorite: doc.favorite,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
    book,
  };
}

export const statusLabels = {
  want: "Хочу прочитати",
  reading: "Читаю",
  finished: "Прочитано",
} as const;