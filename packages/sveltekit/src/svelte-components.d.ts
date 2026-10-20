// Svelte component module declarations for TypeScript's module resolver.
// Keep this scoped to .svelte files; do not suppress other missing modules.
declare module '*.svelte' {
  import type { Component } from 'svelte';
  const component: Component<any>;
  export default component;
}
