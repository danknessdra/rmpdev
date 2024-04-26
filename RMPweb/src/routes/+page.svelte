<script lang="ts">
  import Searchbar, { type Item } from "./searchbar.svelte";

  let schools: Item[] = [{ value: "U2Nob29sLTg4MQ==", label: "SJSU" }];
  let selectedSchool: Item;
  function handleSelect(school: unknown) {
    console.log(school);
  }
  // let course: string = "";
</script>

<div class="search-page w-full h-full bg-primary flex-col space-between">
  <div class="card w-96 bg-base-100 shadow-xl bg-primary">
    <div class="card-body">
      <div class="search-box-container form-control">
        <h1 class="text-3xl font-bold">RateMyProfessors.help</h1>
        Search for a school and course to get started!
        <Searchbar items={schools} bind:selectedItem={selectedSchool} />
        <div class="card-actions justify-end">
          <button class="btn btn-secondary">Search</button>
        </div>
      </div>
    </div>
  </div>
</div>
