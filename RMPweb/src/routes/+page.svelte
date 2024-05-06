<script lang="ts">
  import type { PageData } from "./$types.js";
  import * as Form from "$lib/components/ui/form";
  import * as Tabs from "$lib/components/ui/tabs";
  import { formSchema, type FormSchema } from "./search/schema";
  import Searchbar from "./Searchbar.svelte";
  import * as Card from "$lib/components/ui/card";
  import { superForm } from "sveltekit-superforms";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { type Selected } from "bits-ui";
  import type { SearchRequest } from "@elastic/elasticsearch/lib/api/types.js";
  import { debounce } from "lodash-es";
  import type { SearchResponse } from "@elastic/elasticsearch/lib/api/typesWithBodyKey.js";
  // import { browser, building, dev, version } from "$app/environment";
  export let data: PageData;
  const form = superForm(data.form, {
    validators: zodClient(formSchema), // onUpdated: ({ form: f }) => { console.log(f);
    // },
  });

  const { form: formData, enhance } = form;

  let elasticSearchRequest: SearchRequest;
  elasticSearchRequest = {
    index: "schools",
    query: {
      match_all: {},
    },
  };
  let schools: Selected<string>[] = [
    { value: "U2Nob29sLTg4MQ==", label: "SJSU" },
    { value: "asdf", label: "SJSU" },
  ];
  let courses: Selected<string>[] = [];
  let disableCourse = true;
  let disableSubmit = true;
  // let trySaveSearch = () => {};
  // let savedSearches: FormSchema[] = [];
  // if (browser) {
  //   savedSearches = localStorage.getItem("savedSearches") ?? [];
  //   trySaveSearch = (e: SubmitEvent) => {
  //     console.log(e);
  //     const formData = new FormData(e.target as HTMLFormElement);
  //     savedSearches = [
  //       ...savedSearches,
  //       {
  //         schoolId: formData.get("schoolId"),
  //         course: formData.get("course"),
  //       }, ]; };
  // }
  // let inputtedSchool = "";
  // $: console.log(inputtedSdebounce((event) => {
  const handleSchoolInput = debounce((event) => {
    const currentInput = event.detail.currentTarget.value;
    elasticSearchRequest = {
      index: "schools",
      query: {
        match: { name: currentInput },
      },
    };
    fetch("/api/search/", {
      method: "POST",
      body: JSON.stringify(elasticSearchRequest),
    })
      .then((res) => res.json())
      .then((result: SearchResponse) => {
        schools = result.hits.hits.map((hit) => {
          return { value: hit._id, label: hit._source.name };
        });
      });
  }, 1000);
</script>

<div
  class="w-full h-full flex flex-col justify-center items-center align-middle"
>
  <Tabs.Root value="search" class="w-[400px]">
    <Tabs.List class="w-full grid grid-cols-2">
      <Tabs.Trigger value="search">Search</Tabs.Trigger>
      <Tabs.Trigger value="savedSearches">Saved Searches</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="search">
      <Card.Root class="min-w-40">
        <Card.Header>
          <Card.Title>RateMyProfessors.help</Card.Title>
          <Card.Description>Search for a school...</Card.Description>
        </Card.Header>
        <form method="POST" use:enhance>
          <Card.Content>
            <Form.Field {form} name="schoolId">
              <Form.Control let:attrs>
                <Searchbar
                  bind:items={schools}
                  placeholder="School name"
                  inputProps={attrs}
                  bind:selectedValue={$formData.schoolId}
                  on:input={handleSchoolInput}
                  on:selectedchange={(event) => {
                    console.log(event);
                    disableCourse = true;
                    elasticSearchRequest = {
                      index: "schools",
                      query: {
                        match: { name: "" },
                      },
                    };
                    fetch("/api/search/", {
                      method: "POST",
                      body: JSON.stringify(elasticSearchRequest),
                    })
                      .then((res) => res.json())
                      .then((result) => {
                        courses = result;
                        disableCourse = false;
                      });
                  }}
                />
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
            <Form.Field {form} name="course">
              <Form.Control let:attrs>
                <Searchbar
                  items={courses}
                  bind:selectedValue={$formData.course}
                  placeholder="Course name"
                  inputProps={attrs}
                  disabled={disableCourse}
                  on:selectedchange={() => {
                    disableSubmit = false;
                  }}
                />
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
          </Card.Content>
          <Card.Footer class="w-full flex justify-end">
            <!-- <Button>Reset</Button> -->
            <Form.Button disabled={disableSubmit}>Search</Form.Button>
          </Card.Footer>
        </form>
      </Card.Root>
    </Tabs.Content>
    <Tabs.Content value="savedSearches">
      <!-- to be done -->
    </Tabs.Content>
  </Tabs.Root>
</div>
