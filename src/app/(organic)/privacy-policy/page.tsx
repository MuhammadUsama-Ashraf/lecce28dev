import type { Metadata } from "next";
import OrganicPolicyPage from "@/components/organic/OrganicPolicyPage";
import { privacy, privacyIntro } from "@/content/policies";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Lecce 28 collects, uses, discloses and safeguards your data when you visit our website and make purchases.",
};

export default function PrivacyPolicyPage() {
  return (
    <OrganicPolicyPage
      kicker="Privacy Policy"
      accent="your data, handled with care"
      intro={privacyIntro}
      sections={privacy}
    />
  );
}
