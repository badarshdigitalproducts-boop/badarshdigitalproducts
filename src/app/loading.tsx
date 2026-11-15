export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      <span className="font-heading text-xs font-semibold uppercase tracking-widest text-muted">
        Loading BADARSH...
      </span>
    </div>
  );
}
