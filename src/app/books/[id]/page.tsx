"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import BorrowModal from "@/components/books/BorrowModal";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: string;
  userName?: string;
  creatorEmail?: string;
};

// Check if the image URL looks valid (http/https link)
const isValidImageUrl = (url?: string) => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const BookDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState(false);
  const [imgErrorShown, setImgErrorShown] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data, err: tokenError } = await authClient.token();
        if (tokenError || !data?.token) {
          setError(true);
          return;
        }
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/bookData/${id}`,
          {
            headers: {
              authorization: `Bearer ${data.token}`,
            },
          },
        );

        if (!response.ok) {
          setError(true);
          return;
        }

        const result = await response.json();
        setBook(result);

        // If the image URL is not valid, show error toast
        if (result && !isValidImageUrl(result.image)) {
          toast.add({
            title: "Invalid Image URL",
            description:
              "This book has an invalid image link. Showing placeholder cover.",
            type: "error",
          });
        }
      } catch {
        setError(true);
      }
    };
    fetchBook();
  }, [id]);

  // Borrow success hole copies left 1 kome jabe
  const handleBorrowSuccess = () => {
    if (book) {
      setBook({
        ...book,
        totalCopies: String(Number(book.totalCopies) - 1),
      });
    }
  };

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        Could not load this book. Please go back and try again.
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const copiesLeft = Number(book.totalCopies) || 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Same layout as the screenshot: cover on the left, info on the right */}
      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        {/* Cover image */}
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-muted">
          <Image
            src={
              isValidImageUrl(book.image)
                ? book.image
                : "https://picsum.photos/seed/book/400/600"
            }
            alt={`Cover of ${book.title}`}
            fill
            sizes="(min-width: 768px) 300px, 100vw"
            className="object-cover"
            onError={() => {
              // If the image fails to load, show error toast once
              if (!imgErrorShown) {
                setImgErrorShown(true);
                toast.add({
                  title: "Image Failed to Load",
                  description:
                    "The cover image could not be loaded. Showing placeholder cover.",
                  type: "error",
                });
              }
            }}
          />
        </div>

        {/* Info side */}
        <div className="flex flex-col">
          <div>
            <Badge
              variant="secondary"
              className="bg-cream-raised text-forest border-line"
            >
              {book.category || "Uncategorized"}
            </Badge>
            <h1 className="mt-3 font-display text-4xl font-bold text-ink">
              {book.title}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              by {book.author}
            </p>
          </div>

          <Separator className="bg-line my-6" />

          <p className="text-sm leading-relaxed font-medium text-ink/80">
            {book.description || "No description available for this book yet."}
          </p>

          {/* Info box: Added by + Copies left */}
          <div className="mt-8 flex flex-col gap-6 rounded-lg border border-line border-t-gold bg-cream-raised p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Added by</p>
              <p className="font-semibold text-ink">
                {book.userName || "Unknown"}
              </p>
              <p className="text-sm text-muted-foreground">
                {book.creatorEmail || ""}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Copies left</p>
              <p className="text-lg font-semibold text-ink">{copiesLeft}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center gap-4">
            <BorrowModal book={book} onSuccess={handleBorrowSuccess} />
            <Link
              href="/books"
              className="inline-flex items-center rounded-md bg-forest px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-forest-hover"
            >
              Back to all books
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;
