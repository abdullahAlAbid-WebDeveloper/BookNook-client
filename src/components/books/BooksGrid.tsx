"use client";

import { useState } from "react";
import { BookCard } from "@/components/BookCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type BookItem = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
};

export function BooksGrid({ books }: { books: BookItem[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // Get every unique category from the books data
  const categories = ["All", ...new Set(books.map((book) => book.category))];

  // Filter books by category and search text
  const filteredBooks = books.filter((book) => {
    const matchCategory =
      category === "All" || book.category === category;
    const matchSearch = book.title
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div>
      {/* Search + category buttons, styled like the homepage sections */}
      <div className="mb-8 flex flex-col items-center gap-4">
        <Input
          type="text"
          placeholder="Search books by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md rounded-lg"
        />

        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? "default" : "outline"}
              size="sm"
              className={
                category === cat
                  ? "bg-forest text-white hover:bg-forest-hover"
                  : "border-line text-ink hover:bg-cream"
              }
              onClick={() => setCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Book cards grid, same style as New Arrivals on the homepage */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {filteredBooks.map((book) => (
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
          No books found.
        </p>
      )}
    </div>
  );
}
