import { Suspense } from "react";

import { Explore } from "@/components/explore/explore";
import { getCompanies, getEdges, getFunders, getInvestors } from "@/lib/data";

export default function Page() {
  return (
    <Suspense>
      <Explore companies={getCompanies()} investors={getInvestors()} funders={getFunders()} edges={getEdges()} />
    </Suspense>
  );
}
