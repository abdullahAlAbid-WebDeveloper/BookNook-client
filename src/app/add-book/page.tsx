"use client";
import { useState } from "react";
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

// Check if the image URL looks valid (http/https link)
const isValidImageUrl = (url?: string) => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const form = e.currentTarget;
  const formData = new FormData(form);

  const bookData = Object.fromEntries(formData.entries());

  // Check if any book field is empty
  if (
    !bookData.title ||
    !bookData.author ||
    !bookData.category ||
    !bookData.totalCopies ||
    !bookData.image ||
    !bookData.description
  ) {
    toast.add({
      title: "Missing Information",
      description: "Please fill in all the book fields before submitting.",
      type: "error",
    });
    return;
  }

  // Get the JWT token from better-auth (uses your logged-in session cookie)
  const tokenResponse = await fetch("/api/auth/token");
  const tokenData = await tokenResponse.json();
  const token = tokenData.token;
  console.log(token);

  // Check if totalCopies is a valid number
  if (Number.isNaN(Number(bookData.totalCopies)) || !bookData.totalCopies) {
    toast.add({
      title: "Invalid Total Copies",
      description: "Total copies must be a number.",
      type: "error",
    });
    return;
  }

  // Check if the image URL is valid
  if (!isValidImageUrl(String(bookData.image))) {
    toast.add({
      title: "Invalid Image URL",
      description: "Please paste a valid image link (starting with http or https).",
      type: "error",
    });
    return;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/bookData`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...bookData,
          creatorEmail: bookData.userEmail,
        }),
      },
    );

    const data = await response.json();

    if (data.acknowledged) {
      toast.add({
        title: "Book Added",
        description: "The book has been successfully added to the library.",
        type: "success",
      });
      form.reset();
    } else {
      toast.add({
        title: "Failed to Add",
        description: data.error || "Something went wrong. Please try again.",
        type: "error",
      });
    }
  } catch (error) {
    console.error("Failed to add book:", error);
    toast.add({
      title: "Failed to Add",
      description: "Could not connect to the server. Please try again.",
      type: "error",
    });
  }
};

export default function AddBookPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [totalCopies, setTotalCopies] = useState("1");
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
        <div
          className="h-[4px] w-full rounded-t-xl"
          style={{
            background:
              "linear-gradient(90deg, var(--forest) 0%, var(--gold) 60%, transparent 100%)",
          }}
        />
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
              <div className="flex items-center gap-2">
                {/* Minus button */}
                <Button
                  type="button"
                  variant="outline"
                  className="border-line bg-cream px-3"
                  onClick={() => {
                    const current = Number(totalCopies) || 0;
                    if (current > 0) {
                      setTotalCopies(String(current - 1));
                    }
                  }}
                >
                  −
                </Button>
                <Input
                  id="totalCopies"
                  name="totalCopies"
                  placeholder="Amount"
                  value={totalCopies}
                  onChange={(e) => {
                    // Only numbers are allowed
                    const value = e.currentTarget.value.replace(/[^0-9]/g, "");
                    setTotalCopies(value);
                  }}
                />
                {/* Plus button */}
                <Button
                  type="button"
                  variant="outline"
                  className="border-line bg-cream px-3"
                  onClick={() => {
                    const current = Number(totalCopies) || 0;
                    setTotalCopies(String(current + 1));
                  }}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Book Image */}
            <div className="space-y-2">
              <Label htmlFor="image">Book Image URL</Label>
              <Input
                id="image"
                name="image"
                placeholder="Paste image link (imgbb / postimage)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.currentTarget.value)}
                onBlur={() => {
                  // Show toast when leaving the field with an invalid URL
                  if (imageUrl && !isValidImageUrl(imageUrl)) {
                    toast.add({
                      title: "Invalid Image URL",
                      description:
                        "The image link must start with http or https.",
                      type: "error",
                    });
                  }
                }}
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
