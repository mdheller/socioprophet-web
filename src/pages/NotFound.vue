import { RouterLink } from "vue-router"
import { RouterLink } from "vue-router"
import { RouterLink } from "vue-router"
<template>
  <div class="nf">
    <h1>Not Found</h1>
    <p>This route doesn’t exist. The app is fine — the link was wrong.</p>
    <RouterLink class="back" to="/dashboard">Back to Dashboard</RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<style scoped>
.nf { max-width: 720px; padding: 24px; }
h1 { margin: 0 0 8px; }
p { opacity: 0.85; }
.back { display: inline-block; margin-top: 12px; text-decoration: underline; }
</style>
