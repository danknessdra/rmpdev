<script lang="ts">
    import SearchBar from "./searchbar.svelte";
    let school:string = '';
    let course:string = '';
    
</script>


<div class='search-box'>
    <div class="card w-96 bg-base-100 shadow-xl bg-primary">
        <div class="card-body">
        <div class="search-box-container">
            <h1 class="text-3xl font-bold">RateMyProfessors.help</h1>
            Example:<br>
            School - San Jose State University<br>
            Course - CS 46A
            <SearchBar input="School" bind:output={school}/>
            <SearchBar input="Course" bind:output={course}/>
            <div class="card-actions justify-end">
                <button class="btn btn-secondary">Search</button>
            </div>
        </div>
        </div>
    </div>
  </div>

<!-- <style lang="postcss">
    :global(html) {
      background-color: rgb(0,85,253);
    }
</style> -->