import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { InfoNav } from "@/components/info/InfoNav";

export const metadata: Metadata = {
  title: {
    default: "Informationen",
    template: "%s | Informationen",
  },
};

export default function InfoLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageLayout>
      <InfoNav />
      {children}
    </PageLayout>
  );
}
