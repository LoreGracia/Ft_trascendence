import "./Avatar.css";
import { getAvatarUrl } from "@/lib/avatar";

type AvatarProps = {
	image?: string | null;
	name?: string | null;
	seed?: string;
	size?: "sm" | "md" | "lg";
};

export function Avatar({ image, name, seed, size = "md" }: AvatarProps) {
	const url = image || (seed ? getAvatarUrl(seed) : null);

	if (url) {
		return (
		<img
			src={url}
			alt={name ?? "User avatar"}
			className={`avatar avatar--${size}`}
		/>
		);
	}

	const initial = name ? name.charAt(0).toUpperCase() : "?";

	return (
		<div
			className={`avatar avatar--${size} avatar--fallback`}
			aria-hidden="true"
		>
			{initial}
		</div>
	);
}