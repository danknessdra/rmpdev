<script lang="ts">
    export let input:string;
    export let output:string;
</script>

<input type="text" placeholder={input} class="input input-bordered w-full max-w-xs" bind:value={output}/>
