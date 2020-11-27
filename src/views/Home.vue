<template>
  <div class="home">
    <div class="main test-border">
      <GamePanel></GamePanel>
    </div>
    <div class="right-side test-border">
      <div class="right-top test-border">
        <ItemZone></ItemZone>
      </div>
      <div class="right-middle test-border">
        <ToolZone></ToolZone>
      </div>
      <div class="right-bottom test-border">
        <ModeZone></ModeZone>
      </div>
    </div>
    <div class="instruction">
        <Instruction></Instruction>
    </div>
  </div>
</template>

<script lang="ts">
import GamePanel from "@/components/modules/GamePanel.vue";
import ItemZone from "@/components/modules/ItemZone.vue";
import ToolZone from "@/components/modules/ToolZone.vue";
import ModeZone from "@/components/modules/ModeZone.vue";
import Instruction from "@/components/modules/instruction/Instruction.vue";
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {
    GamePanel,
    ItemZone,
    ToolZone,
    ModeZone,
    Instruction,
  }
})
export default class Home extends Vue {
  @Prop() private msg!: string;
}
</script>

<style scoped>
.test-border {
  border-style: inset;
  border-color: #000;
  border-width: 2px;
}

.home {
  display: flex;
  height: 100%;
}

.main {
  width: 734px;
}

.right-side {
  max-width: 300px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background-color: #fff;
}
.right-top {
  height: 45.5%;
}

.right-middle {
  height: 21.5%;
}

.right-bottom {
  height: 33%;
}
.instruction {
    padding: 0 0 0 10px;
    width: 400px;
    text-align: left;
    flex: none;
}
</style>
