import { Mail, Phone, User as UserIcon } from 'lucide-react';
import type { ReactElement, ElementType } from 'react';

type InfoFieldProps = {
  label: string;
  icon: ElementType;
  value: string;
};

export function InfoField({ label, icon: Icon, value }: InfoFieldProps): ReactElement {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-[color:var(--muted-foreground)]">{label}</p>
      <div
        className="flex items-center gap-2 rounded-md px-3 py-2 border"
        style={{
          background: 'color-mix(in srgb, var(--card) 92%, transparent)',
          borderColor: 'var(--border)',
        }}
      >
        <Icon className="h-4 w-4 text-[color:var(--muted-foreground)]" />
        <span className="text-sm" style={{ color: 'var(--card-foreground)' }}>
          {value}
        </span>
      </div>
    </div>
  );
}

type EditableFieldProps = {
  label: string;
  icon: ElementType;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  type?: string;
};

export function EditableField({
  label,
  icon: Icon,
  value,
  onChange,
  error,
  type = 'text',
}: EditableFieldProps): ReactElement {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-[color:var(--muted-foreground)]">{label}</p>
      <div
        className="flex items-center gap-2 rounded-md px-3 py-2 border"
        style={{
          background: 'color-mix(in srgb, var(--card) 96%, transparent)',
          borderColor: 'var(--border)',
        }}
      >
        <Icon className="h-4 w-4 text-[color:var(--muted-foreground)]" />
        <input
          type={type}
          className="w-full bg-transparent text-sm outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            color: 'var(--card-foreground)',
          }}
          aria-label={label}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

type SelectFieldProps = {
  label: string;
  icon: ElementType;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  options: { value: string; label: string }[];
};

export function SelectField({
  label,
  icon: Icon,
  value,
  onChange,
  error,
  options,
}: SelectFieldProps): ReactElement {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-[color:var(--muted-foreground)]">{label}</p>
      <div
        className="flex items-center gap-2 rounded-md px-3 py-2 border"
        style={{
          background: 'color-mix(in srgb, var(--card) 96%, transparent)',
          borderColor: 'var(--border)',
        }}
      >
        <Icon className="h-4 w-4 text-[color:var(--muted-foreground)]" />
        <select
          className="w-full bg-transparent text-sm outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            color: 'var(--card-foreground)',
          }}
          aria-label={label}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export const DefaultIcons = {
  UserIcon,
  Mail,
  Phone,
};
