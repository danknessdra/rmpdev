import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import elasticSearch from "$lib/elasticsearch";

const acceptableDelta = 1000 * 60 * 60 * 24 * 3; // 3 days
export const load: PageServerLoad = async ({ params, url, fetch }) => {
  // TODO: we'll use the params when we figure out how to quickly get other school courses
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const schoolId = params.schoolId;
  const query: string = url.searchParams.get("query") ?? "";
  const field: string = url.searchParams.get("field") ?? "";
  if (!query) {
    error(400, "Missing query parameter");
  }

  // fetch school if needed
  const { _source: school } = await fetch("/api/schools", {
    method: "POST",
    body: JSON.stringify({ schoolId }),
  }).then((res) => res.json());
  const currentDate = new Date();
  if (
    school.date == null ||
    school.date.getTime() - currentDate.getTime() > acceptableDelta
  ) {
    // wait for school to be scraped
    await fetch("/api/schools", {
      method: "PUT",
      body: JSON.stringify({ schoolId }),
    });
  }

  if (field == "") {
    const professors = await elasticSearch(
      {
        index: "professors",
        query: {
          bool: {
            must: [
              {
                match: {
                  ["school.id"]: schoolId,
                },
              },
              {
                simple_query_string: {
                  query: query,
                },
              },
            ],
          },
        },
        size: 500,
      },
      fetch,
    );
    return {
      professors: professors,
    };
  } else {
    const professors = await elasticSearch(
      {
        index: "professors",
        query: {
          bool: {
            must: [
              {
                match: {
                  ["school.id"]: schoolId,
                },
              },
              {
                term: { [field]: query },
              },
            ],
          },
        },
        size: 500,
      },
      fetch,
    );
    return {
      professors: professors,
    };
  }
};
