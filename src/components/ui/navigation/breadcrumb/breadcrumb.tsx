import { forwardRef, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { ChevronRightIcon } from "../../shared-icons";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps extends ComponentPropsWithoutRef<"nav"> {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  className?: string;
}

const DefaultSeparator = () => (
  <ChevronRightIcon className="size-4 text-foreground-muted" />
);

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, separator = <DefaultSeparator />, className, ...props }, ref) => {
    return (
      <nav ref={ref} aria-label="Breadcrumb" className={className} {...props}>
        <ol className="flex items-center flex-wrap gap-1">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={index} className="flex items-center gap-1">
                {index > 0 && <span className="text-foreground-muted" aria-hidden="true">{separator}</span>}
                {isLast ? (
                  <span
                    className="text-sm font-medium text-foreground"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : item.href ? (
                  <a
                    href={item.href}
                    className="text-sm text-foreground-secondary hover:text-foreground transition-colors"
                    onClick={item.onClick}
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    type="button"
                    className="text-sm text-foreground-secondary hover:text-foreground transition-colors"
                    onClick={item.onClick}
                  >
                    {item.label}
                  </button>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  },
);

Breadcrumb.displayName = "Breadcrumb";
