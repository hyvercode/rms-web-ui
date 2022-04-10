<template>
  <!-- ===============================================-->
  <!--    Main Content-->
  <!-- ===============================================-->
  <main class="main" id="top">
    <div id="app" v-cloak>
      <router-view></router-view>
    </div>
  </main>
  <!-- ===============================================-->
  <!--    End of Main Content-->
  <!-- ===============================================-->
</template>
<script>
import "./assets/css/theme.css"
import "./assets/js/theme"
import "./assets/js/bootstrap-navbar";

export default {
  name: "Navbar"
}
</script>