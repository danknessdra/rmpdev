from typing import Any
import requests
import json
import tqdm
from elasticsearch import Elasticsearch
from elasticsearch.helpers import streaming_bulk

client = Elasticsearch("http://localhost:9200/", basic_auth=("elastic", ""))

url = "https://www.ratemyprofessors.com/graphql"

payload = "{\"query\":\"query SchoolSearchPaginationQuery(\\n  $count: Int!\\n  $cursor: String\\n  $query: SchoolSearchQuery!\\n) {\\n  search: newSearch {\\n    ...SchoolSearchPagination_search_1jWD3d\\n  }\\n}\\n\\nfragment SchoolSearchPagination_search_1jWD3d on newSearch {\\n  schools(query: $query, first: $count, after: $cursor) {\\n    edges {\\n      node {\\n        name\\n        avgRating\\n        city\\n        state\\n        id\\n        legacyId\\n      }\\n    }\\n    pageInfo {\\n      hasNextPage\\n      endCursor\\n    }\\n    resultCount\\n  }\\n}\",\"variables\":{\"count\":100,\"cursor\":\"\",\"query\":{\"text\":\"\"}}}"
headers = {
  'Accept': '*/*',
  'Accept-Language': 'en-US,en;q=0.9,en-GB;q=0.8',
  'Authorization': 'Basic dGVzdDp0ZXN0',
  'Connection': 'keep-alive',
  'Content-Type': 'application/json',
  'Cookie': 'cid=MJjad6RriC-20231107; ccpa-notice-viewed-02=true; oauthState=lA6taG-O9wUn2gFqM4KdEMfYySJk7T37ZYLPhfBJ6cY; oauthProvider=google',
  'Origin': 'https://www.ratemyprofessors.com',
  'Referer': 'https://www.ratemyprofessors.com/search/schools?q=university',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'same-origin',
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Linux"'
}


schools: list[dict[str, Any]] = []
try:
  with open('schools.json', 'r') as file:
    schools = json.load(file)
except FileNotFoundError:
  print("file not found, creating a new one")

if len(schools) == 0:

  hasNextPage = True
  nextCursor = ""
  while hasNextPage:
    # scrape all schools
    query = "{\"query\":\"query SchoolSearchPaginationQuery(\\n  $count: Int!\\n  $cursor: String\\n  $query: SchoolSearchQuery!\\n) {\\n  search: newSearch {\\n    ...SchoolSearchPagination_search_1jWD3d\\n }\\n}\\n\\nfragment SchoolSearchPagination_search_1jWD3d on newSearch {\\n  schools(query: $query, first: $count, after: $cursor) {\\n    edges {\\n      node {\\n        name\\n        avgRating\\n        city\\n        state\\n id\\n        legacyId\\n      }\\n    }\\n    pageInfo {\\n      hasNextPage\\n      endCursor\\n    }\\n resultCount\\n  }\\n}\","
    variables = '\"variables\":{\"count\":300,\"cursor\":\"' + nextCursor + '\",\"query\":{\"text\":\"\"}}}'
    response = requests.request("POST", url, headers=headers, data=(query + variables))
    result: dict[str, Any] = response.json()
    nextCursor: str = result['data']['search']['schools']['pageInfo']['endCursor']
    hasNextPage: bool = result['data']['search']['schools']['pageInfo']['hasNextPage']
    schools.extend(result['data']['search']['schools']['edges'])

  json.dump(schools, open('schools.json', 'w'))

print(schools[0])
_ = client.indices.create(
  index="schools",
  body={
    "settings": {"number_of_shards": 1},
    "mappings": {
      "properties": {
        "avgRating": {"type": "scaled_float", "scaling_factor": 100},
        "city": {"type": "text"},
        "name": {"type": "text"},
        "state": {"type": "text"},
        "legacyId": {"type": "text"},
      }
    },
  },
)

def genactions():
  for school in schools:
    school:dict[str, Any]=school['node']
    school['_id'] = school.pop('id')
    yield school

number_of_docs = len(schools)
progress = tqdm.tqdm(unit="docs", total=number_of_docs)
successes = 0
for ok, action in streaming_bulk(
    client=client, index="schools", actions=genactions(),
):
    _ = progress.update(1)
    successes += ok
print("Indexed %d/%d documents" % (successes, number_of_docs))

