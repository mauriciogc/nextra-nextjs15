// src/components/card.tsx
import NextLink from 'next/link';

export default function Card({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description?: string;
  href: string;
  icon?: React.ReactNode;
}) {
  return (
    <NextLink href={href}>
      <div className="h-full rounded-lg border border-gray-200 p-4 text-gray-700 hover:text-gray-900 dark:text-neutral-200 dark:hover:text-neutral-50 transition-all duration-200 hover:shadow-md hover:bg-slate-50 dark:hover:bg-neutral-900 dark:border-neutral-800 dark:hover:border-neutral-700">
        <div className="flex items-start gap-3">
          {icon ? (
            <div className={`mt-1 shrink-0 text-primary ${icon ? 'w-5' : ''}`}>
              {icon}
            </div>
          ) : (
            ''
          )}
          <div className="flex flex-col w-full max-w-xs">
            <h3 className="text-lg font-semibold mb-2 truncate">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>
      </div>
    </NextLink>
  );
}
