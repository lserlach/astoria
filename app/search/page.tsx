import { Suspense } from "react";

import { SearchPageClient } from "./search-page-client";

function SearchFallback() {
  return (
    <div style={{ padding: "48px 24px", textAlign: "center" }}>
      Загрузка поиска…
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchPageClient />
    </Suspense>
  );
}
