import { pageMetadata } from "@/lib/seo";

export const metadata = {
  ...pageMetadata("Blogs", "A collection of articles about web development.", "/blogs"),
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
