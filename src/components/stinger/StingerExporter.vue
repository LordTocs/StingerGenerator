<template>
  <v-card>
    <v-card-title> Export your Stinger </v-card-title>
    <v-card-text>
      <v-dialog
        transition="dialog-bottom-transition"
        max-width="600"
        persistent
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" v-bind="attrs" v-on="on" x-large>
            Export your Stinger
          </v-btn>
        </template>
        <template v-slot:default="dialog">
          <v-card>
            <v-card-title color="primary" dark>
              Export your Stinger
            </v-card-title>
            <v-card-text v-if="!exporting && !blob">
              <p>
                Exporting can take a few minutes, it's also a bit heavy on CPU
                usage. Please be patient.
              </p>
              <v-btn @click="exportStinger"> Start Export </v-btn>
            </v-card-text>
            <v-card-text v-else-if="!blob">
              Working on it... &nbsp;&nbsp;Sometimes the progress bar doesn't update for a bit. Give it a second.
              <v-progress-linear :value="progress * 100" :buffer-value="100" />
            </v-card-text>
            <v-card-text v-else>
              <v-row>
                <v-col>
                  <p>Your Stinger is done!</p>
                  <v-btn
                    :href="getDownloadUrl()"
                    download="stinger.webm"
                    color="primary"
                    x-large
                  >
                    Save!
                  </v-btn>
                </v-col>
                <v-col>
                  <p>If you found this useful consider buying me a coffee.</p>
                  <v-row>
                    <v-col>
                      <vue-kofi uid="lordtocs" />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-btn
                        color="#9146FF"
                        href="https://www.twitch.tv/LordTocs"
                        target="_blank"
                      >
                        <img
                          src="/TwitchGlitchWhite.png"
                          style="width: 20px; margin-right: 5px"
                        />
                        LordTocs
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-actions class="justify-end">
              <v-btn text @click="dialog.value = false" :loading="exporting">
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </v-card-text>
  </v-card>
</template>

<script>
import { stingerToWebM } from "../../utils/webm";
//import { saveAs } from "file-saver";
export default {
  props: {
    stinger: {},
  },
  data() {
    return {
      exporting: false,
      progress: 0,
      error: null,
      blob: null,
    };
  },
  methods: {
    getDownloadUrl() {
      return URL.createObjectURL(this.blob);
    },
    async exportStinger() {
      this.exporting = true;

      try {
        this.blob = await stingerToWebM(this.stinger, {
          frameRate: 10,
          progress: (ratio) => {
            this.progress = ratio.ratio;
            console.log(ratio.ratio);
          },
        });
      } catch (err) {
        this.error = err;
      } finally {
        this.exporting = false;
      }
    },
  },
};
</script>

<style>
</style>