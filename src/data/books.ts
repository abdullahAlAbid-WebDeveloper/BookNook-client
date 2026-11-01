/**
 * Dummy book data (no database is wired up yet).
 * When a real MongoDB connection exists, this would be replaced by
 * db.books.find().sort({ createdAt: -1 }).limit(6) for "New Arrivals".
 */
export type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  /** ISO date string — used to sort newest first. */
  createdAt: string;
};

export const books: Book[] = [
  {
    id: "1",
    title: "The Silent Sea",
    author: "Marion Hartley",
    category: "Mystery",
    image: "https://picsum.photos/seed/book1/400/600",
    createdAt: "2026-10-28",
  },
  {
    id: "2",
    title: "Whispers of the Old Attic",
    author: "Elena Brooks",
    category: "Horror",
    image: "https://picsum.photos/seed/book2/400/600",
    createdAt: "2026-10-25",
  },
  {
    id: "3",
    title: "A Field Guide to Falling Stars",
    author: "Tomas Reyes",
    category: "Romance",
    image: "https://picsum.photos/seed/book3/400/600",
    createdAt: "2026-10-22",
  },
  {
    id: "4",
    title: "The Cartographer's Daughter",
    author: "Priya Nair",
    category: "Historical",
    image: "https://picsum.photos/seed/book4/400/600",
    createdAt: "2026-10-19",
  },
  {
    id: "5",
    title: "Clockwork Meadow",
    author: "Jun Watanabe",
    category: "Fantasy",
    image: "https://picsum.photos/seed/book5/400/600",
    createdAt: "2026-10-15",
  },
  {
    id: "6",
    title: "Nine Days in November",
    author: "Clara Finch",
    category: "Drama",
    image: "https://picsum.photos/seed/book6/400/600",
    createdAt: "2026-10-11",
  },
  {
    id: "7",
    title: "The Last Lighthouse Keeper",
    author: "Owen Marsh",
    category: "Mystery",
    image: "https://picsum.photos/seed/book7/400/600",
    createdAt: "2026-10-07",
  },
  {
    id: "8",
    title: "Sunlight and Stone",
    author: "Amara Diallo",
    category: "Historical",
    image: "https://picsum.photos/seed/book8/400/600",
    createdAt: "2026-10-02",
  },
  {
    id: "9",
    title: "The Winter Orchard",
    author: "Ingrid Vollan",
    category: "Drama",
    image: "https://picsum.photos/seed/book9/400/600",
    createdAt: "2026-09-27",
  },
];

/** Newest first — stand-in for .sort({ createdAt: -1 }) in MongoDB. */
export const sortBooksNewestFirst = (list: Book[]) =>
  [...list].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
