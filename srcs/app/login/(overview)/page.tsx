import TextInput from "@/components/Input/Input";
import Link from 'next/link';

export default function LogIn() {
  return (
    <>
    <div className="pattern" />
    <main className="container">
        <Link
        className="corner button button-squere button--highlight"
        href={'/signin'}
        target="_self"
        rel="noopener noreferrer"
        >
            Sign in
        </Link>
        <div className="container">
            <section className="box box--primary">
                <div>
                    <h2>Email</h2>
                    <TextInput
                    type="text"
                    name="email"
                    placeholder="value@gmail.com"
                    />
                </div>
                <div>
                    <h2>Password</h2>
                    <TextInput
                    type="text"
                    name="password"
                    placeholder="Insert password"
                    />
                </div>
                <div className="button button-squere bg-(--black) text-(--white) w-fill">
                    <h2>Log in</h2>
                </div>
                <h2 className="underline">Forgot password</h2>
            </section>
        </div>
    </main>
    </>
  )
}