<template>
  <section class="h-svh text-white bg-neutral-800 flex flex-col">
    <header class="flex flex-col">
      <nav class="w-full flex justify-between px-10 mt-3">
        <v-btn variant="plain"> open </v-btn>
          <img  class="w-8 h-8" src="/images/user-icon.png" alt="">
      </nav>
    </header>
    <main class="basis-2/3 m-5">
      <slot />
    </main>
  </section>
</template>
<script setup lang="ts"></script>
