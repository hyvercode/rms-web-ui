<template>
  <div class="base-ui">
    <NavBar/>
    <div id="layoutSidenav">
      <div id="layoutSidenav_nav" v-if="nav">
        <SideBar/>
      </div>
      <div id="layoutSidenav_content">
        <main class="mt-4">
          <router-view></router-view>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from "../components/navigation/SideBar";
import NavBar from "../components/navigation/NavBar";

export default {
  name: "Home",
  components: {NavBar, SideBar},
  computed: {
    nav() {
      return this.$store.state.nav.toggle;
    }
  }
}
</script>