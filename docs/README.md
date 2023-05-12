# Retry dynamic imports

> Retry dynamic imports using cache busting and exponential backoff

This is a fork of Alon Mizrahi's work, made available as a package and with additional improvements

Completed improvements:

- ✅ unit tests
- ✅ support non-Chromium browsers (like Firefox)
- ❌ cache previous resolutions

## Why not just catch a failure and reload the page?

While that works fine in Firefox, in Chromium based browsers (Edge, Chrome, ...) a failed module import is _cached_ and that failure is _sticky_: it is not retried on reload or over browser restarts (per Chrome 113). That is _real_ failures, not DevTool URL blocking, which is _not sticky_, for whatever reason.

## Demo?

1. Open the [demo application that is deployed on Github Pages](https://fatso83.github.io/retry-dynamic-import/demo)
2. Open DevTools and refresh the page
3. Right click on the ExpensiveComponent.\* url and choose to block it
4. Refresh and see the network requests fail in the Network tab of DevTools
5. Unblock the url and see it work again

If you want to see the sticky behavior mentioned above, setup [Charles Proxy and its "Breakpoints" feature](https://www.charlesproxy.com/documentation/proxying/breakpoints/) to be able to selectively block or accept requests. Works great!

## Limitations

Transitive imports: read [this article](https://medium.com/@alonmiz1234/retry-dynamic-imports-with-react-lazy-c7755a7d557a) to understand the details
of how dynamic imports might fail and how this solves some of these use cases. One use case it cannot solve is if a transitive
dependency should fail to load.

## Installing

```
npm i @fatso83/retry-dynamic-import
```

## Usage

The package has two main exports

```javascript
export const dynamicImportWithRetry // default implementation with 5 retries
export const createDynamicImportWithRetry  // factory to make your own version of dynamicImportWithRetry
```

### Vanilla JS util

> Works in any framework

```typescript
const dynamicImportWithRetry = createDynamicImportWithRetry(5);

const myModule = dynamicImportWithRetry(() => import("./my-module")); // this works regardless of framework, lib, etc
```

See the unit tests or the implementation for what options it supports.

### React utility

Additionallly, you can `import reactLazyWithRetry from @fatso83/retry-dynamic-import/react-lazy` for a utility that can be used instead of React.lazy() for lazy imports with retries.

_React is not a dependency of this package_, which means you can use it with Svelte or VanillaJS without pulling in extra dependencies, but if you use the `react-lazy` sub-export you will of course need to have React in your dependency tree :)

### reactLazyWithRetry

Thin wrapper around the above, calling out to `React.lazy()`

```tsx
const LazyAbout = reactLazyWithRetry(() => import("./components/About"));
const LazyHome = reactLazyWithRetry(() => import("./components/Home"));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<LazyHome />} />
        <Route path="/about" element={<LazyAbout />} />
      </Routes>
    </Suspense>
  </Router>
);
```

## Contributing

Please do!

- Run tests: `DEBUG=dynamic-import:* npm t -- --watch` (the env var is just for verbose output)