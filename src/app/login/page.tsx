"use client";

import { signIn } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/toast";

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 48 48">
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      toast.add({
        title: "Missing details",
        description: "Please fill in your email and password.",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await signIn.email({
        email: email,
        password: password,
      });

      if (error) {
        toast.add({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          type: "error",
        });
        return;
      }

      toast.add({
        title: "Login successful",
        description: "Welcome back to BookNook!",
        type: "success",
      });
      form.reset();
      router.push("/");
    } catch (error) {
      toast.add({
        title: "Login failed",
        description: "Invalid email or password. Try again.",
        type: "error",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/", // where to go after login
      });
    } catch (error) {
      toast.add({
        title: "Google login failed",
        description: "Could not sign in with Google. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <main className="min-h-screen bg-cream px-4 py-14">
      <div className="mx-auto w-full max-w-md rounded-xl border border-line bg-cream-raised p-8 shadow-sm">
        <h1 className="font-display text-4xl font-semibold text-ink text-center mb-8">
          Login
        </h1>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="border-line bg-white rounded-lg"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              className="border-line bg-white rounded-lg"
            />
            <a href="#" className="text-sm text-forest hover:underline">
              Forget Password?
            </a>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <Separator className="flex-1 bg-line" />
          <span className="text-sm text-muted-foreground">OR</span>
          <Separator className="flex-1 bg-line" />
        </div>

        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          type="button"
          className="w-full rounded-lg border-line bg-white text-ink"
        >
          <GoogleIcon />
          Continue with Google
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link
            href="/register"
            className="font-semibold text-forest hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
