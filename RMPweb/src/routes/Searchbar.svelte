<script lang="ts">
  import { Combobox, type Selected } from "bits-ui";
  import { Separator } from "$lib/components/ui/separator";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let items: Selected<string>[] = [];
  export let selectedValue = "";
  export let touchedInput = false;
  export let placeholder = "";
  export let inputProps = {};
  export let disabled = false;
  export let loading = false;
  $: filteredItems = items ?? [];
</script>

<Combobox.Root
  bind:inputValue={selectedValue}
  bind:touchedInput
  onSelectedChange={(event) => {
    dispatch("selectedchange", event);
  }}
  bind:disabled
>
  <!-- classes are taken from the shadcn input -->
  <Combobox.Input
    {placeholder}
    on:input
    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm
    ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium
    placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
    focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  />
  <Combobox.Label />
  <Combobox.Content class="bg-white border-solid border-2 rounded-md p-2">
    {#each filteredItems as item, i (item.value)}
      {#if i > 0}
        <Separator />
      {/if}
      <Combobox.Item {...item} class="hover:bg-blue-200 p-2">
        <Combobox.ItemIndicator />
        {item.label}
      </Combobox.Item>
    {/each}
    <Combobox.Separator />
  </Combobox.Content>
  <Combobox.Arrow />
  <Combobox.HiddenInput {...inputProps} />
</Combobox.Root>
