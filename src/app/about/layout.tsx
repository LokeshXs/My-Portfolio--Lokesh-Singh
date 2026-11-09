import { pageMetadata } from "@/lib/seo";

export const metadata = {
  ...pageMetadata("About", "Meet Lokesh Singh, an AI Full Stack Engineer with 5+ years of experience building web apps end to end — combining strong engineering, design, and AI tools.", "/about"),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
