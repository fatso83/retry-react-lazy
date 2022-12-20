# Retry dynamic imports with Lazy react

Read this article to understand the details



## Usage


```tsx
const LazyAbout = LazyReact(() => import("./components/About"));
const LazyHome = LazyReact(() => import("./components/Home"));

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