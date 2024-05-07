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
    event.url.searchParams.set("course", form.data.course);
    throw redirect(
      302,
      `/search/${form.data.schoolId}?course=${encodeURIComponent(form.data.course)}`,
    );
  },
};
