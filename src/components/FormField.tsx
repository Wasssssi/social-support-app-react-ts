type FormFieldProps = {
	label: string;
	children: React.ReactNode;
	hint?: string;
};

export default function FormField({ label, children, hint }: FormFieldProps) {
	return (
		<label className="flex flex-col gap-1.5">
			<span className="text-sm font-semibold tracking-tight text-white">{label}</span>
			{children}
			{hint && <span className="text-xs text-white/70">{hint}</span>}
		</label>
	);
}

