import type { Metadata } from "next";
import OrganicPolicyPage from "@/components/organic/OrganicPolicyPage";
import { terms } from "@/content/policies";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms that govern orders placed with Lecce 28 and delivered within the United States.",
};

export default function TermsPage() {
  return (
    <OrganicPolicyPage
      kicker="Terms & Conditions"
      accent="the fine print"
      sections={terms}
    />
  );
}
