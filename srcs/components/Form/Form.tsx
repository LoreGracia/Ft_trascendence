import TextInput from "@/components/Input/Input";

export default function Form() {
return (
	<div>
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
	</div>
	);
}
