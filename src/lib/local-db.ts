import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import type { Book, BookStatus, LibraryStats, Quote } from "@/types";

type Store = {
  books: Book[];
  quotes: Quote[];
};

const dataDir = path.join(process.cwd(), ".data");
const dataFile = path.join(dataDir, "library.json");

async function readStore(): Promise<Store> {
  try {
    const raw = await fs.readFile(dataFile, "utf8");
    return JSON.parse(raw) as Store;
  } catch {
    return { books: [], quotes: [] };
  }
}

async function writeStore(store: Store) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(store, null, 2), "utf8");
}

function nowISO() {
  return new Date().toISOString();
}

function toDateOnly(value: Date | null) {
  if (!value) return null;
  return value.toISOString().slice(0, 10);
}

export const localDb = {
  async getBooks(filters?: { status?: BookStatus | "all"; q?: string }) {
    const store = await readStore();
    let books = [...store.books].sort(
      (a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)
    );

    if (filters?.status && filters.status !== "all") {
      books = books.filter((b) => b.status === filters.status);
    }

    if (filters?.q?.trim()) {
      const q = filters.q.trim().toLowerCase();
      books = books.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return books;
  },

  async getBookById(id: string) {
    const store = await readStore();
    return store.books.find((b) => b._id === id) ?? null;
  },

  async createBook(input: {
    title: string;
    author: string;
    status: BookStatus;
    startDate: Date | null;
    endDate: Date | null;
    rating: number | null;
    notes: string;
    coverUrl: string;
    tags: string[];
  }) {
    const store = await readStore();
    const stamp = nowISO();
    const book: Book = {
      _id: randomUUID(),
      title: input.title,
      author: input.author,
      status: input.status,
      startDate: toDateOnly(input.startDate),
      endDate: toDateOnly(input.endDate),
      rating: input.rating,
      notes: input.notes,
      coverUrl: input.coverUrl,
      tags: input.tags,
      createdAt: stamp,
      updatedAt: stamp,
    };
    store.books.unshift(book);
    await writeStore(store);
    return book;
  },

  async updateBook(
    id: string,
    input: {
      title: string;
      author: string;
      status: BookStatus;
      startDate: Date | null;
      endDate: Date | null;
      rating: number | null;
      notes: string;
      coverUrl: string;
      tags: string[];
    }
  ) {
    const store = await readStore();
    const idx = store.books.findIndex((b) => b._id === id);
    if (idx === -1) return null;

    store.books[idx] = {
      ...store.books[idx],
      title: input.title,
      author: input.author,
      status: input.status,
      startDate: toDateOnly(input.startDate),
      endDate: toDateOnly(input.endDate),
      rating: input.rating,
      notes: input.notes,
      coverUrl: input.coverUrl,
      tags: input.tags,
      updatedAt: nowISO(),
    };
    await writeStore(store);
    return store.books[idx];
  },

  async deleteBook(id: string) {
    const store = await readStore();
    store.books = store.books.filter((b) => b._id !== id);
    store.quotes = store.quotes.filter((q) => q.bookId !== id);
    await writeStore(store);
  },

  async getQuotes(filters?: { bookId?: string; favorite?: boolean; q?: string }) {
    const store = await readStore();
    let quotes = [...store.quotes].sort(
      (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
    );

    if (filters?.bookId) quotes = quotes.filter((q) => q.bookId === filters.bookId);
    if (filters?.favorite) quotes = quotes.filter((q) => q.favorite);
    if (filters?.q?.trim()) {
      const q = filters.q.trim().toLowerCase();
      quotes = quotes.filter((item) => item.text.toLowerCase().includes(q));
    }

    return quotes.map((quote) => {
      const book = store.books.find((b) => b._id === quote.bookId);
      return {
        ...quote,
        book: book
          ? { _id: book._id, title: book.title, author: book.author }
          : undefined,
      };
    });
  },

  async createQuote(input: {
    bookId: string;
    text: string;
    page: number | null;
    favorite: boolean;
  }) {
    const store = await readStore();
    const stamp = nowISO();
    const quote: Quote = {
      _id: randomUUID(),
      bookId: input.bookId,
      text: input.text,
      page: input.page,
      favorite: input.favorite,
      createdAt: stamp,
      updatedAt: stamp,
    };
    store.quotes.unshift(quote);
    await writeStore(store);
    return quote;
  },

  async toggleFavoriteQuote(id: string) {
    const store = await readStore();
    const quote = store.quotes.find((q) => q._id === id);
    if (!quote) return null;
    quote.favorite = !quote.favorite;
    quote.updatedAt = nowISO();
    await writeStore(store);
    return quote;
  },

  async deleteQuote(id: string) {
    const store = await readStore();
    store.quotes = store.quotes.filter((q) => q._id !== id);
    await writeStore(store);
  },

  async getStats(): Promise<LibraryStats> {
    const store = await readStore();
    const year = new Date().getFullYear();
    return {
      totalBooks: store.books.length,
      finished: store.books.filter((b) => b.status === "finished").length,
      reading: store.books.filter((b) => b.status === "reading").length,
      want: store.books.filter((b) => b.status === "want").length,
      quotes: store.quotes.length,
      favorites: store.quotes.filter((q) => q.favorite).length,
      finishedThisYear: store.books.filter(
        (b) =>
          b.status === "finished" &&
          b.endDate &&
          new Date(b.endDate).getFullYear() === year
      ).length,
    };
  },
};

export function useMongo() {
  return Boolean(process.env.MONGODB_URI);
}