type StatusBannerProps = {
  tone: 'success' | 'danger' | 'warning';
  children: React.ReactNode;
};

export function StatusBanner({ tone, children }: StatusBannerProps) {
	return (
		<div className="status-banner" data-tone={tone} role="status">
			{children}
		</div>
	);
}