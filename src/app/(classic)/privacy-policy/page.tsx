import type { Metadata } from "next";
import PolicyPage from "@/components/ui/PolicyPage";
import { privacy, privacyIntro } from "@/content/policies";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Lecce 28 collects, uses, discloses and safeguards your data when you visit our website and make purchases.",
};

export default function PrivacyPolicyPage() {
  return <PolicyPage title="Privacy Policy" intro={privacyIntro} sections={privacy} />;
}
