<script lang="ts">
  import { Combobox, type Selected } from "bits-ui";
  export let items: Selected<string>[] = [];
  export let value = "";
  export let touchedInput = false;
  export let placeholder = "";
  export let inputProps = {};
  $: filteredItems =
    value && touchedInput
      ? items.filter((item) =>
          item.label?.toLowerCase().includes(value.toLowerCase()),
        )
      : items;
  export let onSelectedChange = () => {};
  export let disabled = false;
</script>

<Combobox.Root
  bind:inputValue={value}
  bind:touchedInput
  {onSelectedChange}
  bind:disabled
>
  <Combobox.Input {placeholder} />
  <Combobox.Label />
  <Combobox.Content class="bg-white border-solid border-2 rounded-sm">
    {#each filteredItems as item (item.value)}
      <Combobox.Item {...item} class="hover:bg-blue-200">
        <Combobox.ItemIndicator />
        {item.label}
      </Combobox.Item>
    {/each}
    <Combobox.Separator />
  </Combobox.Content>
  <Combobox.Arrow />
  <Combobox.HiddenInput {...inputProps} />
</Combobox.Root>
