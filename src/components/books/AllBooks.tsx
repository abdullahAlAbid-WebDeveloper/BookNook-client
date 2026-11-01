"use client";

import { useMemo, useState } from "react";
import { BookCard } from "@/components/BookCard";
import { books, sortBooksNewestFirst } from "@/data/books";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest/60";

const categories = ["All", ...new Set(books.map((book) => book.category))];

/**
 * With a real database this would be:
 * db.books.find().sort({ createdAt: -1 })
 */
const allBooks = sortBooksNewestFirst(books);

export function AllBooks() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");

  const filteredBooks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return allBooks.filter((book) => {
      const matchesCategory =
        activeCategory === "All" || book.category === activeCategory;
      const matchesQuery =
        normalizedQuery === "" ||
        book.title.toLowerCase().includes(normalizedQuery) ||
        book.author.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

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

   

        {filteredBooks.length > 0 ? (
          <>
            <p className="mb-4 text-center text-sm text-muted-foreground">
              Showing {filteredBooks.length} of {allBooks.length} books
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </>
        ) : (
          <p className="py-16 text-center text-muted-foreground">
            No books match your search. Try a different title, author, or
            category.
          </p>
        )}
      </div>
    </section>
  );
}
