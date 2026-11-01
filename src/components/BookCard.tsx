import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import Link from "next/link";

/**
 * Reusable book card used on the homepage and the All Books page.
 */
type BookCardProps = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
};

export function BookCard({ _id, title, author, category, image }: BookCardProps) {
  return (
    <Card className="bg-cream-raised border-line gap-0 overflow-hidden py-0 shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[2/3] w-full bg-muted">
        <Image
          src={image}
          alt={`Cover of ${title}`}
          fill
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw"
          className="object-cover"
        />
      </div>

      <CardContent className="flex-1 space-y-2 p-4">
        <Badge variant="secondary" className="bg-cream text-forest border-line">
          {category}
        </Badge>
        <CardTitle className="font-display text-lg leading-snug text-ink">
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">by {author}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link href={`/books/${_id}`}>
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
