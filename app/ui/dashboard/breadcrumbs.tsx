'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { Fragment } from 'react';

export function Breadcrumbs() {
    const pathname = usePathname();
    const paths = pathname.split('/').filter(path => path);

    return (
        <nav aria-label="Breadcrumb" className="hidden md:flex items-center text-sm text-muted-foreground">
            <ol className="flex items-center gap-1">
                <li className="flex items-center">
                    <Link
                        href="/overview"
                        className="flex items-center hover:text-foreground transition-colors"
                    >
                        <Home className="h-4 w-4" />
                        <span className="sr-only">Home</span>
                    </Link>
                </li>

                {paths.map((path, index) => {
                    // Skip 'overview' as it's the home icon
                    if (path === 'overview' && index === 0) return null;

                    const href = `/${paths.slice(0, index + 1).join('/')}`;
                    const isLast = index === paths.length - 1;

                    // Format text: capitalize and remove dashes
                    const label = path.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

                    return (
                        <Fragment key={path}>
                            <li aria-hidden="true">
                                <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                            </li>
                            <li>
                                {isLast ? (
                                    <span className="font-medium text-foreground">{label}</span>
                                ) : (
                                    <Link
                                        href={href}
                                        className="hover:text-foreground transition-colors"
                                    >
                                        {label}
                                    </Link>
                                )}
                            </li>
                        </Fragment>
                    );
                })}
            </ol>
        </nav>
    );
}
