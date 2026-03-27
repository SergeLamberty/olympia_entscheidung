import React from "react";

interface PageLayoutProps {
  children: React.ReactNode;
  narrow?: boolean;
}

export function PageLayout({ children, narrow = true }: PageLayoutProps) {
  return (
    <main className={`flex-1 w-full mx-auto px-4 py-8 ${narrow ? "max-w-3xl" : "max-w-5xl"}`}>
      {children}
    </main>
  );
}
