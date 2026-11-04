"use client";

import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { Card } from "@/components/ui/card";

const MyProfilePage = () => {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        <p>You must be logged in to view your profile.</p>
        <Link
          href="/login"
          className="ml-4 text-forest hover:text-forest-hover"
        >
          Log in
        </Link>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="mx-auto max-w-xl px-4 py-14">
      {/* Profile card, same as the design */}
      <Card className="rounded-xl border-line bg-cream-raised px-8 py-12 text-center">
        {/* Avatar */}
        <div className="mx-auto h-28 w-28 overflow-hidden rounded-full border-4 border-line bg-muted">
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name || "Profile picture"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-display text-3xl text-forest">
              {(user.name || "U").charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Name */}
        <h1 className="mt-6 font-display text-3xl font-bold text-ink">
          {user.name || "Unknown User"}
        </h1>

        {/* Email */}
        <p className="mt-2 text-sm text-muted-foreground">
          {user.email}
        </p>

        {/* Member since - date is dynamic from the session */}
        <p className="mt-4 text-sm text-muted-foreground">
          Member since{" "}
          {user.createdAt
            ? new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : "—"}
        </p>
      </Card>
    </div>
  );
};

export default MyProfilePage;
