import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  return (
    <main className="container">
      <div className="column">
        <Image
          className="light"
          src="/dice-mockup.svg"
          alt="dice mockup"
          width={200}
          height={20}
        />
        </div>
        <div className="column gap">
        <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            This is Dice
          </h1>
          <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
              Welcome
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <Link
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-(--light) transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href={'/login'}
            target="_self"
            rel="noopener noreferrer"
          >
            Log in
          </Link>
          <Link
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href={'/signin'}
            target="_self"
            rel="noopener noreferrer"
          >
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
