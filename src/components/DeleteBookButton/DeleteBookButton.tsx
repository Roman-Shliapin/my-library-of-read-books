"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteBook } from "@/lib/actions/books";

export function DeleteBookButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="btn btnDanger"
      disabled={pending}
      onClick={() => {
        if (!confirm("Видалити книгу і всі її цитати?")) return;
        startTransition(async () => {
          await deleteBook(id);
          router.push("/library");
          router.refresh();
        });
      }}
    >
      {pending ? "Видаляю..." : "Видалити"}
    </button>
  );
}