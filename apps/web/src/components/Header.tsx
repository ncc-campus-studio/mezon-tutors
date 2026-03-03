import Link from 'next/link';
import { LoginButton } from '../../../../packages/app/components/auth/LoginButton';

const navLinks = [
  { href: '/tutors', label: 'Find tutors' },
  { href: '/business', label: 'For business' },
  { href: '/become-tutor', label: 'Become a tutor' },
  { href: '/progress', label: 'Proven Progress' },
];

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between bg-transparent px-6 lg:px-12">
      <div className="flex items-center gap-10">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-zinc-900"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-white text-sm font-bold">
            M
          </span>
          Mezon
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-zinc-600 ${
                link.label === 'Find tutors' ? 'text-zinc-900 font-semibold' : 'text-zinc-700'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white/80 px-3 py-2 text-sm font-medium text-zinc-700 backdrop-blur-sm transition-colors hover:bg-white"
        >
          <span>English, USD</span>
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        <button
          type="button"
          className="rounded-full p-2 text-zinc-700 transition-colors hover:bg-white/50"
          aria-label="Help"
        >
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
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
        <LoginButton />
      </div>
    </header>
  );
}
