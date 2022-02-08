## Features
 - list your project features here

## How to

`npm install svelte-pdf-viewer`

### Svelte
To use the svelte componente make sure that your bundler know how to handle with typescript, scss, images and font imports.

```html
<PdfViewer file={ myFileUrl } bind:infos={ pdfInfos }/>

<script>
	import PdfViewer from 'svelte-pdf-viewer'
	let pdfInfos
	const myFileUrl = ''
</script>
```

### Vanilla
The vanilla module is bundled into a single js file, with all css and assets inline.

You can use the vanilla module as a normal npm js module, or as a [browser module](https://javascript.info/modules-intro) using the `svelte-pdf-viewer/dist/index.mjs` file.

```html
<div id="container">
</div>

<script>
	import PdfViewer from 'svelte-pdf-viewer'
    const myFileUrl = ''
    
    new PdfViewer({
        target: document.querySelector('#container'),
        props: {
            file: myFileUrl
        }
    })
</script>


```

## Props / Events / Slots / Documentation / Demo
You can see all at our [storybook page](https://team-tecnologia.gitlab.io/templates-and-snippets/svelte-package-template/).

The external components have the packages that you can use.

The internal components have the components that we use internally to build the external components.