import { Schema, models, model, Types } from "mongoose";

export interface IQuote {
  bookId: Types.ObjectId;
  text: string;
  page?: number | null;
  favorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const QuoteSchema = new Schema<IQuote>(
  {
    bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true, index: true },
    text: { type: String, required: true, trim: true },
    page: { type: Number, default: null },
    favorite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Quote = models.Quote || model<IQuote>("Quote", QuoteSchema);