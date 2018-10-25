<template>
  <div id="app">
    <p>
      <label>
        Separator:
        <select v-model="sep">
          <option v-for="(s, i) in seps" :key="i" :value="s">{{ s }}</option>
        </select>
      </label>
    </p>

    <section>
      <h2>Using slot with
        <code>template</code>
      </h2>
      <p>
        <small>Getting warning & losing reactivity.</small>
      </p>
      <section class="showcase">
        <t-breadcrumbs :items="items">
          <span slot="sep" @click.native="log(sep)">{{sep}}</span>
        </t-breadcrumbs>
      </section>
    </section>

  </div>
</template>

<script>
import TBreadcrumbs from './components/TBreadcrumbs';

const SEPS = ['+', '/', '#', '-', '@'];

export default {
  name: 'App',
  components: {
    TBreadcrumbs,
  },
  data() {
    return {
      custom: true,
      seps: SEPS,
      sep: SEPS[0],
      items: ['Guide', 'Introduction', 'Getting started'],
    };
  },
  methods: {
    log(message) {
      console.log(message);
    },
  },
};
</script>

<style scoped>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  font-size: 14px;
}

h2 {
  font-size: 16px;
}

small {
  font-weight: 400;
  color: #999;
}
</style>
