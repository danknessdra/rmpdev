export async function POST({ request }: { request: Request }) {
  const { query } = await request.json();
  const myHeaders = new Headers();
  myHeaders.append("Accept", "*/*");
  myHeaders.append("Accept-Language", "en-US,en;q=0.9,en-GB;q=0.8");
  myHeaders.append("Authorization", "Basic dGVzdDp0ZXN0");
  myHeaders.append("Connection", "keep-alive");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append(
    "Cookie",
    "cid=MJjad6RriC-20231107; ccpa-notice-viewed-02=true; oauthState=lA6taG-O9wUn2gFqM4KdEMfYySJk7T37ZYLPhfBJ6cY; oauthProvider=google; userSchoolId=U2Nob29sLTg4MQ==; userSchoolLegacyId=881; userSchoolName=San%20Jose%20State%20University",
  );
  myHeaders.append("Origin", "https://www.ratemyprofessors.com");
  myHeaders.append(
    "Referer",
    "https://www.ratemyprofessors.com/search/professors/881",
  );
  myHeaders.append("Sec-Fetch-Dest", "empty");
  myHeaders.append("Sec-Fetch-Mode", "cors");
  myHeaders.append("Sec-Fetch-Site", "same-origin");
  myHeaders.append(
    "User-Agent",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  );
  myHeaders.append(
    "sec-ch-ua",
    '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
  );
  myHeaders.append("sec-ch-ua-mobile", "?0");
  myHeaders.append("sec-ch-ua-platform", '"Linux"');

  const graphql = JSON.stringify({
    query:
      "query Page(\n  $count: Int!\n  $cursor: String\n  $query: TeacherSearchQuery!\n) {\n  search: newSearch {\n    ...TeacherSearchPagination_search_1jWD3d\n  }\n}\n\nfragment TeacherSearchPagination_search_1jWD3d on newSearch {\n  teachers(query: $query, first: $count, after: $cursor) {\n    didFallback\n    edges {\n      cursor\n      node {\n        ...TeacherCard_teacher\n        id\n        __typename\n      }\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n    resultCount\n    filters {\n      field\n      options {\n        value\n        id\n      }\n    }\n  }\n}\n\nfragment TeacherCard_teacher on Teacher {\n  id\n  legacyId\n  avgRating\n  numRatings\n  ...CardFeedback_teacher\n  ...CardSchool_teacher\n  ...CardName_teacher\n  ...TeacherBookmark_teacher\n}\n\nfragment CardFeedback_teacher on Teacher {\n  wouldTakeAgainPercent\n  avgDifficulty\n}\n\nfragment CardSchool_teacher on Teacher {\n  department\n  school {\n    name\n    id\n  }\n}\n\nfragment CardName_teacher on Teacher {\n  firstName\n  lastName\n}\n\nfragment TeacherBookmark_teacher on Teacher {\n  id\n  isSaved\n}\n",
    variables: {
      count: 200,
      cursor: "YXJyYXljb25uZWN0aW9uOjc=",
      query: {
        text: "",
        schoolID: "U2Nob29sLTg4MQ==",
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
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
  const res = await client.search(searchParams);
  return json(res, { status: 201 });
}
