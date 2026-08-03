import type { SubtypesListProps } from './types';

export default function SubtypesList({ category }: SubtypesListProps) {
  if (!category) return null;

  return (
    <div className="subtypes-stack">
      {category.subtypes.map((subtype, i) => (
        <span key={subtype.id} className="subtype-node" style={{ animationDelay: `${i * 50}ms` }}>
          {subtype.label}
          {subtype.description && <span className="subtype-desc">{subtype.description}</span>}
        </span>
      ))}
    </div>
  );
}
