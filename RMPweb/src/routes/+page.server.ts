import type { PageServerLoad } from "./search/[schoolId]/$types.js";
import { fail, type Actions } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { formSchema } from "./search/schema.js";
import { zod } from "sveltekit-superforms/adapters";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(formSchema)),
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }
    const url = new URL(event.url);
    console.log("url", url);
    event.url.searchParams.set("course", form.data.course);
    event.url.searchParams.set("field", form.data.field);
    redirect(302, `/search/${form.data.schoolId}?course=${form.data.course}&field=${form.data.field}`);
  },
};
