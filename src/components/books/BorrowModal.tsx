"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/lib/auth-client";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";

const BorrowModal = ({
  book,
  onSuccess,
}: {
  book: { _id?: string; title?: string; totalCopies?: string };
  onSuccess?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session, isPending } = useSession();
  console.log("session",session,"pend",isPending);
  

  const handleConfirmBorrow = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userName = session?.user?.name;
    const userEmail = session?.user?.email;
    if (!userName || !userEmail) {
      toast.add({
        title: "User not logged in",
        description: "Please log in to borrow a book.",
        type: "error",
      });
      return;
    }

    // If no copies are left, show a toast and stop
    if (Number(book?.totalCopies) <= 0) {
      toast.add({
        title: "No Copies Available",
        description: `Sorry, "${book?.title ?? "this book"}" has no copies left right now.`,
        type: "error",
      });
      return;
    }

    setLoading(true);

    // Get the JWT token from better-auth (uses your logged-in session cookie)
    const tokenResponse = await fetch("/api/auth/token");
    const tokenData = await tokenResponse.json();
    const token = tokenData.token;

    const borrowData = {
      bookId: book?._id,
      bookTitle: book?.title,
      userName: userName,
      userEmail: userEmail,
      borrowDate: new Date().toISOString(),
      status: "pending",
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/bookData/borrow`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(borrowData),
        },
      );

      const data = await response.json();
      console.log(data);

      if (data.acknowledged) {
        toast.add({
          title: "Borrow Request Sent",
          description: `You requested to borrow "${book?.title ?? "this book"}".`,
          type: "success",
        });
        onSuccess?.();
        setOpen(false);
      } else {
        toast.add({
          title: "Cannot Borrow",
          description: data.error || "Could not send the borrow request. Try again.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Failed to borrow book:", error);
      toast.add({
        title: "Something went wrong",
        description: "Could not send the borrow request. Try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center">
        <Spinner className="h-4 w-4" />
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Copies 0 hole button dialog open kore na, shudhu toast dekhay */}
      <Button
        className="bg-forest text-cream hover:bg-forest-hover"
        onClick={() => {
          if (Number(book?.totalCopies) <= 0) {
            toast.add({
              title: "No Copies Available",
              description: `Sorry, "${book?.title ?? "this book"}" has no copies left right now.`,
              type: "error",
            });
            return;
          }
          setOpen(true);
        }}
      >
        Borrow This Book
      </Button>

      <DialogContent className="border-line bg-cream-raised sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-ink">
            Borrow This Book
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Your details are shown below. Confirm to borrow.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-4 py-2" onSubmit={handleConfirmBorrow}>
          <div className="grid gap-2">
            <Label htmlFor="name">User Name</Label>
            <Input
              id="name"
              placeholder="name"
              value={session?.user?.name}
              readOnly
              className="border-line bg-cream "
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={session?.user?.email}
              readOnly
              className="border-line bg-cream"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Confirm Borrow"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BorrowModal;
