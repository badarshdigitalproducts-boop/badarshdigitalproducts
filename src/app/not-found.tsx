import Link from "next/link";
import { ArrowLeft, Home, Package } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="relative">
        <span className="font-heading text-8xl font-black tracking-tighter text-accent/20 sm:text-9xl">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl">
            Page Not Found
          </h1>
        </div>
      </div>

      <p className="mt-4 max-w-md text-sm text-muted">
        The digital asset or page you are looking for might have been moved, renamed, or is temporarily unavailable.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-heading text-xs font-bold text-white shadow-md hover:bg-accent-hover"
        >
          <Home className="h-4 w-4" />
          <span>Return Home</span>
        </Link>
        <Link
          href="/templates"
          className="flex items-center gap-2 rounded-full border border-card-border bg-card px-6 py-3 font-heading text-xs font-bold text-foreground hover:border-accent"
        >
          <Package className="h-4 w-4" />
          <span>Browse Templates</span>
        </Link>
      </div>
    </div>
  );
}
