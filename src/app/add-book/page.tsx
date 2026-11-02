"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useSession } from "@/lib/auth-client";

const categories = ["Fiction", "Science", "History", "Kids", "Others"];

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const form = e.currentTarget;
  const formData = new FormData(form);

  const bookData = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/bookData`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...bookData,creatorEmail: bookData.userEmail}),
      },
    );

    const data = await response.json();

    console.log(bookData);
    console.log(response);
    console.log(data);

    if (data.acknowledged) {
      toast.add({
        title: "Book Added",
        description: "The book has been successfully added to the library.",
        type: "success",
      });
    }
  } catch (error) {
    console.error("Failed to add book:", error);
  }
};

export default function AddBookPage() {
  const { data: session, isPending } = useSession();
  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }
  const { user } = session || { user: { name: "", email: "" } };
  console.log(user);

  return (
    <main className="container mx-auto max-w-2xl px-4 py-10">
      <Card className="bg-cream border-line">
        <CardHeader>
          <CardTitle className="font-display text-forest text-2xl">
            Add a New Book
          </CardTitle>
          <CardDescription>
            Fill in the details below to add a book to the BookNook library.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Book Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Book Title</Label>
              <Input id="title" name="title" placeholder="Enter book title" />
            </div>

            {/* Author Name */}
            <div className="space-y-2">
              <Label htmlFor="author">Author Name</Label>
              <Input
                id="author"
                name="author"
                placeholder="Enter author name"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category">
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select a category" />
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
              <Label htmlFor="totalCopies">Total Copies</Label>
              <Input id="totalCopies" name="totalCopies" placeholder="Amount" />
            </div>

            {/* Book Image */}
            <div className="space-y-2">
              <Label htmlFor="image">Book Image URL</Label>
              <Input
                id="image"
                name="image"
                placeholder="Paste image link (imgbb / postimage)"
              />
            </div>

            {/* Short Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Write a short description about the book"
                rows={4}
              />
            </div>

            {/* User Name - read only */}
            <div className="space-y-2">
              <Label htmlFor="userName">Added By (Name)</Label>
              <Input
                id="userName"
                name="userName"
                readOnly
                value={user?.name || ""}
                placeholder="Enter your name"
              />
            </div>

            {/* User Email - read only */}
            <div className="space-y-2">
              <Label htmlFor="userEmail">Email</Label>
              <Input
                id="userEmail"
                name="userEmail"
                readOnly
                value={user?.email || ""}
                placeholder="Enter your email"
              />
            </div>


            <Button type="submit" className="w-full">
              Add Book
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
