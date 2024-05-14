import type { SearchRequest } from "@elastic/elasticsearch/lib/api/types.js";
export default function elasticSearch(
  elasticSearchRequest: SearchRequest,
  customFetch = fetch,
) {
  console.log("elasticSearchRequest", elasticSearchRequest);
  return customFetch("/api/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(elasticSearchRequest),
  }).then((res) => {
    console.log("res", res);
    return res.json();
  });
}
