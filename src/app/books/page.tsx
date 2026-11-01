import { AllBooks } from "@/components/books/AllBooks";

export const metadata = {
  title: "All Books",
};

// This route reads fresh data, so do not prerender it statically.

export default function AllBooksPage() {
  return <AllBooks />;
}
