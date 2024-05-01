<script lang="ts">
  import type { PageData } from "./$types.js";
  import * as Form from "$lib/components/ui/form";
  import { Input } from "$lib/components/ui/input";
  import { formSchema, type FormSchema } from "./search/schema";
  import Searchbar from "./searchbar.svelte";
  import * as Card from "$lib/components/ui/card";
  import {
    type SuperValidated,
    type Infer,
    superForm,
  } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";

  export let data: PageData;
  const form = superForm(data.form, {
    validators: zodClient(formSchema),
  });

  const { form: formData, enhance } = form;

  let schools = [{ value: "U2Nob29sLTg4MQ==", label: "SJSU" }];
  let selectedSchoolId = "";
</script>

<div
  class="search-page w-full h-full flex flex-col justify-center items-center align-middle"
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
              selectedValue={selectedSchoolId}
              placeholder="School name"
              inputProps={attrs}
            />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <Form.Button class="btn btn-secondary">Search</Form.Button>
      </form>
    </Card.Content>
    <Card.Footer></Card.Footer>
  </Card.Root>
</div>
