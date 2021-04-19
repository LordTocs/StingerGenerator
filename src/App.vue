<template>
  <v-app>
    <v-app-bar app color="#161616" dark>
      <div class="d-flex align-center">
        <img src="/tocs-slime.png" style="width: 50px" />
        LordTocs
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <stinger-maker />
    </v-main>

    <v-footer height="200"> </v-footer>
  </v-app>
</template>

<script>
import StingerMaker from "./components/StingerMaker";

export default {
  name: "App",

  components: {
    StingerMaker,
  },

  data: () => ({
    //
  }),
};
</script>
