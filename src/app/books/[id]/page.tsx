import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BorrowModal from "@/components/books/BorrowModal";

const BookDetailsPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;

  const BookData = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/bookData/${id}`,
    { cache: "no-store" },
  );

  const book = await BookData.json();
  console.log(book);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-3xl text-ink mb-8">Book Details</h1>

      <Card className="border-line bg-cream-raised overflow-hidden py-0 shadow-sm">
        <div className="grid gap-0 md:grid-cols-[300px_1fr]">
          {/* Cover image */}
          <div className="relative aspect-[2/3] w-full bg-muted">
            <Image
              src={book?.image || "https://picsum.photos/seed/book/400/600"}
              alt={`Cover of ${book?.title || "book"}`}
              fill
              sizes="(min-width: 768px) 300px, 100vw"
              className="object-cover"
            />
          </div>

          {/* Info side */}
          <CardContent className="flex flex-col gap-4 p-6">
            <div>
              <Badge
                variant="secondary"
                className="bg-cream text-forest border-line mb-3"
              >
                {book?.category || "Uncategorized"}
              </Badge>
              <CardTitle className="font-display text-2xl leading-snug text-ink">
                {book?.title || "Untitled Book"}
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                by {book?.author || "Unknown Author"}
              </p>
            </div>

            <Separator className="bg-line" />

            <div>
              <h2 className="font-display text-lg text-ink mb-1">
                Description
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {book?.description ||
                  "No description available for this book yet."}
              </p>
            </div>

            <div>
              <h2 className="font-display text-lg text-ink mb-1">Added By</h2>
              <p className="text-sm text-muted-foreground">
                {book?.author || "Unknown"}
              </p>
            </div>

            <BorrowModal book={book} />
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default BookDetailsPage;
