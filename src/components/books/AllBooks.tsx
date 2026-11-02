import { BooksGrid } from "@/components/books/BooksGrid";

export async function AllBooks() {
  const BooksData = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/bookData`,
    { cache: "no-store" }
  );

  const books: {
    _id: string;
    title: string;
    author: string;
    category: string;
    image: string;
  }[] = await BooksData.json();

  return (
    <section
      aria-labelledby="all-books-heading"
      className="px-5 py-14 sm:px-8 lg:px-10"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        {/* Header, same style as the homepage sections */}
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-forest">
            Catalog
          </p>
          <h2
            id="all-books-heading"
            className="mt-1 font-display text-3xl font-bold text-ink"
          >
            All books
          </h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Browse every book shared by BookNook readers across the city.
          </p>
        </div>

        {/* Search + category filter + book cards */}
        <BooksGrid books={books} />
      </div>
    </section>
  );
}
