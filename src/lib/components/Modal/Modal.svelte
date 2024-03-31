<script
  context="module"
  lang="ts"
>
  let modalContexts: symbol[] = [];
</script>

<script lang="ts">
  import { fade, scale } from "svelte/transition";
  import { quintOut } from "svelte/easing";
  import { createEventDispatcher, onDestroy } from "svelte";
  import Button from "../formFields/Button/Button.svelte";

  // don't show the header (including the x button)
  export let disableHeader = false;

  // open and close the modal (make a bind to sync, or use the close Modal event)
  export let opened = false;

  // when true, if "Escape" is pressed will close the modal
  export let closeOnEsc = true;

  // when true, if user click out the modal will close it
  export let closeOnClickOut = true;

  /*
    when true, if user click on X button the modal will dispatch an 'tryToClose' event
    instead of close immediately
  */
  export let checkBeforeClose = false;

  /**
   * If true, hide close button in the modal
   * @type {boolean}
   */
  export let hideCloseButton = false;

  let modalOverlayElement: HTMLElement;
  const dispatcher = createEventDispatcher();
  const id = Symbol("my-self");

  function scrolltoggle(disable: boolean) {
    // Get the current page scroll position
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    if (disable) {
      // if any scroll is attempted,
      // set this to the previous value
      window.onscroll = () => {
        window.scrollTo(scrollLeft, scrollTop);
      };
    } else {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      window.onscroll = () => {};
    }
  }

  function onOpen() {
    modalContexts.push(id);
    scrolltoggle(true);
  }

  function removeMeFromTheContext() {
    modalContexts = modalContexts.filter((modalID) => modalID !== id);
  }

  function onTryToClose() {
    if (!checkBeforeClose) {
      opened = false;
    } else {
      dispatcher("tryToClose");
    }
  }

  function onClose(dispatchCloseEvent: boolean) {
    removeMeFromTheContext();

    // if there isn't more modal opened release the scroll
    if (modalContexts.length === 0) {
      scrolltoggle(false);
    }

    if (dispatchCloseEvent) {
      // fired when modal is closed
      dispatcher("closeModal");
    }
  }

  function closeIfIsLastModal() {
    if (modalContexts[modalContexts.length - 1] === id) {
      opened = false;
    }
  }

  function handleKey(ev: KeyboardEvent) {
    if (ev.key === "Escape" && closeOnEsc) closeIfIsLastModal();
  }

  function handleClickOut(ev: Event) {
    if (closeOnClickOut && ev.target === modalOverlayElement) closeIfIsLastModal();
  }

  $: if (opened) {
    onOpen();
  } else {
    onClose(true);
  }

  onDestroy(() => {
    opened = false;

    // call again, because after ondestroy svelte doens't run the variables reactions again
    onClose(false);
  });
</script>

<svelte:window on:keydown={handleKey} />

{#if opened}
  <div
    transition:fade={{ delay: 25, duration: 250 }}
    class="modal-overlay"
    bind:this={modalOverlayElement}
    on:click={handleClickOut}
    on:keypress={(e) => e.key === "Enter" && handleClickOut(e)}
  >
    <div
      class="modal-container"
      transition:scale={{
        duration: 250,
        delay: 50,
        opacity: 0.5,
        start: 0.5,
        easing: quintOut,
      }}
    >
      {#if !disableHeader}
        <header class="modal-header">
          <!-- Set the modal header. e.g.: you can add a title, some buttons -->
          <slot name="modal-header" />
          {#if !hideCloseButton}
            <div class="close-button-container">
              <Button
                icon="mdi:close"
                buttonStyle="light"
                size="round"
                on:click={onTryToClose}
              />
            </div>
          {/if}
        </header>
      {/if}
      <div class="modal-content">
        <!-- Set the modal content. e.g.: you can add a a text, a form, ... -->
        <slot name="modal-content" />
      </div>
      <div class="modal-footer">
        <!-- Set the modal footer. e.g.: you can add a diclaimer, some buttons -->
        <slot name="modal-footer" />
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  .modal-overlay {
    --bg-color: var(--uai-modal-bg-color, white);
    --width: var(--uai-modal-width, fit-content);
    --height: var(--uai-modal-height, fit-content);
    --max-height: var(--uai-modal-max-height, calc(100vh - 1.2rem));
    --max-width: var(--uai-modal-max-width, calc(100vw - 1.2rem));
    --overlay-color: var(--uai-modal-overlay-color, #ccc);
    --overlay-blur: var(--uai-modal-overlay-blur, 2px);
    --z-index: var(--uai-modal-z-index, 9999);
    --close-bg-color: var(--uai-modal-close-bg-color, var(--theme-light-surface));
    --close-txt-color: var(--uai-modal-close-txt-color, var(--theme-txt-on-light-surface));
    --padding: var(--uai-modal-padding, 0.6rem);
    --margin-content: var(--uai-modal-margin-content, 0.6rem 0);
    --header-padding: var(--uai-modal-header-padding, 0.9375rem 0.9375rem 0rem 0.9375rem);
    --footer-padding: var(--uai-modal-footer-padding, 0rem 0.9375rem 0.9375rem 0.9375rem);
    --content-padding: var(--uai-modal-content-padding, 0rem 0.9375rem 0.9375rem 0.9375rem);

    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    z-index: var(--z-index);
    backdrop-filter: blur(var(--overlay-blur));

    &::before {
      content: "";
      display: block;
      position: absolute;
      inset: 0;
      background: var(--overlay-color);
      opacity: 0.2;
      z-index: 1;
    }

    .modal-container {
      display: grid;
      grid: auto 1fr auto / 1fr;
      background: var(--bg-color);

      width: var(--width);
      height: var(--height);
      max-height: var(--max-height);
      max-width: var(--max-width);
      padding: var(--padding);

      border-radius: var(--theme-large-shape);
      box-shadow: var(--theme-high-shadow);

      z-index: 2;
    }

    .modal-header {
      display: grid;
      grid-template-columns: 1fr auto;
      grid-gap: 0.5em;
      border-radius: 15px 15px 0 0;
      align-items: center;
      padding: var(--header-padding);

      .close-button-container {
        --uai-button-background-color: var(--close-bg-color);
        --uai-button-icon-color: var(--close-txt-color);
      }
    }

    .modal-content {
      overflow-y: auto;
      margin: var(--margin-content);
      padding: var(--content-padding);
    }

    .modal-footer {
      padding: var(--footer-padding);
    }
  }
</style>
