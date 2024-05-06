import type { SearchRequest } from "@elastic/elasticsearch/lib/api/types.js";
export default function elasticSearch(elasticSearchRequest: SearchRequest) {
  return fetch("/api/search/", {
    method: "POST",
    body: JSON.stringify(elasticSearchRequest),
  }).then((res) => res.json());
}
