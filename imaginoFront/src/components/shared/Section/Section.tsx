import clsx from 'clsx';

export default function Section({
  children,
  className,
  bg,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  bg?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <section
      className={clsx(
        'py-12 sm:py-16 lg:py-20',
        bg ? 'bg-section dark:bg-section-dark' : '',
        className
      )}
      style={style}
    >
      {children}
    </section>
  );
}
