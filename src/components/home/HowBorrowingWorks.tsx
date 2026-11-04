const steps = [
  {
    step: "1",
    title: "Browse the shelves",
    text: "Search the catalog by title, author, or category and find a book you'd love to read next.",
  },
  {
    step: "2",
    title: "Send a borrow request",
    text: "Hit borrow on a book's page. The owner gets a notification and confirms a pickup spot and date.",
  },
  {
    step: "3",
    title: "Read, return, repeat",
    text: "Enjoy your borrowed book and return it on time so the next reader in line can start reading.",
  },
];

export function HowBorrowingWorks() {
  return (
    <section
      aria-labelledby="how-borrowing-heading"
      className="border-y border-line bg-cream-raised px-5 py-14 sm:px-8 lg:px-10"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="mb-10 text-center">
          <p className="eyebrow">
            How It Works
          </p>
          <h2
            id="how-borrowing-heading"
            className="mt-1 font-display text-3xl font-bold text-ink"
          >
            How Borrowing Works
          </h2>
        </div>

        <ol className="grid gap-6 sm:grid-cols-3">
          {steps.map((item) => (
            <li
              key={item.step}
              className="rounded-xl border border-line bg-cream p-6"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-forest font-display text-lg font-bold text-white">
                {item.step}
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold text-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
