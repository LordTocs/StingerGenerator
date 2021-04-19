<template>
  <v-container>
    <h1>OBS Stinger Maker</h1>
    <p>
      This tool can generate stinger transitions for OBS in the browser. You can
      change colors, the speed, the angle, and add your logo. I built this tool
      because most of the existing tutorials for stingers required After Effects
      and lots of time. If you have questions feel free to pop into my stream
      and ask, or if you found the tool useful throw me a buck or two on Ko-Fi.
    </p>
    <v-row dense>
      <v-col class="text-left">
        <span style="margin-right: 5px">
          <vue-kofi uid="lordtocs" />
        </span>
        <span style="margin-right: 5px">
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
        </span>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card v-sticky class="preview-card">
          <v-card-title> Preview </v-card-title>
          <v-card-text>
            <v-slider
              :min="0"
              :max="stinger.transitionTime"
              :value="time"
              :step="0.01"
              @input="(v) => changeTime(v)"
              class="no-transition"
            />
            <div class="preview-container">
              <div class="inner">
                <stinger-canvas :stinger="stinger" :time="time" />
              </div>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="togglePlay">
              <v-icon>
                {{ playing ? "mdi-stop" : "mdi-play" }}
              </v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title> Stinger Options </v-card-title>
          <v-card-text>
            <v-text-field
              label="width"
              :value="stinger.width"
              @input="(v) => (stinger.width = Number(v))"
            />
            <v-text-field
              label="height"
              :value="stinger.height"
              @input="(v) => (stinger.height = Number(v))"
            />
            <v-row>
              <v-slider
                :min="0"
                :max="10"
                :step="0.1"
                :value="stinger.transitionTime"
                @input="(v) => (stinger.transitionTime = v)"
                label="Time "
              />
              <v-text-field
                label="Time (in Seconds)"
                :value="stinger.transitionTime"
                @input="(v) => (stinger.transitionTime = Number(v))"
                class="shrink"
              />
            </v-row>
            <v-row>
              <v-slider
                :min="0"
                :max="180"
                :step="1"
                :value="rad2deg(stinger.angle)"
                @input="(v) => (stinger.angle = deg2rad(v))"
                label="Angle"
              />
              <v-text-field
                label="Angle"
                :value="rad2deg(stinger.angle)"
                @input="(v) => (stinger.angle = deg2rad(Number(v)))"
                class="shrink"
              />
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title> Panels </v-card-title>
          <v-card-text>
            <v-row v-for="(panel, i) in stinger.panels" :key="i">
              <v-col>
                <v-card>
                  <v-card-title> Panel </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="4">
                        <v-color-picker
                          :value="panel.color"
                          @input="(v) => (panel.color = v)"
                          mode="hexa"
                        />
                      </v-col>
                      <v-col>
                        <v-row>
                          <v-slider
                            label="width"
                            type="number"
                            :value="panel.width"
                            @input="(v) => (panel.width = v)"
                            :min="1"
                            :max="10000"
                          />
                          <v-text-field
                            label="Width (Pixels)"
                            :value="panel.width"
                            @input="(v) => (panel.width = Number(v))"
                            class="shrink"
                          />
                        </v-row>
                        <v-file-input
                          label="Panel Image"
                          filled
                          prepend-icon="mdi-camera"
                          :value="panel.imageFile"
                          @change="(v) => changeImage(i, v)"
                        />
                        <v-row v-if="panel.imageFile">
                          <v-slider
                            label="Image Start Scale"
                            :min="0.1"
                            :max="5"
                            :step="0.1"
                            :value="panel.imageStartScale"
                            @input="(v) => (panel.imageStartScale = v)"
                          />
                          <v-text-field
                            label="Image Start Scale (Multiplier)"
                            type="number"
                            :value="panel.imageStartScale"
                            @input="(v) => (panel.imageStartScale = Number(v))"
                            class="shrink"
                          />
                        </v-row>
                        <v-row v-if="panel.imageFile">
                          <v-slider
                            label="Image End Scale"
                            :min="0.1"
                            :max="5"
                            :step="0.1"
                            :value="panel.imageEndScale"
                            @input="(v) => (panel.imageEndScale = v)"
                          />
                          <v-text-field
                            label="Image End Scale (Multiplier)"
                            type="number"
                            :value="panel.imageEndScale"
                            @input="(v) => (panel.imageEndScale = Number(v))"
                            class="shrink"
                          />
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn @click="removePanel(i)">
                      <v-icon> mdi-minus </v-icon>
                    </v-btn>
                    <v-btn @click="movePanelUp(i)">
                      <v-icon> mdi-arrow-up </v-icon>
                    </v-btn>
                    <v-btn @click="movePanelDown(i)">
                      <v-icon> mdi-arrow-down </v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="addNewPanel"> <v-icon> mdi-plus </v-icon> </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <stinger-exporter :stinger="stinger" />
      </v-col>
    </v-row>
    <v-overlay :value="exporting">
      <h1>Exporting</h1>
      <v-progress-circular
        indeterminate
        color="primary"
        :size="100"
        :width="15"
      />
    </v-overlay>
  </v-container>
</template>

<script>
import StingerExporter from "./stinger/StingerExporter.vue";
import StingerCanvas from "./stinger/StingerCanvas.vue";
export default {
  components: { StingerCanvas, StingerExporter },
  data() {
    return {
      stinger: {
        width: 1920,
        height: 1080,
        angle: Math.PI / 5,
        transitionTime: 1.5,
        panels: [
          {
            color: "#01DADE",
            width: 3000,
            imageStartScale: 1.0,
            imageEndScale: 1.0,
          },
          {
            color: "#FC00FF",
            width: 2100,
            imageStartScale: 1.0,
            imageEndScale: 1.0,
          },
        ],
      },
      time: 0,
      playing: false,
      start: null,
      exporting: false,
    };
  },
  methods: {
    deg2rad(deg) {
      return (deg / 180) * Math.PI;
    },
    rad2deg(rad) {
      return (rad / Math.PI) * 180;
    },
    play() {
      if (this.playing) return;

      this.playing = true;

      const draw = (timestamp) => {
        if (!this.start) this.start = timestamp;

        const elapsed = (timestamp - this.start) / 1000;

        const timeDiv = elapsed / this.stinger.transitionTime;
        this.time =
          (timeDiv - Math.trunc(timeDiv)) * this.stinger.transitionTime;
        if (this.playing) {
          window.requestAnimationFrame(draw);
        } else {
          this.start = null;
        }
      };
      window.requestAnimationFrame(draw);
    },
    stop() {
      this.playing = false;
    },
    togglePlay() {
      if (this.playing) {
        this.stop();
      } else {
        this.play();
      }
    },
    changeTime(newTime) {
      if (!this.playing) {
        this.time = newTime;
      }
    },
    addNewPanel() {
      this.stinger.panels.push({
        color: "#ff0000",
        width: 1000,
        imageStartScale: 1.0,
        imageEndScale: 1.0,
      });
    },
    movePanelUp(index) {
      const panels = this.stinger.panels.splice(index, 1);
      this.stinger.panels.splice(index - 1, 0, ...panels);
    },
    movePanelDown(index) {
      const panels = this.stinger.panels.splice(index, 1);
      this.stinger.panels.splice(index + 1, 0, ...panels);
    },
    removePanel(index) {
      this.stinger.panels.splice(index, 1);
    },
    changeImage(index, file) {
      if (file) {
        this.stinger.panels[index].imageFile = file;
        const img = new Image();
        img.src = URL.createObjectURL(file);
        this.stinger.panels[index].image = img;
        console.log(img);
      } else {
        this.stinger.panels[index].imageFile = null;
        this.stinger.panels[index].image = null;
      }
    },
  },
  mounted() {
    this.play();
  },
};
</script>

<style>
.preview-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.preview-container > .inner {
  height: 500px;
  position: relative;
}

.top-sticky .preview-container > .inner {
  height: 100px;
  position: relative;
}

.top-sticky.preview-card {
  width: 200px !important;
  left: unset !important;
  right: 10px !important;
  top: 10px !important;
}

.no-transition .v-slider__thumb {
  transition: none !important;
}

.no-transition .v-slider__thumb-container {
  transition: none !important;
}

.no-transition .v-slider__track-background {
  transition: none !important;
}
.no-transition .v-slider__track-fill {
  transition: none !important;
}
</style>