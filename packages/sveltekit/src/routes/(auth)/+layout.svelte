<script lang="ts">
  import type { LayoutProps } from './$types';
  let { children }: LayoutProps = $props();
</script>
<main class="auth"><div class="brand">ONUS <span>RFI</span></div>{@render children()}</main>
<style>
.auth{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.5rem;background:#0b1320;color:#e8eef6;padding:1rem;font-family:system-ui,sans-serif}.brand{font-size:1.5rem;font-weight:800;letter-spacing:.12em}.brand span{color:#64d6af}:global(.panel){display:grid;gap:1rem;width:min(100%,420px);padding:2rem;background:#172335;border:1px solid #344258;border-radius:14px}:global(.panel label){display:grid;gap:.4rem}:global(.panel input){background:#101a2b;color:white;border:1px solid #5b6880;border-radius:6px;padding:.75rem;font:inherit}:global(.panel button){background:#64d6af;border:0;border-radius:6px;padding:.85rem;font:inherit;font-weight:700;cursor:pointer}:global(.panel a){color:#8de1c4}:global(.panel .error){color:#ffb8b8}
</style>
