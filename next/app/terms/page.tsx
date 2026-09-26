import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TermsAndConditions from "@/components/Terms/Terms";

export default function TermsPage() {
	return (
		<main className="container">
		<div className="terms-page">
			<Link href="/" className="terms-page__back">
				<ArrowLeft size={16} aria-hidden="true" />
				Back
			</Link>
			<TermsAndConditions />
		</div>
		</main>
	);
}