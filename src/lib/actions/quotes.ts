"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/db";
import { localDb, useMongo } from "@/lib/local-db";
import { Quote } from "@/lib/models/Quote";
import { serializeQuote } from "@/lib/serialize";

export async function getQuotes(filters?: {
  bookId?: string;
  favorite?: boolean;
  q?: string;
}) {
  if (!useMongo()) return localDb.getQuotes(filters);

  await connectDB();
  const query: Record<string, unknown> = {};
  if (filters?.bookId) query.bookId = filters.bookId;
  if (filters?.favorite) query.favorite = true;
  if (filters?.q?.trim()) {
    query.text = { $regex: filters.q.trim(), $options: "i" };
  }

  const quotes = await Quote.find(query)
    .populate("bookId", "title author")
    .sort({ createdAt: -1 })
    .lean();

  return quotes.map((quote) => serializeQuote(quote as never));
}

export async function createQuote(formData: FormData) {
  const bookId = String(formData.get("bookId") ?? "").trim();
  const text = String(formData.get("text") ?? "").trim();
  if (!bookId || !text) {
    return { ok: false as const, error: "Книга і текст цитати обов'язкові" };
  }

  const pageRaw = String(formData.get("page") ?? "").trim();
  const pageNum = pageRaw ? Number(pageRaw) : null;
  const page = Number.isFinite(pageNum) ? pageNum : null;
  const favorite = formData.get("favorite") === "on";

  if (!useMongo()) {
    const quote = await localDb.createQuote({ bookId, text, page, favorite });
    revalidatePath("/");
    revalidatePath("/quotes");
    revalidatePath(`/library/${bookId}`);
    return { ok: true as const, id: quote._id };
  }

  await connectDB();
  const quote = await Quote.create({ bookId, text, page, favorite });
  revalidatePath("/");
  revalidatePath("/quotes");
  revalidatePath(`/library/${bookId}`);
  return { ok: true as const, id: quote._id.toString() };
}

export async function toggleFavoriteQuote(id: string) {
  if (!useMongo()) {
    const quote = await localDb.toggleFavoriteQuote(id);
    if (!quote) return { ok: false as const };
    revalidatePath("/quotes");
    revalidatePath(`/library/${quote.bookId}`);
    return { ok: true as const, favorite: quote.favorite };
  }

  await connectDB();
  const quote = await Quote.findById(id);
  if (!quote) return { ok: false as const };

  quote.favorite = !quote.favorite;
  await quote.save();

  revalidatePath("/quotes");
  revalidatePath(`/library/${quote.bookId.toString()}`);
  return { ok: true as const, favorite: quote.favorite };
}

export async function deleteQuote(id: string, bookId: string) {
  if (!useMongo()) {
    await localDb.deleteQuote(id);
  } else {
    await connectDB();
    await Quote.findByIdAndDelete(id);
  }

  revalidatePath("/");
  revalidatePath("/quotes");
  revalidatePath(`/library/${bookId}`);
  return { ok: true as const };
}