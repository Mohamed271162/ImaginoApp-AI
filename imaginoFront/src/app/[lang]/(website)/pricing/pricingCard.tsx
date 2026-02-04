export default function PricingCard({
  title,
  price,
  description,
  features,
  highlight,
  buttonText,
  onSubscribe,
  loading,
  disabled,
}: {
  title: string;
  price: string;
  description?: string;
  features: string[];
  highlight?: boolean;
  buttonText?: string;
  onSubscribe?: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <div
      className={`flex flex-col justify-between h-full rounded-xl p-6 md:p-8 border transition-shadow
        ${
          highlight
            ? 'bg-[color:var(--main-color)] border-[color:var(--main-hover-color)]'
            : 'bg-card border-border'
        }
      `}
      role="region"
      aria-label={`${title} plan`}
    >
      <div>
        <h2 className={`text-xl font-semibold ${highlight ? 'text-black' : 'text-foreground'}`}>
          {title}
        </h2>

        <p className={`text-4xl font-bold mt-3 ${highlight ? 'text-black' : 'text-foreground'}`}>
          {price}
        </p>

        {description && (
          <p className="text-sm text-[color:var(--muted-foreground)] mt-2">{description}</p>
        )}

        <ul className="space-y-2 mt-6">
          {features.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm md:text-base">
              <span className="min-w-[1.2rem] text-[color:#16a34a] mt-1">✔</span>
              <span className={highlight ? 'text-black' : 'text-foreground'}>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <button
          onClick={onSubscribe}
          disabled={disabled || loading}
          className={`w-full py-3 rounded-lg font-medium focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]
            ${
              highlight
                ? 'bg-black text-white hover:bg-gray-900'
                : 'bg-black text-white hover:bg-gray-900'
            }
            ${disabled || loading ? 'opacity-70 cursor-not-allowed' : ''}
          `}
        >
          {loading ? 'Redirecting…' : buttonText || 'Subscribe Now'}
        </button>
      </div>
    </div>
  );
}
