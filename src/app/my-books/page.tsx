"use client";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { BookCard } from "@/components/BookCard";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  creatorEmail: string;
};

export default function MyBooksPage() {
  const { data: session, isPending } = useSession();
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = session || { user: { name: "", email: "" } };

  // Load the books added by this user
  useEffect(() => {
    if (!user.email) {
      setLoading(false);
      return;
    }

    const fetchMyBooks = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/bookData?email=${user.email}`
        );
        const data: Book[] = await response.json();

        // Only keep books the user added
        const filterBooks = data.filter(
          (book) => book.creatorEmail === user.email
        );
        setMyBooks(filterBooks);
      } catch (error) {
        console.error("Failed to fetch my books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBooks();
  }, [user.email]);

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const focusRing =
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest/60";

  return (
    <main>
      <section
        aria-labelledby="my-books-heading"
        className="px-5 py-14 sm:px-8 lg:px-10"
      >
        <div className="mx-auto w-full max-w-[1400px]">
          {/* Header, same style as the other pages */}
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-forest">
              My Shelf
            </p>
            <h2
              id="my-books-heading"
              className="mt-1 font-display text-3xl font-bold text-ink"
            >
              My books
            </h2>
            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              All the books you have added to the BookNook library.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : myBooks.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
              {myBooks.map((book) => (
                <BookCard
                  key={book._id}
                  _id={book._id}
                  title={book.title}
                  author={book.author}
                  category={book.category}
                  image={book.image}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">
                You have not added any books yet.
              </p>
              <Link
                href="/add-book"
                className={`mt-4 inline-flex h-11 items-center justify-center rounded-lg bg-forest px-6 text-sm font-semibold text-white transition-colors hover:bg-forest-hover ${focusRing}`}
              >
                Add Your First Book
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
