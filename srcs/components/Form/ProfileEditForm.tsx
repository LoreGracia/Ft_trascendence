'use client';

import { useState } from 'react';
import { Camera } from 'lucide-react';
import { AvatarPicker } from '@/components/Avatar/AvatarPicker';
import { StatusBanner } from '@/components/Form/StatusBanner';
import { ProfileFormValues, useProfileForm, type ProfileFormUser } from '@/hooks/useProfileForm';
import { getAvatarUrl } from '@/lib/avatar';
import TextInput from '../Input/Input';

type ProfileEditFormProps = {
	user: ProfileFormUser;
	onSubmit: (values: ProfileFormValues) => Promise<{ field?: 'name' | 'email' | 'image'; error: string } | null>;
	onCancel: () => void;
};

export function ProfileEditForm({ user, onSubmit, onCancel }: ProfileEditFormProps) {
	const { values, set } = useProfileForm(user);
	const [submitting, setSubmitting] = useState(false);
	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
	const [formError, setFormError] = useState<string | null>(null);

	async function handleSubmit(e) {
		e.preventDefault();
		setFieldErrors({});
		setFormError(null);
		setSubmitting(true);

		const result = await onSubmit(values);
		setSubmitting(false);

		if (!result) {
			return;
		}
		if (result.field) setFieldErrors({ [result.field]: result.error });
		else setFormError(result.error);
	}

	return (
		<form className="profile-form" onSubmit={handleSubmit}>
			<div className="profile-form__avatar-preview">
				<img
					src={getAvatarUrl(values.seed)}
					alt="Selected avatar"
					className="avatar avatar--lg"
				/>
				<span className="profile-form__avatar-badge" aria-hidden="true">
					<Camera size={14} />
				</span>
			</div>
			<TextInput
				label="Full Name"
				name="name"
				value={values.name}
				onChange={(e) => set('name', e.target.value)}
				disabled={submitting}
				error={fieldErrors.name}
			/>
			<TextInput
				label="Email Address"
				type="email"
				name="email"
				value={values.email}
				onChange={(e) => set('email', e.target.value)}
				disabled={submitting}
				error={fieldErrors.email}
			/>
			<AvatarPicker
				selected={values.seed}
				onSelect={(seed) => set('seed', seed as typeof values.seed)}
			/>
			{formError && <StatusBanner tone="danger">{formError}</StatusBanner>}
			<div className="profile-form__actions">
				<button
					type="submit"
					className="button button-squere button--highlight"
					disabled={submitting}
					>
					{submitting ? 'Saving…' : 'Save'}
				</button>
				<button
					type="button"
					className="button button-squere button--secondary"
					onClick={onCancel}
					disabled={submitting}
				>
					Cancel
				</button>
			</div>
		</form>
	);
}