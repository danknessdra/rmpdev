import { Client } from "@elastic/elasticsearch";
import { json } from "@sveltejs/kit";

let tracked_schools = {};
const client = new Client({
  node: import.meta.env.VITE_ELASTICSEARCH_URL,
  // no auth for now
  // auth: {
  //   username: "elastic",
  //   password: "",
  // },
  tls: {
    // ca: fs.readFileSync("something from the elastic container"),
    rejectUnauthorized: false,
  },
});
const myHeaders = new Headers();
myHeaders.append("Accept", "*/*");
myHeaders.append("Accept-Language", "en-US,en;q=0.9,en-GB;q=0.8");
myHeaders.append("Authorization", "Basic dGVzdDp0ZXN0");
myHeaders.append("Connection", "keep-alive");
myHeaders.append("Content-Type", "application/json");
myHeaders.append(
  "Cookie",
  "cid=MJjad6RriC-20231107; ccpa-notice-viewed-02=true; userSchoolId=U2Nob29sLTg4MQ==; userSchoolLegacyId=881; userSchoolName=San%20Jose%20State%20University",
);
myHeaders.append("Origin", "https://www.ratemyprofessors.com");
myHeaders.append(
  "Referer",
  "https://www.ratemyprofessors.com/search/professors/881?q=*",
);
myHeaders.append("Sec-Fetch-Dest", "empty");
myHeaders.append("Sec-Fetch-Mode", "cors");
myHeaders.append("Sec-Fetch-Site", "same-origin");
myHeaders.append(
  "User-Agent",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
);
myHeaders.append(
  "sec-ch-ua",
  '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
);
myHeaders.append("sec-ch-ua-mobile", "?0");
myHeaders.append("sec-ch-ua-platform", '"Linux"');

async function pushToElasticsearch(teachers) {
  client.bulk({
    operations: teachers.flatMap((teacher) => {
      const { id, ...rest } = teacher.node;
      return [{ index: { _index: "professors" } }, { _id: id, ...rest }];
    }),
  });
}

export async function PUT({ request }: { request: Request }) {
  const { schoolId } = await request.json();

  let count = 0;
  function recursiveFetch(cursor = "") {
    console.log(cursor);
    const graphql = JSON.stringify({
      query:
        "query TeacherSearchResultsPageQuery(\n  $query: TeacherSearchQuery!,\n  $cursor: String,\n  $count: Int,\n) {\n  search: newSearch {\n   teachers(query: $query, first: $count, after: $cursor) {\n    didFallback\n    edges {\n      node {\n        school {\n            id\n        }\n        firstName\n        lastName\n        department\n        avgRating\n        numRatings\n        legacyId\n        avgDifficulty\n        wouldTakeAgainPercent\n        courseCodes {\n            courseName\n        }\n        id\n      }\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n    resultCount\n  }\n  }\n}",
      variables: {
        count: 200,
        cursor: cursor,
        query: {
          text: "",
          schoolID: schoolId,
          fallback: true,
          departmentID: null,
        },
      },
    });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: graphql,
      redirect: "follow",
    };
    fetch("https://www.ratemyprofessors.com/graphql", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (!result.data.search.teachers.pageInfo.hasNextPage) {
          client.indices.refresh({ index: "professors" });
          // technically if we don't return it will just infinitely search through all profs
          tracked_schools[schoolId] = count;
          return;
        }
        count += result.data.search.teachers.edges.length;
        console.log(
          `fetched ${count} teachers/${result.data.search.teachers.resultCount}`,
        );
        console.log(result.data.search.teachers.pageInfo);
        pushToElasticsearch(result.data.search.teachers.edges);
        recursiveFetch(result.data.search.teachers.pageInfo.endCursor);
      })
      .catch((error) => console.error(error));
  }
  recursiveFetch();

  return json({ updating: "yeah" }, { status: 201 });
}
