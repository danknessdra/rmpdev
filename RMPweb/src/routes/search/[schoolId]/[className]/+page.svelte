<script lang="ts">
    import SearchBar from "../../../searchbar.svelte";
    export let review = "";

</script>


<div class='flex-col w-5/6 mx-auto space-y-4'>
  <div class="card shadow-xl bg-primary">
    <div class="card-body">
      <div class="search-box-container">
        <h1 class="text-3xl">CS 100W @ SJSU</h1>
        <SearchBar input="Search professors/reviews..." bind:output={review}/>
        <div class="card-actions justify-end">
          <button class="btn btn-secondary">Search</button>
        </div>
      </div>
    </div>
  </div>
  <h1 class="text-2xl"> Reviews </h1>
  <div class="card shadow-xl bg-secondary text-black">
    <div class="card-body">
      <h1 class="text-xl">
        Professor:
        <a class="text-blue-800">Gregory Tomlinson</a>
      </h1>
      <h1 class="text-xl">Grade: A</h1>
      <h2 class="text-lg">Difficulty: 2</h2>
      <h2 class="text-lg">Rating: 5</h2>
      <p>A skill class like this one is more personal than being tested on dates and events, but professor makes the class as workable and pain-free as possible. Assigns good readings, and has a broad tolerance for different styles & interests among students. Very good comments and suggestions that do reflect how your writing will be seen in other classes.</p>
      <a class="text-blue-800">Link to RMP</a>
    </div>
  </div>
  <hr/>
  <h1 class="text-2xl"> Professors </h1>
  <div class="card shadow-xl bg-secondary text-black">
    <div class="card-body">
      <h1 class="text-xl">Gregory Tomlinson</h1>
      <p>Average difficulty for CS 100W: 2.6</p>
      <p>Average rating for CS 100W: 5</p>
      <a class="text-blue-800">Link to RMP</a>
    </div>
  </div>
</div>


