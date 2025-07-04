// src/components/overview-page.tsx
import { getIndexPageMap, getPageMap } from 'nextra/page-map';
import type { PageMapItem } from 'nextra';

import Card from './card';

type OverviewPageProps = {
  filePath: string;
  icons?: Record<string, React.ComponentType>;
  pageMap?: PageMapItem[];
};

export const OverviewPage = async ({
  filePath,
  icons,
  pageMap: $pageMap,
}: OverviewPageProps) => {
  const currentRoute = filePath
    .replace('src/content', '/docs')
    .replace('/index.mdx', '');

  const pageMap = $pageMap ?? (await getPageMap(currentRoute));

  return getIndexPageMap(pageMap).map((pageItem, index) => {
    if (!Array.isArray(pageItem)) return null;

    return (
      <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-16">
        {pageItem.map((item) => {
          const icon = item.frontMatter?.icon;
          const Icon = icons?.[icon];

          return (
            <Card
              key={item.name}
              title={item.frontMatter?.title || ''}
              description={item.frontMatter?.description || ''}
              href={item.route}
              icon={Icon && <Icon />}
            />
          );
        })}
      </div>
    );
  });
};
