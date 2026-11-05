"use client";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import Image from "next/image";

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  totalCopies?: number;
  creatorEmail: string;
};

const categories = ["Fiction", "Science", "History", "Kids", "Others"];

export default function MyBooksPage() {
  const { data: session, isPending } = useSession();
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const { user } = session || { user: { name: "", email: "" } };

  // Load the books added by this user
  useEffect(() => {
    if (!user.email) return;

    let cancelled = false;

    const loadBooks = async () => {
      try {
        // Get the JWT token from better-auth (uses your logged-in session cookie)
        const tokenResponse = await fetch("/api/auth/token");
        const tokenData = await tokenResponse.json();

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/myBooks/${encodeURIComponent(user.email)}`,
          {
            headers: {
              Authorization: `Bearer ${tokenData.token}`,
            },
          },
        );
        const data: Book[] = await response.json();
        if (!cancelled) {
          setMyBooks(data);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    };

    void loadBooks();
    return () => {
      cancelled = true;
    };
  }, [user.email]);

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
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

  // Delete a book by its id

  const handleDelete = async (book: Book) => {
    try {
      const tokenResponse = await fetch("/api/auth/token");
      const tokenData = await tokenResponse.json();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/bookData/${book._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        },
      );
      const data = await response.json();

      if (data.acknowledged) {
        // Remove the book from the list
        setMyBooks(myBooks.filter((b) => b._id !== book._id));
        toast.add({
          title: "Book Deleted",
          description: `"${book.title}" has been removed from the library.`,
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

  // Save the edited book by its id
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingBook) {
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const bookData = Object.fromEntries(formData.entries());

    try {
      const tokenResponse = await fetch("/api/auth/token");
      const tokenData = await tokenResponse.json();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/bookData/${editingBook._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.token}`,
          },
          body: JSON.stringify(bookData),
        },
      );
      const data = await response.json();

      if (data.acknowledged) {
        // Update the book in the list
        setMyBooks(
          myBooks.map((b) =>
            b._id === editingBook._id
              ? { ...b, ...bookData, totalCopies: Number(bookData.totalCopies) }
              : b,
          ),
        );
        setEditingBook(null);
        toast.add({
          title: "Book Updated",
          description: "The book details have been saved.",
          type: "success",
        });
      } else {
        toast.add({
          title: "Update Failed",
          description: "The book could not be updated. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Failed to update book:", error);
      toast.add({
        title: "Update Failed",
        description: "The book could not be updated. Please try again.",
        type: "error",
      });
    }
  };

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

          {error ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">
                An error occurred while fetching your books.
              </p>
            </div>
          ) : loading ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : myBooks.length > 0 ? (
            <div className="rounded-xl border border-line bg-background p-3">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-semibold text-ink">
                      Book
                    </TableHead>
                    <TableHead className="font-semibold text-ink">
                      Category
                    </TableHead>
                    <TableHead className="font-semibold text-ink">
                      Copies
                    </TableHead>
                    <TableHead className="text-right font-semibold text-ink">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myBooks.map((book) => (
                    <TableRow key={book._id}>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          {/* Book cover */}
                          <Image
                            src={book.image}
                            width={23}
                            height={46}
                            alt={book.title}
                            className="h-16 w-11 rounded-md border border-line object-cover"
                          />
                          <div>
                            <p className="font-semibold text-ink">
                              {book.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {book.author}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-forest/10 text-forest hover:bg-forest/15">
                          {book.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{book.totalCopies ?? "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-line hover:bg-cream"
                            onClick={() => setEditingBook(book)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-200 bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700"
                            onClick={() => handleDelete(book)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">
                You have not added any books yet.
              </p>
              <Link
                href="/add-book"
                className="mt-4 inline-flex h-11 items-center justify-center rounded-lg bg-forest px-6 text-sm font-semibold text-white transition-colors hover:bg-forest-hover"
              >
                Add Your First Book
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Edit dialog, same form as the Add Book page */}
      <Dialog
        open={editingBook !== null}
        onOpenChange={(open) => {
          if (!open) {
            setEditingBook(null);
          }
        }}
      >
        <DialogContent className="bg-cream">
          <DialogHeader>
            <DialogTitle className="font-display text-forest">
              Edit Book
            </DialogTitle>
            <DialogDescription>
              Update the details of &quot;{editingBook?.title}&quot;.
            </DialogDescription>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={handleUpdate}
            key={editingBook?._id}
          >
            {/* Book Title */}
            <div className="space-y-2">
              <Label htmlFor="edit-title">Book Title</Label>
              <Input
                id="edit-title"
                name="title"
                defaultValue={editingBook?.title}
              />
            </div>

            {/* Author Name */}
            <div className="space-y-2">
              <Label htmlFor="edit-author">Author Name</Label>
              <Input
                id="edit-author"
                name="author"
                defaultValue={editingBook?.author}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select name="category" defaultValue={editingBook?.category}>
                <SelectTrigger id="edit-category" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-totalCopies">Total Copies</Label>
              <Input
                id="edit-totalCopies"
                name="totalCopies"
                defaultValue={editingBook?.totalCopies}
              />
            </div>

            {/* Book Image */}
            <div className="space-y-2">
              <Label htmlFor="edit-image">Book Image URL</Label>
              <Input
                id="edit-image"
                name="image"
                defaultValue={editingBook?.image}
              />
            </div>

            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
