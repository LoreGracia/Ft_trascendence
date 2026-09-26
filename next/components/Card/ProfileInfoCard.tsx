import { Card } from "./Card";
import { LucideIcon } from "lucide-react";

type ProfileInfoCardProps = {
	icon: LucideIcon;
	label: string;
	value: string;
	tone?: "success" | "danger" | "warning";
};

export function ProfileInfoCard({ icon: Icon, label, value, tone } : ProfileInfoCardProps) {
	return (
		<Card>
			<h3 className="info-field__label">
				<Icon size={16} aria-hidden="true" />
				{label}
			</h3>
			<p className="info-field__value" data-tone={tone}>{value}</p>
		</Card>
	)
}