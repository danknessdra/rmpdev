from typing import Any
import requests
import json
import tqdm
from elasticsearch import Elasticsearch
from elasticsearch.helpers import streaming_bulk

client = Elasticsearch("http://localhost:9200/", basic_auth=("elastic", ""))

url = "https://www.ratemyprofessors.com/graphql"

headers = {
  'Accept': '*/*',
  'Accept-Language': 'en-US,en;q=0.9,en-GB;q=0.8',
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjUzNzM4MjEiLCJleHAiOjE3MTgyNDAzNjN9.0axO44e-pkTMeDHl97ZJU4BsrzFiDnIDRNh9lRm2fE0',
  'Connection': 'keep-alive',
  'Content-Type': 'application/json',
  'Cookie': 'cid=MJjad6RriC-20231107; ccpa-notice-viewed-02=true; oauthProvider=google; oauthState=NagOhV2L7fyVB2dIhG6JZNfI68Bfxgaz2WM56cAdOxQ; rmpAuth=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjUzNzM4MjEiLCJleHAiOjE3MTgyNDAzNjN9.0axO44e-pkTMeDHl97ZJU4BsrzFiDnIDRNh9lRm2fE0; isLoggedIn=true; userinfo=5373821; isLoggedIn=true; userinfo=5373821',
  'Origin': 'https://www.ratemyprofessors.com',
  'Referer': 'https://www.ratemyprofessors.com/search/schools?q=san%20jose%20sta',
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
    fetchSucceeded = False
    query = "{\"query\":\"query SchoolSearchPaginationQuery(\\n  $count: Int!\\n  $cursor: String\\n  $query: SchoolSearchQuery!\\n) {\\n  search: newSearch {\\n    ...SchoolSearchPagination_search_1jWD3d\\n  }\\n}\\n\\nfragment SchoolSearchPagination_search_1jWD3d on newSearch {\\n  schools(query: $query, first: $count, after: $cursor) {\\n    edges {\\n      cursor\\n      node {\\n        name\\n        city\\n        state\\n        legacyId\\n        numRatings\\n        avgRating\\n        id\\n      }\\n    }\\n    pageInfo {\\n      hasNextPage\\n      endCursor\\n    }\\n    resultCount\\n  }\\n}\","
    variables = '\"variables\":{\"count\":300,\"cursor\":\"' + nextCursor + '\",\"query\":{\"text\":\"\"}}}'
    while (not fetchSucceeded):
      response = requests.request("POST", url, headers=headers, data=(query + variables))
      result: dict[str, Any] = response.json()
      fetchSucceeded = result.get('errors') is None
    nextCursor: str = result['data']['search']['schools']['pageInfo']['endCursor']
    hasNextPage: bool = result['data']['search']['schools']['pageInfo']['hasNextPage']
    schools.extend(result['data']['search']['schools']['edges'])

  json.dump(schools, open('schools.json', 'w'))

print(schools[0])
try:
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
            "legacyId": {"type": "short"},
            "numRatings": {"type": "short"},
          }
        },
      },
    )
except Exception as e:
    print("Index already exists, skipping creation")

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

