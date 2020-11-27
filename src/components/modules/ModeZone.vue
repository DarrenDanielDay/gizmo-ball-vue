<template>
  <div class="mode-zone">
    <table class="mode-table" width="100%">
      <caption class="caption">
        模式栏
      </caption>
      <tr>
        <td class="mode-col" align="right">
          <img
            v-if="currentMode === 'LAYOUT'"
            src="img/mode/arrow.png"
            height="20"
          />
        </td>
        <td align="left" colspan="2">
          <button @click="changeToLayoutMode" class="layout-button">
            布局模式
          </button>
        </td>
      </tr>
      <tr>
        <td align="right">
          <img
            v-if="currentMode === 'PLAY'"
            src="img/mode/arrow.png"
            height="20"
          />
        </td>
        <td align="left">
          <button @click="changeToPlayMode" class="play-button">
            游玩模式
          </button>
        </td>
        <td>
          <img
            @click="changeState"
            v-if="currentMode === 'PLAY'"
            :src="controllImg"
            height="30"
            class="controll-img"
            title="咋瓦鲁多"
          />
        </td>
      </tr>
    </table>

    <span>GIZMO BALL</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import store from "@/store/index";
import Controller from "@/core/controller/Controller";
@Component
export default class ModeZone extends Vue {
  get currentMode() {
    return store.state.module1.currentMode;
  }

  get controllImg(): string {
    if (store.state.module1.currentState === "PLAYING") {
      return "img/mode/pause.png";
    } else {
      return "img/mode/continue.png";
    }
  }

  private changeState() {
    if (store.state.module1.currentState === "PLAYING") {
      store.commit.changeState("PAUSE");
      Controller.getInstance().pause();
    } else {
      store.commit.changeState("PLAYING");
      Controller.getInstance().continue();
    }
  }

  private changeToLayoutMode() {
    if (this.currentMode === "LAYOUT") return;
    store.commit.changeMode("LAYOUT");
    store.commit.changeState("PAUSE");
    Controller.getInstance().stopPlaying();
  }

  private changeToPlayMode() {
    if (this.currentMode === "PLAY") return;
    store.commit.changeMode("PLAY");
    store.commit.changeState("PLAYING");
    Controller.getInstance().startPlaying();
  }
}
</script>

<style scoped>
.mode-zone {
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}

.mode-col {
  width: 60px;
}
button {
  margin-top: 15px;
  margin-bottom: 15px;
  border-radius: 10px;
  width: 111px;
}
.controll-img {
  margin-right: 30px;
}

span {
  font-family: fantasy;
  font-size: 50px;
  margin-bottom: 10px;
}
</style>
