import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found | Lokesh",
  description: "The page you are looking for could not be found.",
};

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-[calc(100svh-11rem)] items-center justify-center overflow-hidden px-4 py-20 sm:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-45 [mask-image:radial-gradient(ellipse_75%_60%_at_50%_50%,black,transparent)]"
      />
      <div
        aria-hidden="true"
        className="absolute -left-24 top-1/3 -z-10 size-64 rounded-full bg-neutral-300/50 blur-3xl dark:bg-neutral-700/30"
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 bottom-1/4 -z-10 size-72 rounded-full bg-neutral-300/50 blur-3xl dark:bg-neutral-700/30"
      />

      <section className="relative w-full max-w-2xl text-center">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase shadow-sm backdrop-blur">
          <span className="size-1.5 rounded-full bg-destructive" />
          Error 404
        </p>

        <div className="relative mx-auto mb-3 w-fit select-none">
          <span
            aria-hidden="true"
            className="absolute inset-0 translate-x-1 translate-y-1 text-[clamp(7.5rem,28vw,15rem)] font-black leading-[0.72] tracking-[-0.12em] text-muted"
          >
            404
          </span>
          <h1 className="relative text-[clamp(7.5rem,28vw,15rem)] font-black leading-[0.72] tracking-[-0.12em] text-foreground">
            404
          </h1>
        </div>

        <div className="mx-auto max-w-md rounded-2xl border bg-background/75 p-6 shadow-[var(--shadow-custom)] backdrop-blur-sm sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            This route went off the map.
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            The page you’re looking for doesn’t exist, has moved, or is still
            being built.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-md bg-secondary px-5 text-sm font-medium text-secondary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Back to home
            </Link>
            <Link
              href="/projects"
              className="inline-flex h-10 items-center justify-center rounded-md border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Explore projects
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
