import Image from "next/image";
import Link from 'next/link';

// async function delay(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

export default async function Home() {
  // await delay(3000); // Espera 3 segundos
  return (
    <>
    <div className="pattern" />
    <main className="container container-two">
      <section className="column">
        <Image
          className="light"
          src="/dice-mockup.svg"
          alt="dice mockup"
          width={200}
          height={20}
        />
      </section>
      <section className="column gap-8">
        <div className="row">
          <h1>
            This is Dice
          </h1>
          <p>
              Welcome
          </p>
        <div className="flex flex-row gap-4 text-base font-medium">
          <Link
            className="button button-round button--secondary"
            href={'/login'}
            target="_self"
            rel="noopener noreferrer"
          >
            Log in
          </Link>
          <Link
            className="button button-round button--highlight"
            href={'/signin'}
            target="_self"
            rel="noopener noreferrer"
          >
            Sign in
          </Link>
        </div>
        </div>
      </section>
    </main>
    </>
  );
}
