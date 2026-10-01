import { pageMetadata } from "@/lib/seo";

export const metadata = {
  ...pageMetadata("Contact", "Get in touch with Lokesh Singh for freelance design engineering, frontend development, and collaboration on thoughtful digital products.", "/contact"),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
