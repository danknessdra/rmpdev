<script context="module" lang="ts">
  export type Item = {
    value: number | string;
    label: string;
    [key: string]: unknown;
  };
</script>

<script lang="ts">
  import Check from "lucide-svelte/icons/check";
  import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
  import { tick } from "svelte";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";
  //
  export let items: Item[] = [];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export function labelFunction(item: Item): string {
    return item.label;
  } // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export function valueFunction(item: Item): string {
    return item.value.toString();
  }
  export let requestedValue: string | number = "";
  export let placeholder = "Select an item...";

  export let selectedItem: Item | undefined;
  $: selectedItem = items.find((i) => i.value === requestedValue) ?? undefined;

  let open = false;
  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function closeAndFocusTrigger(triggerId: string) {
    open = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }
  export let value = "";
</script>

<Popover.Root bind:open let:ids>
  <Command.Root>
    <Popover.Trigger>
      <!-- <Button -->
      <!--   builders={[builder]} -->
      <!--   variant="outline" -->
      <!--   role="combobox" -->
      <!--   aria-expanded={open} -->
      <!--   class="w-[200px] justify-between" -->
      <!-- > -->
      <Command.Input {placeholder} />
      <!-- </Button> -->
    </Popover.Trigger>
    <Popover.Content class="w-[200px] p-0">
      <Command.Empty>No framework found.</Command.Empty>
      <Command.Group>
        {#each items as item}
          <Command.Item
            value={valueFunction(item)}
            onSelect={(currentValue) => {
              value = currentValue;
              closeAndFocusTrigger(ids.trigger);
            }}
          >
            <Check
              class={cn(
                "mr-2 h-4 w-4",
                valueFunction(item) !== requestedValue && "text-transparent",
              )}
            />
            {labelFunction(item)}
          </Command.Item>
        {/each}
      </Command.Group>
    </Popover.Content>
  </Command.Root>
</Popover.Root>
