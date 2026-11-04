"use client";

import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80";

type Slide = {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  image: string;
};

const slides: Slide[] = [
  {
    id: "share",
    eyebrow: "Share your shelf",
    title: "Your books deserve new readers",
    text: "List the books gathering dust and let neighbors borrow them for free. Every shelved book is a story waiting to travel.",
    image: "/Images/library1.jpg",
  },
  {
    id: "discover",
    eyebrow: "Discover something new",
    title: "Borrow without buying",
    text: "Browse shelves from readers across the city, reserve what catches your eye, and pick it up when you're out walking anyway.",
    image: "/Images/library2.jpg",
  },
  {
    id: "community",
    eyebrow: "Open a book, open a conversation",
    title: "Reading is better together",
    text: "From thrillers to cookbooks, BookNook connects people through the stories they're reading right now.",
    image: "/Images/library3.jpg",
  },
];

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section aria-label="Featured highlights" className="px-5 pt-8 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-[1400px]">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          loop
          speed={600}
          preventClicks={false}
          preventClicksPropagation={false}
          className="overflow-hidden rounded-2xl border border-line !bg-forest"
          onSlideChange={({ realIndex }: SwiperType) => setActiveIndex(realIndex)}
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative flex min-h-[360px] flex-col justify-center gap-4 px-8 py-14 text-white sm:min-h-[420px] sm:px-14 lg:px-20">
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  className="pointer-events-none object-cover"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-forest/85 via-forest/60 to-transparent"
                  aria-hidden="true"
                />
                <div className="relative z-10 flex flex-col gap-4">
                <span className="w-fit border-b-2 border-gold px-1 pb-1 text-xs font-semibold uppercase tracking-wider text-gold-soft">
                  {slide.eyebrow}
                </span>
                <h1 className="max-w-xl font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                  {slide.title}
                </h1>
                <p className="max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
                  {slide.text}
                </p>
                <Link
                  href="/books"
                  className={`mt-2 inline-flex h-11 w-fit items-center justify-center rounded-lg bg-cream px-6 text-sm font-semibold text-forest shadow-sm transition-colors hover:bg-white ${focusRing}`}
                >
                  Browse Books
                </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <p aria-live="polite" className="sr-only">
          Slide {activeIndex + 1} of {slides.length}
        </p>
      </div>
    </section>
  );
}
