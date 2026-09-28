export type BookStatus = "want" | "reading" | "finished";

export interface Book {
  _id: string;
  title: string;
  author: string;
  status: BookStatus;
  startDate?: string | null;
  endDate?: string | null;
  rating?: number | null;
  notes?: string;
  coverUrl?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Quote {
  _id: string;
  bookId: string;
  text: string;
  page?: number | null;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  book?: Pick<Book, "_id" | "title" | "author">;
}

export interface LibraryStats {
  totalBooks: number;
  finished: number;
  reading: number;
  want: number;
  quotes: number;
  favorites: number;
  finishedThisYear: number;
}