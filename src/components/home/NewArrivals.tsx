import Link from "next/link";
import { BookCard } from "@/components/BookCard";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest/60";

export async function NewArrivals() {
  const BooksData = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/bookData`,
    { cache: "no-store" }
  );

  const allBooks: {
    _id: string;
    title: string;
    author: string;
    category: string;
    image: string;
  }[] = await BooksData.json();

  // Mimics db.books.find().sort({ createdAt: -1 }).limit(6)
  const newArrivals = allBooks.slice(-6).reverse();

  return (
    <section aria-labelledby="new-arrivals-heading" className="px-5 py-14 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="mb-8 text-center">
          <p className="eyebrow">
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
