interface SectionHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
}

export default function SectionHeader({ label, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-10 text-center">
      <p className="mb-2 text-sm uppercase tracking-widest text-accent">{label}</p>
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle mx-auto">{subtitle}</p>}
    </div>
  );
}
