<script setup>
import Header from './components/Header.vue';
import Navigation from './components/Navigation.vue';
import Calendar from './components/Calendar.vue';

</script>

<template>
    <header class="app-header">
      <Header />
    </header>

    <!-- Navigation component renders an <aside> element -->
    <Navigation />

    <main class="app-main">
      <Calendar />
    </main>
</template>

<style>
  /* Make the app take full viewport height and use a 2-column grid.
     Left column is fixed (navigation), right column is flexible. */
  #app {
    height: 100vh;
    display: grid;
    grid-template-columns: 280px 1fr;
    grid-template-rows: auto 1fr;
    grid-template-areas: "nav header" "nav main";
  }

  /* header spans the top */
  .app-header {
    grid-area: header;
  }

  /* the Navigation component renders an <aside> element - place it in nav area */
.app-aside {
    grid-area: nav;
    height: 100%;
    overflow: auto;
  }

  .app-main {
    grid-area: main;
    overflow: auto;
  }

</style>