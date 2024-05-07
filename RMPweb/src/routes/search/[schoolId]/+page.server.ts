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
  const courses = await fetch("/api/search/", {
    method: "POST",
    body: JSON.stringify({
      index: "sjsu_professors",
      query: {
        terms: {
          "node.courseCodes.courseName": [course],
        },
      },
    }),
  });
  console.log(courses);
  return {
    courses: await courses.json(),
  };
};
