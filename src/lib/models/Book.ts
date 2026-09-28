import { Schema, models, model } from "mongoose";

export type BookStatus = "want" | "reading" | "finished";

export interface IBook {
  title: string;
  author: string;
  status: BookStatus;
  startDate?: Date | null;
  endDate?: Date | null;
  rating?: number | null;
  notes?: string;
  coverUrl?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["want", "reading", "finished"],
      default: "want",
    },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    rating: { type: Number, min: 1, max: 5, default: null },
    notes: { type: String, default: "" },
    coverUrl: { type: String, default: "" },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Book = models.Book || model<IBook>("Book", BookSchema);