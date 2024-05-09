import type { SearchRequest } from "@elastic/elasticsearch/lib/api/types.js";
export default function elasticSearch(
  elasticSearchRequest: SearchRequest,
  customFetch = fetch,
) {
  return customFetch("/api/search/", {
    method: "POST",
    body: JSON.stringify(elasticSearchRequest),
  }).then((res) => {
    return res.json();
  });
}
