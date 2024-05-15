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
  import elasticSearch from "$lib/elasticsearch";
  import { debounce } from "lodash-es";
  import type { SearchResponse } from "@elastic/elasticsearch/lib/api/typesWithBodyKey.js";
  import { onMount } from "svelte";
  import { Input } from "$lib/components/ui/input/index.js";
  // import { browser, building, dev, version } from "$app/environment";
  export let data: PageData;
  let filters: Selected<string>[] = [
    { value: "avgDifficulty", label: "Average Difficulty" },
    { value: "avgRating", label: "Average Rating" },
    { value: "numRatings", label: "# of ratings" },
    { value: "wouldTakeAgainPercent", label: "Would take again %" },
  ];
  const form = superForm(data.form, {
    validators: zodClient(formSchema),
  });

  const { form: formData, enhance } = form;
  $formData.field = "";
  let schools: Selected<string>[] = [];
  onMount(() => {
    elasticSearch({
      index: "schools",
      query: {
        match_all: {},
      },
    }).then((result: SearchResponse) => {
      console.log("initial population");
      schools = result.hits.hits.map((hit) => {
        return { value: hit._id, label: hit._source.name };
      });
    });
  });

  let disableQuery = true;
  let disableSubmit = true;
  let schoolsLoading = false;

  const handleSchoolInput = debounce((event) => {
    const currentInput = event.detail.currentTarget.value;
    elasticSearch({
      sort: [{ numRatings: { order: "desc" } }],
      index: "schools",
      query: {
        match: { name: currentInput },
      },
      size: 20,
    }).then((result: SearchResponse) => {
      console.log(result.hits.hits);
      schools = result.hits.hits.map((hit) => {
        return {
          value: hit._id,
          label: hit._source.name,
        };
      });
      schoolsLoading = false;
    });
  }, 500);
  function handleSchoolSelection(event: CustomEvent<{ value: string }>) {
    disableQuery = false;
  }
</script>

<div
  class="w-full h-full flex flex-col justify-center items-center align-middle"
>
  <Tabs.Root value="search" class="w-[400px]">
    <!-- Set to 3 when adding saved searches-->
    <Tabs.List class="w-full grid grid-cols-2">
      <Tabs.Trigger value="search" on:click={() => ($formData.field = "")}>
        Search
      </Tabs.Trigger>
      <Tabs.Trigger value="custom_search">Custom Search</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="search">
      <Card.Root class="min-w-40">
        <Card.Header>
          <Card.Title>General Search</Card.Title>
          <Card.Description>
            Search for anything on RateMyProfessors.com
          </Card.Description>
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
                  bind:loading={schoolsLoading}
                  on:input={(event) => {
                    disableSubmit = true;
                    disableQuery = true;
                    schoolsLoading = true;
                    handleSchoolInput(event);
                  }}
                  on:selectedchange={handleSchoolSelection}
                />
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
            <Form.Field {form} name="query">
              <Form.Control let:attrs>
                <!-- down the line we might be able to upgrade this to a Searchbar with suggested course names but i'm lazy -->
                <Input
                  {...attrs}
                  placeholder="Query"
                  bind:value={$formData.query}
                  on:input={() => {
                    disableSubmit = !Boolean($formData.query);
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
    <Tabs.Content value="custom_search">
      <Card.Root class="min-w-40">
        <Card.Header>
          <Card.Title>Custom Search</Card.Title>
          <Card.Description>
            Search with specific criteria for RateMyProfessors.com.
          </Card.Description>
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
                  bind:loading={schoolsLoading}
                  on:input={(event) => {
                    disableSubmit = true;
                    disableQuery = true;
                    schoolsLoading = true;
                    handleSchoolInput(event);
                  }}
                  on:selectedchange={handleSchoolSelection}
                />
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
            <Form.Field {form} name="field" class="mb-2">
              <Form.Control let:attrs>
                <Searchbar
                  items={filters}
                  bind:selectedValue={$formData.field}
                  placeholder="Field"
                  inputProps={attrs}
                />
              </Form.Control>
            </Form.Field>
            <Form.Field {form} name="query">
              <Form.Control let:attrs>
                <Input
                  {...attrs}
                  placeholder="Query"
                  bind:value={$formData.query}
                  on:input={() => {
                    disableSubmit = !Boolean($formData.query);
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
    <!-- <Tabs.Content value="savedSearches"> -->
    <!-- to be done -->
    <!-- </Tabs.Content> -->
  </Tabs.Root>
</div>
