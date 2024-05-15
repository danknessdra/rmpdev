import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import elasticSearch from "$lib/elasticsearch";

export const load: PageServerLoad = async ({ params, url, fetch }) => {
  // TODO: we'll use the params when we figure out how to quickly get other school courses
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const schoolId = params.schoolId;
  const course: string = url.searchParams.get("course") ?? "course fetching failed";
  let field: string = url.searchParams.get("field") ?? "field fetching failed";
  if (!course) {
    error(400, "Missing course parameter");
  }
  if (field == "") {
    const res = await elasticSearch(
      {
        index: "sjsu_professors",
        query: {
          simple_query_string: {
            "query": course,
          },
        },
        size: 500,
      },
      fetch,
    );
    return {
      courses: await res,
    };
  }
  else {
    field = "node."+field;
    let req = {
      index: "sjsu_professors",
      query: {
        term: {}
      },
      size: 500,
    };
    req.query.term[field] = course;
    const res = await elasticSearch(
      req,
      fetch,
    );
    return {
      courses: await res,
    };
  }
};
