# Changelogs

## 5.0.0

### Breaking Changes

- Svelte ^4.0 is required

## v4.0.0

### Breaking Changes

- All prefix change from "szot" to "uai". For example instead of using --szot-primary use
  --uai-primary.
- The package name change from "szot-ui-experimental" to "uai-components"
- Versions < 4 are in:
  - https://www.npmjs.com/package/szot-ui-experimental
  - https://gitlab.com/team-tecnologia/public-pkgs/szot-ui

## v3.16.0

### Features

- Enable change label of buttons in dialog shorthand

### Refactor

### Fix

## v3.15.0

### Features

- Possibility of filtering select elements based on fields other than just the text of the elements.

### Refactor

### Fix

## v3.14.0

### Features

- Allow changing the padding of the checkbox and radio button badge pill.
- Added the possibility of hiding the icon in the select, changing the maximum size of the select
  dropdown and limiting the maximum number of items that will be shown within the select dropdown.

### Refactors

### Fix

## v3.13.0

### Features

- enable edit message inside message box component using a text area inside component
- enable change justify-content and align-items css properties in list checkbox and list radiobutton
  components

### Refactors

### Fix

## v3.12.0

### Features

- enable change error height hidden (Input, Select and Textarea).

### Refactors

### Fix

## v3.11.0

### Features

- Create MessageBox, a component for displaying messages in a chat.
- Create ChatInput, a variation of input with more options for a chat.

### Refactors

### Fix

- Fixed problem with Textarea when there was no label and a blank square remained.

## v3.10.0

### Features

- allow choose icon position in search input

### Refactors

### Fix

## v3.9.0

### Features

- allow choose text color of select in the floating mode

### Refactors

### Fix

- fix floating select opening below another form field

## v3.8.0

### Features

- allow more customization in checkbox using slots

### Refactors

### Fix

## v3.7.0

### Features

- allow create list for kanban that can't be ordered
- allow set select to open with a floating dropdown

### Refactors

### Fix

## v3.6.2

### Features

### Refactors

### Fix

- make kanban handle with horizontal scroll

### Breaking Changes

## v3.6.1

### Features

### Refactors

### Fix

- make `search input` `items` props reative again

### Breaking Changes

## v3.6.0

### Features

- search input now uses fuzzy method that is more performative and allow deep search
- add css variable to change kanban column width

### Refactors

- refactor some docs, to say more about css cascade using css variables.

### Fix

- fix some docs

### Breaking Changes

## v3.5.0

### Features

- Create card component
- Create color picker component
- Create kanban componentes like board, list, and label

### Refactors

### Fix

### Breaking Changes

## v3.4.0

### Features

- Add in Dialog component and shorthand possibility of centralize Dialog content

### Refactors

### Fix

- It fixes the error of the input label not applying the clipping on the border when, when it comes
  into focus but it still doesn't have text.

### Breaking Changes

## v3.3.0

### Features

- Add possibility of hide label in Select component
- Add placeholder in Select component

### Refactors

### Fix

### Breaking Changes

## v3.2.0

### Features

- Add possibility to use async functions on dialog callbacks.

### Refactors

### Fix

- Remove autofocus from close button on modal to prevent modal close on press enter.
- Add missing documentation about dropdown behavior.
- Remove dispatch of close event on modal component when modal is destroyed.

### Breaking Changes

## v3.1.1

### Features

### Refactors

### Fix

- Fix modal close button getting over the dropdown and others elements with absolute position.

### Breaking Changes
