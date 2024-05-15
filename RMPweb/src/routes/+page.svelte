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
  let filters_dictionary = {
    'Average Difficulty': 'avgDifficulty',
    'Average Rating': 'avgRating',
    'Would take again %' : 'wouldTakeAgainPercent',
    '# of ratings': 'numRatings'
  }
  function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }
  const form = superForm(data.form, {
    validators: zodClient(formSchema),
    // onUpdated: ({ form: f }) => {
    //   console.log(f);
    // },
  });

  const { form: formData, enhance } = form;
  $formData.field=""
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

  let courses: Selected<string>[] = [];
  let disableCourse = true;
  let disableSubmit = true;
  let schoolsLoading = false;

  const handleSchoolInput = debounce((event) => {
    const currentInput = event.detail.currentTarget.value;
    elasticSearch({
      index: "schools",
      query: {
        match: { name: currentInput },
      },
    }).then((result: SearchResponse) => {
      schools = result.hits.hits.map((hit) => {
        return { value: hit._id, label: hit._source.name };
      });
      schoolsLoading = false;
    });
  }, 500);
  function handleSchoolSelection(event: CustomEvent<{ value: string }>) {
    elasticSearch({
      index: "sjsu_professors",
      query: {
        match_all: {},
      },
    }).then((result: { hits: { hits: any[] } }) => {
      courses = result.hits.hits.map(
        (hit: { _id: any; _source: { name: any } }) => {
          return { value: hit._id, label: hit._source.name };
        },
      );
      disableCourse = false;
    });
  }
</script>

<div
  class="w-full h-full flex flex-col justify-center items-center align-middle"
>
  <Tabs.Root value="search" class="w-[400px]">
    <!-- Set to 3 when adding saved searches-->
    <Tabs.List class="w-full grid grid-cols-2">
      <Tabs.Trigger value="search" on:click={() => $formData.field=""}>Search</Tabs.Trigger>
      <Tabs.Trigger value="custom_search">Custom Search</Tabs.Trigger>
      <!-- <Tabs.Trigger value="savedSearches">Saved Searches</Tabs.Trigger> -->
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
                    disableCourse = true;
                    schoolsLoading = true;
                    handleSchoolInput(event);
                  }}
                  on:selectedchange={handleSchoolSelection}
                />
              </Form.Control>
              <Form.FieldErrors />
            </Form.Field>
            <Form.Field {form} name="course">
              <Form.Control let:attrs>
                <!-- <Searchbar -->
                <!--   items={courses} -->
                <!--   bind:selectedValue={$formData.course} -->
                <!--   placeholder="Course name" -->
                <!--   inputProps={attrs} -->
                <!--   disabled={disableCourse} -->
                <!--   on:selectedchange={() => { -->
                <!--     disableSubmit = false; -->
                <!--   }} -->
                <!-- /> -->

                <!-- down the line we might be able to upgrade this to a Searchbar with suggested course names but i'm lazy -->
                <Input
                  {...attrs}
                  placeholder="Query"
                  bind:value={$formData.course}
                  on:input={() => {
                    if ($formData.course) {
                      disableSubmit = false;
                    } else {
                      disableSubmit = true;
                    }
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
                    disableCourse = true;
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
                <select class="bg-white border-solid border-2 rounded-md p-2" name="Field" bind:value={$formData.field}>
                  {#each ['Average Difficulty', 'Average Rating', '# of ratings', 'Would take again %'] as filter, i}
                    <option value={filters_dictionary[filter]} selected={$formData.field == getKeyByValue(filters_dictionary, $formData.field)}>{filter}</option>
                  {/each}
                </select></Form.Control>
            </Form.Field>

            <Form.Field {form} name="course">
              <Form.Control let:attrs>
                <!-- <Searchbar -->
                <!--   items={courses} -->
                <!--   bind:selectedValue={$formData.course} -->
                <!--   placeholder="Course name" -->
                <!--   inputProps={attrs} -->
                <!--   disabled={disableCourse} -->
                <!--   on:selectedchange={() => { -->
                <!--     disableSubmit = false; -->
                <!--   }} -->
                <!-- /> -->

                <!-- down the line we might be able to upgrade this to a Searchbar with suggested course names but i'm lazy -->
                <Input
                  {...attrs}
                  placeholder="Query"
                  bind:value={$formData.course}
                  on:input={() => {
                    if ($formData.course) {
                      disableSubmit = false;
                    } else {
                      disableSubmit = true;
                    }
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
