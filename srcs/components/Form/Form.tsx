import TextInput from "@/components/Input/Input";
import { ReactNode, FormEvent } from "react";

type FormProps = {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
};

export default function Form({ onSubmit, children }: FormProps) {
return (
	<div>
	<form onSubmit={onSubmit}>
		<div className="flex flex-col gap-2">
			<div>
				<h2>Email</h2>
				<TextInput
				type="email"
				name="email"
				placeholder="value@gmail.com"
				/>
			</div>
			<div>
				<h2>Password</h2>
				<TextInput
				type="password"
				name="password"
				placeholder="Insert password"
				/>
			</div>
			{children}
		</div>
    </form>
	</div>
	);
}
