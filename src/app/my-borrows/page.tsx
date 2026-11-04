"use client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { authClient, useSession } from "@/lib/auth-client";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function MyBorrowsPage() {
  const handleDelete = async (borrow: { _id: string; bookTitle: string }) => {
    try {
      // Get the JWT token from better-auth (uses your logged-in session cookie)
      const tokenResponse = await fetch("/api/auth/token");
      const tokenData = await tokenResponse.json();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/bookData/borrow/${borrow._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        },
      );
      const data = await response.json();

      if (data.acknowledged) {
        setBorrowedBooks(
          (books) => books?.filter((book) => book._id !== borrow._id) ?? null,
        );
        toast.add({
          title: "Book Returned",
          description: `"${borrow.bookTitle}" has been returned.`,
          type: "success",
        });
      } else {
        toast.add({
          title: "Delete Failed",
          description: "The book could not be deleted. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Failed to delete book:", error);
      toast.add({
        title: "Delete Failed",
        description: "The book could not be deleted. Please try again.",
        type: "error",
      });
    }
  };
  const { data: session, isPending } = useSession();
  const [borrowedBooks, setBorrowedBooks] = useState<
    | {
        _id: string;
        bookTitle: string;
        borrowDate: string;
        returnDate?: string;
        userName?: string;
        status: string;
      }[]
    | null
  >(null);
  const [error, setError] = useState(false);

  const email = session?.user?.email;

  useEffect(() => {
    if (!email) return;

    // Get the JWT token from better-auth (uses your logged-in session cookie)
    const fetchBorrowedBooks = async () => {
      try {
        const tokenResponse = await fetch("/api/auth/token");
        const tokenData = await tokenResponse.json();

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/bookData/borrow/${encodeURIComponent(email)}`,
          {
            headers: {
              Authorization: `Bearer ${tokenData.token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch borrowed books");
        }
        const data = await response.json();
        setBorrowedBooks(data);
      } catch {
        setError(true);
      }
    };

    fetchBorrowedBooks();
  }, [email]);

  if (isPending || (email && !borrowedBooks && !error)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">
          You must be logged in to view this page.
        </p>
        <Link
          href="/login"
          className="ml-4 text-forest hover:text-forest-hover"
        >
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">My Borrows</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {borrowedBooks && borrowedBooks.length > 0
              ? `You have borrowed ${borrowedBooks.length} ${borrowedBooks.length === 1 ? "book" : "books"}.`
              : "Track your borrowed books here. You haven't borrowed any books yet."}
          </p>
        </div>
        <Link
          href="/books"
          className="inline-flex w-fit items-center rounded-md bg-forest px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-forest-hover"
        >
          Browse All Books
        </Link>
      </div>

      {error ? (
        <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
          Couldn&apos;t fetch borrowed books
        </div>
      ) : borrowedBooks && borrowedBooks.length > 0 ? (
        <div className="mt-10 w-full overflow-x-auto rounded-xl border border-line bg-cream-raised">
          <Table className="w-full table-fixed">
            <TableHeader>
              <TableRow className="border-line hover:bg-transparent">
                <TableHead className="px-4 text-ink">bookTitle</TableHead>
                <TableHead className="px-4 text-ink">borrowDate</TableHead>
                <TableHead className="px-4 text-ink">userName</TableHead>
                <TableHead className="px-4 text-ink">Return Date</TableHead>
                <TableHead className="px-4 text-right text-ink">
                  status
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {borrowedBooks.map((borrow) => {
                const borrowDate = new Date(borrow.borrowDate);
                const returnDate = borrow.returnDate
                  ? new Date(borrow.returnDate)
                  : new Date(borrowDate.getTime() + 7 * 24 * 60 * 60 * 1000);

                const fmt = (d: Date) =>
                  d.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                return (
                  <TableRow
                    key={borrow._id}
                    className="border-line hover:bg-cream"
                  >
                    <TableCell className="whitespace-normal px-4 py-3 font-medium text-ink">
                      {borrow.bookTitle}
                    </TableCell>

                    <TableCell className="whitespace-nowrap px-4 py-3 text-ink">
                      {fmt(borrowDate)}
                    </TableCell>

                    <TableCell className="whitespace-normal px-4 py-3 font-medium text-ink">
                      {borrow.userName}
                    </TableCell>

                    <TableCell className="whitespace-nowrap px-4 py-3 text-ink">
                      {fmt(returnDate)}
                    </TableCell>

                    <TableCell className="px-4 py-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-line bg-cream text-ink"
                        onClick={() => handleDelete(borrow)}
                      >
                        Return Book
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-dashed border-line bg-cream-raised p-12 text-center">
          <p className="font-display text-lg text-ink">No borrowed books yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Books you borrow will show up here.
          </p>
        </div>
      )}
    </div>
  );
}
