'use client';

// Custom global error boundary. In Next.js 16 the built-in fallback at
// `node_modules/next/dist/client/components/builtin/global-error.js` is not
// always wired into the React Client Manifest, which produces:
//   Could not find the module "[project]/node_modules/next/dist/client/components/builtin/global-error.js#default"
// Providing our own `app/global-error.tsx` (recommended by the Next docs)
// avoids the lookup entirely.
//
// `unstable_retry` is the Next.js 16 API to re-render the failed segment;
// it replaces the older `reset` prop.

import { useEffect } from 'react';

interface GlobalErrorProps {
    error: Error & { digest?: string };
    unstable_retry?: () => void;
}

export default function GlobalError({ error, unstable_retry }: GlobalErrorProps) {
    useEffect(() => {
        console.error('GlobalError:', error);
    }, [error]);

    return (
        <html lang="en">
            <body className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-[#0f172b]">
                <div className="flex max-w-md flex-col items-start gap-4 rounded-lg border border-[#e2e8f0] bg-white p-8 shadow-sm">
                    <h2 className="text-xl font-semibold">Something went wrong</h2>
                    <p className="text-sm text-[#475569]">
                        {error.message || 'An unexpected error occurred while rendering this page.'}
                    </p>
                    {error.digest && (
                        <p className="font-mono text-xs text-[#94a3b8]">digest: {error.digest}</p>
                    )}
                    {unstable_retry && (
                        <button
                            type="button"
                            onClick={() => unstable_retry()}
                            className="rounded-md bg-[#0f766e] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0d655e]"
                        >
                            Try again
                        </button>
                    )}
                </div>
            </body>
        </html>
    );
}
