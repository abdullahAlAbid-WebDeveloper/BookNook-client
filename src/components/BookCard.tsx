import Image from "next/image";
import Link from "next/link";
import type { Book } from "@/data/books";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest/60";

type BookCardProps = {
  book: Book;
};

export function BookCard({ book }: BookCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-line bg-cream-raised shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[2/3] w-full bg-muted">
        <Image
          src={book.image}
          alt={`Cover of ${book.title}`}
          fill
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-display text-lg leading-snug text-ink">
          {book.title}
        </h3>
        <p className="text-sm text-muted-foreground">by {book.author}</p>
        <span className="w-fit rounded-full border border-line bg-cream px-2.5 py-0.5 text-xs font-medium text-forest">
          {book.category}
        </span>

        <Link
          href=""
          className={`mt-auto inline-flex h-9 items-center justify-center rounded-lg border border-line bg-cream px-4 text-sm font-medium text-ink transition-colors hover:bg-ink/5 ${focusRing}`}
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
