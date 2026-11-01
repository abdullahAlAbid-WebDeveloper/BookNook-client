import Link from "next/link";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest/60";

const categories = [
  { name: "Mystery", count: 142, blurb: "Whodunits, missing persons, locked rooms." },
  { name: "Fantasy", count: 118, blurb: "Magic, maps, and impossible worlds." },
  { name: "Romance", count: 97, blurb: "Slow burns and happy endings." },
  { name: "Historical", count: 84, blurb: "The past brought vividly back to life." },
  { name: "Horror", count: 61, blurb: "Chills best read with the lights on." },
  { name: "Drama", count: 55, blurb: "Quiet stories with lasting weight." },
];

export function TopCategories() {
  return (
    <section aria-labelledby="top-categories-heading" className="px-5 py-14 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-forest">
            Explore
          </p>
          <h2
            id="top-categories-heading"
            className="mt-1 font-display text-3xl font-bold text-ink"
          >
            Top Categories
          </h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            The genres BookNook readers borrow the most this month.
          </p>
        </div>

        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <li key={category.name}>
              <Link
                href="/books"
                className={`flex h-full flex-col rounded-xl border border-line bg-cream-raised p-5 transition-colors hover:border-forest/50 hover:bg-cream ${focusRing}`}
              >
                <span className="font-display text-lg font-semibold text-forest">
                  {category.name}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  {category.count} books
                </span>
                <span className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {category.blurb}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
