import AnimatedSubheading from "../common/AnimatedSubHeading";
import GithubData from "../common/GithubData";
import { Suspense } from "react";

export default async function GithubSection() {
  return (
    <div className="px-4 py-8 max-sm:px-2 max-sm:py-6">
      <div className="flex justify-center">
        <AnimatedSubheading subheading="GitHub Activity" />
      </div>

      <div className="py-6">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <p className="text-center max-sm:text-xs">
                Loading the contributions...
              </p>
            </div>
          }
        >
          <GithubData />
        </Suspense>
      </div>
    </div>
  );
}
