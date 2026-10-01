import { pageMetadata } from "@/lib/seo";

export const metadata = {
  ...pageMetadata("About", "Meet Lokesh Singh, an AI Design Engineer combining design expertise, full-stack development, and AI tools to craft thoughtful user experiences.", "/about"),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
