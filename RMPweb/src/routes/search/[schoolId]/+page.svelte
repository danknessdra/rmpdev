<script lang="ts">
  import { Combobox } from "bits-ui";
  import { page } from "$app/stores";
  import * as Table from "$lib/components/ui/table";
  import '@fortawesome/fontawesome-free/css/all.min.css'

  const results = $page.data.courses;
  let result_data = results.hits.hits;
  let asc = -1;
  function getSortIcon() {
		return '<i class="fas fa-sort"></i>';
	}
  function sortData(key:string) {
    asc = -asc;
		result_data = result_data.sort(function(a, b) {
      var x = a["_source"]["node"][key]; 
      var y = b["_source"]["node"][key];
      return asc == -1 ? ((x < y) ? -1 : ((x > y) ? 1 : 0)) : ((x < y) ? 1 : ((x > y) ? -1 : 0));
    });
    return;
	}
</script>
<style>
  .table-container {
      width: 80%;
      margin: 0 auto; 
      padding: 20px; 
  }
</style>

{#if results}
<div class="table-container">
  <Table.Root>
    <!-- <Table.Caption></Table.Caption> -->
    <Table.Header>
      <Table.Row>
        <Table.Head class="w-[100px]">Name</Table.Head>
        <Table.Head><div on:click={() => sortData('avgDifficulty')}>Difficulty {@html getSortIcon()}</div></Table.Head>
        <Table.Head><div on:click={() => sortData('wouldTakeAgainPercent')}>Would Take Again % {@html getSortIcon()}</div></Table.Head>
        <Table.Head><div on:click={() => sortData('numRatings')}># of Ratings {@html getSortIcon()}</div></Table.Head>
        <Table.Head class="text-right"><div on:click={() => sortData('avgRating')}>Ratings {@html getSortIcon()}</div></Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
    {#each result_data as result}
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
  </div>
{:else}
  Error with loading data!
{/if}
<div class="flex-col w-5/6 mx-auto space-y-4"></div>
