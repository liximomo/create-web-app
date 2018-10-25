<template>
<nav>
  <ol>
    <template v-for="(item, i) in items">
      <li :key="`item-${i}`">
        <a href="#">{{ item }}</a>
      </li>
      <li
        v-if="i !== items.length - 1"
        :key="`sep-${i}`"
        class="sep"
        aria-hidden="true"
      >
        <slot name="sep" >/</slot>
      </li>
    </template>
  </ol>
</nav>
</template>


<script>
export default {
  name: "r-breadcrumbs",
  props: {
    items: {
      type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>

<style scoped>
nav {
  display: inline-block;
}

a,
a:visited {
  color: #42b983;
  text-decoration: none;
}

ol {
  margin: 0;
  padding: 0;
  align-items: center;
  list-style-type: none;
}

li {
  display: inline-block;
}

li:last-child a {
  color: #2c3e50;
  font-weight: 600;
  cursor: default;
}

.sep {
  margin: 0 0.4em;
  color: #999;
  font-size: 0.7em;
}
</style>
