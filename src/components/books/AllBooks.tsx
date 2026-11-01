import { BookCard } from "@/components/BookCard";

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

        {/* Render each book with the reusable BookCard */}
        {books.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
            {books.map((book) => (
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
          <p className="py-16 text-center text-muted-foreground">
            No books found yet.
          </p>
        )}
      </div>
    </section>
  );
}
