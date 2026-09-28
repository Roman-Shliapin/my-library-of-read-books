"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import { localDb, useMongo } from "@/lib/local-db";
import { Book } from "@/lib/models/Book";
import { Quote } from "@/lib/models/Quote";
import { serializeBook } from "@/lib/serialize";
import type { BookStatus, LibraryStats } from "@/types";

function parseDate(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string" || !value.trim()) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseTags(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string") return [];
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function parseRating(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string" || !value.trim()) return null;
  const rating = Number(value);
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) return null;
  return rating;
}

function payloadFromForm(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    author: String(formData.get("author") ?? "").trim(),
    status: (String(formData.get("status") ?? "want") as BookStatus) || "want",
    startDate: parseDate(formData.get("startDate")),
    endDate: parseDate(formData.get("endDate")),
    rating: parseRating(formData.get("rating")),
    notes: String(formData.get("notes") ?? "").trim(),
    coverUrl: String(formData.get("coverUrl") ?? "").trim(),
    tags: parseTags(formData.get("tags")),
  };
}

export async function getBooks(filters?: {
  status?: BookStatus | "all";
  q?: string;
}) {
  if (!useMongo()) return localDb.getBooks(filters);

  await connectDB();
  const query: Record<string, unknown> = {};
  if (filters?.status && filters.status !== "all") query.status = filters.status;
  if (filters?.q?.trim()) {
    const q = filters.q.trim();
    query.$or = [
      { title: { $regex: q, $options: "i" } },
      { author: { $regex: q, $options: "i" } },
      { tags: { $regex: q, $options: "i" } },
    ];
  }

  const books = await Book.find(query).sort({ updatedAt: -1 }).lean();
  return books.map((book) => serializeBook(book as never));
}

export async function getBookById(id: string) {
  if (!useMongo()) return localDb.getBookById(id);

  await connectDB();
  const book = await Book.findById(id).lean();
  if (!book) return null;
  return serializeBook(book as never);
}

export async function createBook(formData: FormData) {
  const data = payloadFromForm(formData);
  if (!data.title || !data.author) {
    return { ok: false as const, error: "Назва і автор обов'язкові" };
  }

  if (!useMongo()) {
    const book = await localDb.createBook(data);
    revalidatePath("/");
    revalidatePath("/library");
    return { ok: true as const, id: book._id };
  }

  await connectDB();
  const book = await Book.create(data);
  revalidatePath("/");
  revalidatePath("/library");
  return { ok: true as const, id: book._id.toString() };
}

export async function updateBook(id: string, formData: FormData) {
  const data = payloadFromForm(formData);
  if (!data.title || !data.author) {
    return { ok: false as const, error: "Назва і автор обов'язкові" };
  }

  if (!useMongo()) {
    await localDb.updateBook(id, data);
  } else {
    await connectDB();
    await Book.findByIdAndUpdate(id, data);
  }

  revalidatePath("/");
  revalidatePath("/library");
  revalidatePath(`/library/${id}`);
  return { ok: true as const };
}

export async function deleteBook(id: string) {
  if (!useMongo()) {
    await localDb.deleteBook(id);
  } else {
    await connectDB();
    await Quote.deleteMany({ bookId: id });
    await Book.findByIdAndDelete(id);
  }

  revalidatePath("/");
  revalidatePath("/library");
  revalidatePath("/quotes");
  return { ok: true as const };
}

export async function getStats(): Promise<LibraryStats> {
  if (!useMongo()) return localDb.getStats();

  await connectDB();
  const yearStart = new Date(new Date().getFullYear(), 0, 1);

  const [totalBooks, finished, reading, want, quotes, favorites, finishedThisYear] =
    await Promise.all([
      Book.countDocuments(),
      Book.countDocuments({ status: "finished" }),
      Book.countDocuments({ status: "reading" }),
      Book.countDocuments({ status: "want" }),
      Quote.countDocuments(),
      Quote.countDocuments({ favorite: true }),
      Book.countDocuments({ status: "finished", endDate: { $gte: yearStart } }),
    ]);

  return {
    totalBooks,
    finished,
    reading,
    want,
    quotes,
    favorites,
    finishedThisYear,
  };
}