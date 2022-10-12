# vue-element-in-view

Vue3 plugin to trigger a function when an element enters the view. Lazily initializes 
IntersectionObserver instances per used threshold.

Features:
- configurable threshold per directive
- won't throw an error when used in SSR build, e.g. when used with vite-ssg, if configured.

## Install

`yarn install @lamsal-de/vue-element-in-view`

`pnpm add @lamsal-de/vue-element-in-view`

`npm install @lamsal-de/vue-element-in-view`

## Usage

### Setup

```ts
// main.ts
// ...
import elementInView from "@lamsal-de/vue-element-in-view"

const app = createApp(App)

app.use(elementInView, { 
    threshold: 50, /* your fallback threshold */ 
    ssr: false /* set to true if used in SSR mode*/ 
})
```

In any vue file you can then use:
```vue
<template>
    <div>
        <div v-element-in-view="() => {}">
            when appear with default threshold
        </div>
        <div v-element-in-view.once="() => {}">
            when appear with default threshold, triggered only once
        </div>
        <div v-element-in-view:90="() => {}">
            when appear with custom threshold 90%
        </div>
    </div>
</template>
```
