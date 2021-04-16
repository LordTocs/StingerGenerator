<template>
  <canvas
    class="stinger-canvas"
    ref="canvas"
    :width="stinger.width"
    :height="stinger.height"
  />
</template>

<script>
import { drawPanel } from "../../utils/stinger";
export default {
  props: {
    stinger: {},
    time: { type: Number, default: () => 0 },
  },
  data() {
    return {
      start: null,
    };
  },
  methods: {
    redraw() {
      this.ctx.clearRect(0, 0, this.stinger.width, this.stinger.height);
      for (let panel of this.stinger.panels) {
        drawPanel(this.stinger, panel, this.ctx, this.time);
      }
    },
    drawFrame(timestamp) {
      if (!this.start) this.start = timestamp;

      const elapsed = (timestamp - this.start) / 1000;

      const timeDiv = elapsed / this.stinger.transitionTime;
      const time =
        (timeDiv - Math.trunc(timeDiv)) * this.stinger.transitionTime;

      this.redraw(time);
    },
  },
  mounted() {
    this.ctx = this.$refs.canvas.getContext("2d");

    this.redraw();
  },
  watch: {
    time() {
      this.redraw();
    },
    stinger: {
      deep: true,
      handler() {
        this.redraw();
      },
    },
  },
};
</script>

<style>
.stinger-canvas {
  display: block;
  height: 100%;
  width: auto;
  background: repeating-conic-gradient(#fff 0deg 90deg, #eee 0 180deg) 0 0/40px
    40px round;
}
</style>