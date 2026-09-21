'use client';

import { Check } from 'lucide-react';
import { getAvailableAvatars } from '@/lib/avatar';
import './Avatar.css';

type AvatarPickerProps = {
	selected: string;
	onSelect: (seed: string) => void;
};

export function AvatarPicker({ selected, onSelect }: AvatarPickerProps) {
	const avatars = getAvailableAvatars();

	return (
		<div className="avatar-picker" role="radiogroup" aria-label="Choose your avatar">
		{avatars.map(({ seed, url }) => {
			const isSelected = seed === selected;
			return (
				<button
					key={seed}
					type="button"
					role="radio"
					aria-checked={isSelected}
					aria-label={`Avatar ${seed}`}
					className="avatar-picker__item"
					data-selected={isSelected || undefined}
					onClick={() => onSelect(seed)}
				>
					<img src={url} alt="" className="avatar-picker__image" loading="lazy" />
					{isSelected && (
					<span className="avatar-picker__check" aria-hidden="true">
						<Check size={16} />
					</span>
					)}
				</button>
			);
		})}
		</div>
	);
}