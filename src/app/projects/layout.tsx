import { pageMetadata, PROJECTS_DESCRIPTION } from "@/lib/seo";

export const metadata = {
  ...pageMetadata("Projects", PROJECTS_DESCRIPTION, "/projects"),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
