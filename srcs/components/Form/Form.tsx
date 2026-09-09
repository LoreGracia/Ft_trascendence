import { ReactNode, FormEvent } from "react";

type FormProps = {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
};

export default function Form({ onSubmit, children }: FormProps) {
return (
	<div>
	<form onSubmit={onSubmit} noValidate>
		<div className="flex flex-col gap-2">
			{children}
		</div>
    </form>
	</div>
	);
}
