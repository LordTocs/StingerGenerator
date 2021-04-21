<template>
  <v-app>
    <v-app-bar app color="#161616" dark>
      <div class="d-flex align-center">
        <img src="stingers/tocs-slime.png" style="width: 50px" />
        LordTocs
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main sticky-container>
      <stinger-maker />
    </v-main>

    <v-footer height="200">
      <div style="width: 100%">
        <p class="text-center">
          Also check out
          <a href="https://www.github.com/LordTocs/CastMate"> CastMate </a>
        </p>
        <p class="text-center">© Scott Resnick 2021</p>
      </div>
    </v-footer>
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
