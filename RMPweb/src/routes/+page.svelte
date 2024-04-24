<!-- <script> -->
<!-- let questions = [ -->
<!--   { id: 1, text: `Where did you go to school?` }, -->
<!--   { id: 2, text: `What is your mother's name?` }, -->
<!--   { id: 3, text: `What is another personal fact that an attacker could easily find with Google?` } -->
<!-- ]; -->
<!---->
<!-- let selected; -->
<!---->
<!-- let answer = ''; -->
<!---->
<!-- function handleSubmit() { -->
<!--   alert(`answered question ${selected.id} (${selected.text}) with "${answer}"`); -->
<!-- } -->
<!-- </script> -->
<!---->
<!-- <h2>Insecurity questions</h2> -->
<!---->
<!-- <form on:submit|preventDefault={handleSubmit}> -->
<!--   <select bind:value={selected} on:change={() => (answer = '')}> -->
<!--     {#each questions as question} -->
<!--       <option value={question}> -->
<!--         {question.text} -->
<!--       </option> -->
<!--     {/each} -->
<!--   </select> -->
<!---->
<!--   <input bind:value={answer} /> -->
<!---->
<!--   <button disabled={!answer} type="submit"> Submit </button> -->
<!-- </form> -->
<!---->
<!-- <p>selected question {selected ? selected.id : '[waiting...]'}</p> -->
<!---->
<!-- <style> -->
<!-- input { -->
<!--   display: block; -->
<!--   width: 500px; -->
<!--   max-width: 100%; -->
<!-- } -->
<!-- </style> -->
<script lang="ts">
  import Searchbar from "./searchbar.svelte";

  let schools = [{ label: "SJSU", id: "U2Nob29sLTg4MQ==" }];
  let selectedSchool: string = "";
  let course: string = "";
</script>

<div class="search-box">
  <div class="card w-96 bg-base-100 shadow-xl bg-primary">
    <div class="card-body">
      <div class="search-box-container">
        <h1 class="text-3xl font-bold">RateMyProfessors.help</h1>
        Search for a school and course to get started!
        <Searchbar input="School" bind:output={school} />
        <Searchbar input="Course" bind:output={course} />
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
