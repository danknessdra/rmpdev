<script lang="ts">
  import { Combobox } from "bits-ui";
  import { page } from "$app/stores";
  import * as Table from "$lib/components/ui/table";
  import "@fortawesome/fontawesome-free/css/all.min.css";
  import { Button } from "$lib/components/ui/button";

  const results = $page.data.courses;
  let result_data = results.hits.hits;
  // sort should be descending when clicked so we set ascending to true
  let asc = true;
  function getSortIcon() {
    return '<i class="fas fa-sort"></i>';
  }
  const filters = [
    { value: "avgDifficulty", label: "Average Difficulty" },
    { value: "wouldTakeAgainPercent", label: "Would take again %" },
    { value: "numRatings", label: "# of ratings" },
    { value: "avgRating", label: "Average Rating" },
  ];
  let activeFilter: string = "";
  function sortData(key: string) {
    asc = !asc;
    activeFilter = key;
    result_data = result_data.sort(function (a, b) {
      var x = a["_source"]["node"][key];
      var y = b["_source"]["node"][key];
      const x_vs_y = x < y ? -1 : x > y ? 1 : 0;
      return asc ? x_vs_y : -x_vs_y;
    });
    return;
  }
</script>

{#if results}
  <div class="table-container">
    <Table.Root>
      <!-- <Table.Caption></Table.Caption> -->
      <Table.Header>
        <Table.Row>
          <Table.Head class="w-[100px]">Name</Table.Head>
          {#each filters as filter}
            <Table.Head>
              <button
                type="button"
                class="flex items-center justify-between align-middle w-full {activeFilter ===
                filter.value
                  ? 'text-blue-500'
                  : 'text-gray-500'}"
                on:click={() => sortData(filter.value)}
              >
                {filter.label}
                {#if activeFilter === filter.value}
                  <i class="fas fa-sort-{asc ? 'up' : 'down'}"></i>
                {:else}
                  <i class="fas fa-sort"></i>
                {/if}
              </button>
            </Table.Head>
          {/each}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#each result_data as result}
          <Table.Row>
            <Table.Cell class="font-medium text-lg"
              ><a
                href="https://www.ratemyprofessors.com/professor/{atob(
                  result._source.node.id,
                ).slice(8)}"
                class="underline underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
                >{result._source.node.firstName}
                {result._source.node.lastName}</a
              ></Table.Cell
            >
            <Table.Cell class="font-medium text-base"
              >{result._source.node.avgDifficulty}</Table.Cell
            >
            <Table.Cell class="font-medium text-base"
              >{result._source.node.wouldTakeAgainPercent.toFixed(
                2,
              )}</Table.Cell
            >
            <Table.Cell class="font-medium text-base"
              >{result._source.node.numRatings}</Table.Cell
            >
            <Table.Cell class="text-right text-lg font-medium">
              <span
                class={result._source.node.avgRating >= 4
                  ? "text-green-400"
                  : result._source.node.avgRating <= 2
                    ? "text-red-400"
                    : "text-gray-400"}
              >
                {result._source.node.avgRating}
              </span>
            </Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>
{:else}
  Error with loading data!
{/if}
<div class="flex-col w-5/6 mx-auto space-y-4"></div>

<style>
  .table-container {
    width: 80%;
    margin: 0 auto;
    padding: 20px;
  }
</style>
