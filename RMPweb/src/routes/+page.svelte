<script lang="ts">
  import type { PageData } from "./$types.js";
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import { formSchema, type FormSchema } from "./search/schema";
  import Searchbar from "./searchbar.svelte";
  import * as Card from "$lib/components/ui/card";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { type Selected } from "bits-ui";

  export let data: PageData;
  const form = superForm(data.form, {
    validators: zodClient(formSchema),
    // onUpdated: ({ form: f }) => {
    //   console.log(f);
    // },
  });

  const { form: formData, enhance } = form;

  let schools: Selected<string>[] = [
    { value: "U2Nob29sLTg4MQ==", label: "SJSU" },
  ];
  let courses: Selected<string>[] = [
    { value: "U2NamesNob29sLTg4MQ==", label: "SJSU" },
  ];
  let disableCourse = true;
  let disableSubmit = true;
</script>

<div
  class="w-full h-full flex flex-col justify-center items-center align-middle"
>
  <Card.Root>
    <Card.Header>
      <Card.Title>RateMyProfessors.help</Card.Title>
      <Card.Description>Search for a school...</Card.Description>
    </Card.Header>
    <Card.Content>
      <form method="POST" use:enhance>
        <Form.Field {form} name="schoolId">
          <Form.Control let:attrs>
            <Searchbar
              items={schools}
              bind:value={$formData.schoolId}
              placeholder="School name"
              inputProps={attrs}
              onSelectedChange={() => {
                disableCourse = false;
              }}
            />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Field {form} name="course">
          <Form.Control let:attrs>
            <Searchbar
              items={schools}
              bind:value={$formData.course}
              placeholder="Course name"
              inputProps={attrs}
              disabled={disableCourse}
              onSelectedChange={() => {
                disableSubmit = false;
              }}
            />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Button class="btn btn-secondary" disabled={disableSubmit}>
          Search
        </Form.Button>
      </form>
    </Card.Content>
  </Card.Root>
</div>
