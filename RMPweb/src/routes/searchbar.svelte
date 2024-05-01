<script lang="ts">
  import { Combobox, type Selected } from "bits-ui";
  export let items: Selected<string>[] = [];
  export let selectedValue = "";
  export let touchedInput = false;
  export let placeholder = "";
  export let inputProps = {};
  $: filteredItems =
    selectedValue && touchedInput
      ? items.filter((item) => item.value.includes(selectedValue.toLowerCase()))
      : items;
</script>

<Combobox.Root bind:inputValue={selectedValue} bind:touchedInput>
  <Combobox.Input {placeholder} />
  <Combobox.Label />
  <Combobox.Content>
    {#each items as item (item.value)}
      <Combobox.Item {...item} class="bg-white">
        <Combobox.ItemIndicator />
        {item.label}
      </Combobox.Item>
    {/each}
    <Combobox.Separator />
  </Combobox.Content>
  <Combobox.Arrow />
  <Combobox.HiddenInput {...inputProps} />
</Combobox.Root>
