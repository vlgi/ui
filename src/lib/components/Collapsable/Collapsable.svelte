<script
  context="module"
  lang="ts"
>
  import { writable } from "svelte/store";

  type TGroupsData = {
    lastActive: symbol;
    currActive: symbol;
  };

  type TGroups = Record<string, TGroupsData>;

  // save by the groups which item is active
  const groups = writable<TGroups>({});
</script>

<script lang="ts">
  import type { SlideParams } from "svelte/transition";
  import { slide } from "svelte/transition";
  import Icon from "../Icon/Icon.svelte";

  type TCollapsableStyle = "primary" | "secondary" | "dark" | "light";
  type TCollapsableStyleType = "outline" | "filled" | "not-filled";

  /**
   * Set the collapsable as opened (use bind to not force be always opened).
   * Set only one per group as expanded.
   * @type {boolean}
   */
  export let expanded = false;

  /**
   * Set a name to allow the sync collapsable close.
   * Set to null or leave empty to not allow syncing the items
   * @type {string}
   */
  export let group: string | null = null;

  /**
   * A title that won't be hidden when the collapsable is not expanded.
   * This title will be overhidden by the header slot if it is set.
   * @type {string}
   */
  export let title: string;

  /**
   * Wether there should be a different colored background for your content with some padding.
   * @type {boolean}
   */
  export let contentBackground = false;

  /**
   * The configuration of the transition executed when the collapsable expands and shrinks.
   * @type {object}
   */
  export let expansionTransitionParams: SlideParams = { duration: 250 };

  /**
   * Change the theme color of the collapsable.
   * @type {string}
   */
  export let collapsableStyle: TCollapsableStyle = "primary";

  /**
   * Change wheter the collapsable is outlined, filled or transparent (not-filled).
   * @type {string}
   */
  export let collapsableStyleType: TCollapsableStyleType = "filled";

  /**
   * The name of the icon that will be shown when the collapsable is not expanded
   * (`expanded == false`)
   * @type {string}
   */
  export let iconNameNotExpanded = "ci:chevron-down";

  /**
   * The name of the icon that will be shown when the collapsable is expanded
   * (`expanded == true`)
   * @type {string}
   */
  export let iconNameExpanded = "ci:chevron-up";

  const id = Symbol("my-id");

  function toggleCollapse() {
    expanded = !expanded;

    // if oppening, close all the rest
    if (expanded && group) {
      $groups[group] = {
        lastActive: $groups[group]?.currActive,
        currActive: id,
      };
    } else {
      $groups[group] = {
        lastActive: id,
        currActive: null,
      };
    }
  }

  // if the last active is me, close me
  $: if (group && $groups[group]?.lastActive === id) {
    expanded = false;
  }
</script>

<div class="collapsable style-{collapsableStyle} style-type-{collapsableStyleType}">
  <div class="overflow-hidden">
    <header
      on:click={toggleCollapse}
      on:keypress={(e) => e.key === "Enter" && toggleCollapse()}
    >
      <!-- The non-collapsable content that will be next to the chevron icon -->
      <slot name="header">
        <span class="title">{title}</span>
      </slot>
      <span class="icon">
        <Icon iconName={expanded ? iconNameExpanded : iconNameNotExpanded} />
      </span>
    </header>
    {#if expanded}
      <div
        class="content"
        class:content-background={contentBackground}
        transition:slide={expansionTransitionParams}
      >
        <div class="content-content">
          <!-- the collapsable content -->
          <div class="color">
            <slot />
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style lang="scss">
  @use "$styles/mixins" as m;

  .wrapper {
    @include m.border(10px, red);
  }

  .collapsable {
    // auxiliary theming
    --collapsable-theme-color: var(--theme-primary);
    --collapsable-theme-surface-color: var(--theme-primary-surface);
    --collapsable-theme-txt-on-surface-color: var(--theme-txt-on-primary-surface);
    --collapsable-theme-txt-color: var(--theme-primary-txt);

    --collapsable-content-theme-color: var(--theme-light);
    --collapsable-content-theme-surface-color: var(--theme-light-surface);
    --collapsable-content-theme-txt-on-surface-color: var(--theme-txt-on-light-surface);
    --collapsable-content-theme-txt-color: var(--theme-light-txt);

    --collapsable-theme-txt-on-background-color: var(--theme-txt-on-light-surface);

    // colors
    --background: var(--uai-collapsable-background, var(--style-type-background));
    --color: var(--uai-collapsable-color, var(--style-type-color));
    --border-color: var(--uai-collapsable-border-color, var(--style-type-border-color));
    --content-background: var(
      --uai-collapsable-content-background,
      var(--style-type-content-background)
    );
    --content-color: var(--uai-collapsable-content-color, var(--style-type-content-color));
    --content-border-color: var(
      --uai-collapsable-content-border-color,
      var(--style-type-content-border-color)
    );
    --icon-color: var(--uai-collapsable-icon-color, var(--style-type-icon-color));

    // measurements and spacing
    --max-height: var(--uai-collapsable-max-height, 40rem);
    --icon-font-size: var(--uai-collapsable-icon-font-size, 1.5rem);
    --margin: var(--uai-collapsable-margin, var(--theme-global-medium-padding) 0);
    --padding: var(--uai-collapsable-padding, var(--theme-global-medium-padding));
    --padding-header: var(--uai-collapsable-padding-header, var(--padding));
    --border-width: var(--uai-collapsable-border-width, var(--style-type-border-width));
    --border-radius: var(
      --uai-collapsable-border-radius,
      calc(
        calc(max(var(--icon-font-size), 1.1875rem) + calc(2 * var(--theme-global-medium-padding))) /
          2
      )
    );
    --content-padding: var(--uai-collapsable-content-padding, var(--padding));
    --content-border-width: var(
      --uai-collapsable-content-border-width,
      var(--style-type-content-border-width)
    );
    --content-border-radius: var(
      --uai-collapsable-content-border-radius,
      var(--theme-medium-shape)
    );
    --title-font-size: var(--uai-collapsable-title-font-size, 1rem);
    --box-shadow: var(--uai-collapsable-box-shadow, none);
    --backdrop-filter: var(--uai-collapsable-backdrop-filter, none);

    // Style and style type settings
    &.style {
      $styles: ("primary", "secondary", "light", "dark");

      @each $style in $styles {
        &-#{$style} {
          --collapsable-theme-color: var(--theme-#{$style});
          --collapsable-theme-surface-color: var(--theme-#{$style}-surface);
          --collapsable-theme-txt-on-surface-color: var(--theme-txt-on-#{$style}-surface);
          --collapsable-theme-txt-color: var(--theme-#{$style}-txt);
        }
      }

      &-light {
        --collapsable-content-theme-color: var(--theme-dark);
        --collapsable-content-theme-surface-color: var(--theme-dark-surface);
        --collapsable-content-theme-txt-on-surface-color: var(--theme-txt-on-dark-surface);
        --collapsable-content-theme-txt-color: var(--theme-dark-txt);
        --collapsable-theme-txt-on-background-color: var(--theme-txt-on-dark-surface);
      }
    }
    &.style-type {
      &-filled {
        // colors
        --style-type-background: var(--collapsable-theme-surface-color);
        --style-type-color: var(--collapsable-theme-txt-on-surface-color);
        --style-type-border-color: none;
        --style-type-content-background: var(--collapsable-content-theme-surface-color);
        --style-type-content-color: var(--collapsable-content-theme-txt-on-surface-color);
        --style-type-content-border-color: none;
        --style-type-icon-color: var(--collapsable-theme-txt-on-surface-color);

        // measurements and spacing
        --style-type-border-width: 0;
        --style-type-content-border-width: 0;
      }
      &-not-filled {
        // colors
        --style-type-background: transparent;
        --style-type-color: var(--collapsable-theme-txt-on-background-color);
        --style-type-border-color: none;
        --style-type-content-background: transparent;
        --style-type-content-color: var(--collapsable-theme-txt-on-background-color);
        --style-type-content-border-color: none;
        --style-type-icon-color: var(--collapsable-theme-txt-on-background-color);

        // measurements and spacing
        --style-type-border-width: 0;
        --style-type-content-border-width: 0;
      }
      &-outline {
        // colors
        --style-type-background: transparent;
        --style-type-color: var(--collapsable-theme-txt-on-background-color);
        --style-type-border-color: var(--collapsable-theme-color);
        --style-type-content-background: transparent;
        --style-type-content-color: var(--collapsable-theme-txt-on-background-color);
        --style-type-content-border-color: var(--collapsable-theme-color);
        --style-type-icon-color: var(--collapsable-theme-color);

        // measurements and spacing
        --style-type-border-width: var(--theme-medium-border);
        --style-type-content-border-width: var(--theme-medium-border);
      }
    }

    background: var(--background);
    .overflow-hidden {
      // max-height: var(--max-height);
      overflow: hidden;
    }
    // border-width: var(--border-width);
    // border-color: var(--border-color);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    backdrop-filter: var(--backdrop-filter);
    @include m.border(var(--border-width), var(--border-color));
    margin: var(--margin);

    header {
      padding: var(--padding-header);
      .title {
        @include m.text-color(var(--color));
        font-size: var(--title-font-size);
      }
      cursor: pointer;

      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
    }

    .icon {
      --uai-icon-color: var(--icon-color);
      --uai-icon-font-size: var(--icon-font-size);
    }

    .content {
      margin: var(--padding);
      margin-top: 0;
      &-content {
        overflow: auto;
        max-height: var(--max-height);
      }

      .color {
        @include m.text-color(var(--color));
      }
      &.content-background {
        background: var(--content-background);
        padding: var(--content-padding);
        .color {
          @include m.text-color(var(--content-color));
        }

        // border-width: var(--content-border-width);
        // border-color: var(--content-border-color);
        border-radius: var(--content-border-radius);
        @include m.border(var(--content-border-width), var(--content-border-color));
      }
    }
  }
</style>
