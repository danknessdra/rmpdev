import { z } from "zod";

export const formSchema = z.object({
  schoolId: z.string().min(2).max(50),
  query: z.string().max(50),
  field: z.string().max(50),
});

export type FormSchema = typeof formSchema;
