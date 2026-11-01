import { BookIcon, MailIcon, PhoneIcon, PinIcon, XIcon, FacebookIcon, InstagramIcon } from "./icons";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest/60";

const contact = [
  { icon: MailIcon, label: "hello@booknook.app" },
  { icon: PhoneIcon, label: "+880 1700 000 000" },
  { icon: PinIcon, label: "12 Reading Lane, Dhaka" },
];

const socials = [
  { icon: XIcon, label: "BookNook on X", href: "https://x.com" },
  { icon: FacebookIcon, label: "BookNook on Facebook", href: "https://facebook.com" },
  { icon: InstagramIcon, label: "BookNook on Instagram", href: "https://instagram.com" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-cream">
      <div className="mx-auto w-full max-w-[1400px] px-5 py-12 sm:px-8 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr] lg:gap-8">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-forest text-white">
                <BookIcon className="size-6" />
              </span>
              <span className="font-display text-2xl font-bold text-ink">
                BookNook
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              A small neighbourhood library on the web. Share the books on
              your shelf and borrow the ones you have been meaning to read.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h2 className="font-display text-lg font-bold text-ink">Contact</h2>
            <ul className="mt-4 space-y-3">
              {contact.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Icon className="size-4.5 shrink-0 text-muted-foreground" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h2 className="font-display text-lg font-bold text-ink">Follow us</h2>
            <div className="mt-4 flex gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className={`flex size-10 items-center justify-center rounded-full border border-line bg-cream-raised text-ink/80 transition-colors hover:border-forest/50 hover:text-forest ${focusRing}`}
                >
                  <Icon className="size-4.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <p className="mx-auto w-full max-w-[1400px] px-5 py-4 text-center text-sm text-muted-foreground sm:px-8 lg:px-10">
          © 2026 BookNook. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
