import React from 'react';

/**
 * Marketing Layout — CareerOS Design System
 *
 * Public-facing layout. Light theme. Large whitespace. Storytelling flow.
 * Navigation is rendered inside page.tsx for full-scroll control.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="ds-page">
      <main>{children}</main>
    </div>
  );
}
