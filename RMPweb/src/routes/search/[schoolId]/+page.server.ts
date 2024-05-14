import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import elasticSearch from "$lib/elasticsearch";

export const load: PageServerLoad = async ({ params, url, fetch }) => {
  // TODO: we'll use the params when we figure out how to quickly get other school courses
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const schoolId = params.schoolId;
  const course: string = url.searchParams.get("course") ?? "failed";
  if (!course) {
    error(400, "Missing course parameter");
  }
  const res = await elasticSearch(
    {
      index: "sjsu_professors",
      query: {
        terms: {
          "node.courseCodes.courseName": [course],
        },
      },
    },
    fetch,
  );
  return {
    courses: await res,
  };
};
