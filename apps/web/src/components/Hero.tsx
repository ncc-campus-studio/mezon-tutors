import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-between gap-12 bg-[#e91e8c] px-6 pt-24 pb-16 lg:flex-row lg:gap-20 lg:px-12 lg:pt-32">
      <div className="flex max-w-xl flex-1 flex-col justify-center gap-8">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-zinc-900 lg:text-5xl xl:text-6xl">
          Learn faster with your best language tutor.
        </h1>
        <Link
          href="/tutors"
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-zinc-900 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-zinc-800"
        >
          Find your tutor
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </div>
      <div className="relative flex flex-1 items-center justify-center lg:justify-end">
        <div className="relative h-[320px] w-full max-w-md lg:h-[400px]">
          {/* Stacked tutor images - back layer */}
          <div className="absolute -right-4 -top-4 z-0 h-48 w-48 overflow-hidden rounded-2xl bg-zinc-800/20 shadow-xl lg:h-56 lg:w-56">
            <Image
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=224&h=224&fit=crop"
              alt="Tutor"
              width={224}
              height={224}
              className="h-full w-full object-cover opacity-90"
            />
          </div>
          {/* Middle layer */}
          <div className="absolute right-8 top-8 z-10 h-52 w-52 overflow-hidden rounded-2xl border-4 border-white/30 bg-zinc-800/30 shadow-2xl lg:right-12 lg:top-12 lg:h-64 lg:w-64">
            <Image
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&h=256&fit=crop"
              alt="Tutor"
              width={256}
              height={256}
              className="h-full w-full object-cover"
            />
          </div>
          {/* Front layer - main */}
          <div className="absolute left-0 top-16 z-20 h-64 w-64 overflow-hidden rounded-2xl border-4 border-white/50 bg-white shadow-2xl lg:left-8 lg:top-20 lg:h-80 lg:w-80">
            <Image
              src="https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=320&h=320&fit=crop"
              alt="Tutor"
              width={320}
              height={320}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}