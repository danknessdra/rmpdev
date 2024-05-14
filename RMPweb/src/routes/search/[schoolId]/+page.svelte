<script lang="ts">
  import { Combobox } from "bits-ui";
  import { page } from "$app/stores";
  import * as Table from "$lib/components/ui/table";

  const results = $page.data.courses;
  console.log("courses", results);
  console.log("schoolId", $page.params.schoolId);
</script>



{#if results}
  <Table.Root>
    <!-- <Table.Caption></Table.Caption> -->
    <Table.Header>
      <Table.Row>
        <Table.Head class="w-[100px]">Name</Table.Head>
        <Table.Head>Difficulty</Table.Head>
        <Table.Head>Would Take Again %</Table.Head>
        <Table.Head># of Ratings</Table.Head>
        <Table.Head class="text-right">Ratings</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
    {#each results.hits.hits as result}
      <Table.Row>
        <Table.Cell class="font-medium text-lg"><a href = "https://www.ratemyprofessors.com/professor/{atob(result._source.node.id).slice(8)}" class = "underline underline-offset-2" target="_blank" rel="noopener noreferrer">{result._source.node.firstName} {result._source.node.lastName}</a></Table.Cell>
        <Table.Cell class="font-medium text-base">{result._source.node.avgDifficulty}</Table.Cell>
        <Table.Cell class="font-medium text-base">{result._source.node.wouldTakeAgainPercent.toFixed(2)}</Table.Cell>
        <Table.Cell class="font-medium text-base">{result._source.node.numRatings}</Table.Cell>
        <Table.Cell class="text-right text-lg font-medium">
          <span class={result._source.node.avgRating >= 4
            ? 'text-green-400'
            : result._source.node.avgRating <= 2
              ? 'text-red-400'
              : 'text-gray-400'}
              >
            {result._source.node.avgRating}
          </span>
        </Table.Cell>
      </Table.Row>
    {/each}
    </Table.Body>
  </Table.Root>
{:else}
  Error with loading data!
{/if}
<div class="flex-col w-5/6 mx-auto space-y-4"></div>
