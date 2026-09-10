import type { Metadata } from "next";
import PolicyPage from "@/components/ui/PolicyPage";
import { terms } from "@/content/policies";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms that govern orders placed with Lecce 28 and delivered within the United States.",
};

export default function TermsPage() {
  return <PolicyPage title="Terms & Conditions" sections={terms} />;
}
