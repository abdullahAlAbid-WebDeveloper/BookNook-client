import Link from "next/link";
import { BookCard } from "@/components/BookCard";
import { books, sortBooksNewestFirst } from "@/data/books";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest/60";

/**
 * With a real database this would be a single Mongo query:
 * db.books.find().sort({ createdAt: -1 }).limit(6)
 */
const newArrivals = sortBooksNewestFirst(books).slice(0, 6);

export function NewArrivals() {
  return (
    <section aria-labelledby="new-arrivals-heading" className="px-5 py-14 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-forest">
            New Arrivals
          </p>
          <h2
            id="new-arrivals-heading"
            className="mt-1 font-display text-3xl font-bold text-ink"
          >
            Fresh on the shelves
          </h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            The newest books added by BookNook readers, updated every week.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-5">
          {newArrivals.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/books"
            className={`inline-flex h-11 items-center justify-center rounded-lg bg-forest px-6 text-sm font-semibold text-white transition-colors hover:bg-forest-hover ${focusRing}`}
          >
            See All Books
          </Link>
        </div>
      </div>
    </section>
  );
}
