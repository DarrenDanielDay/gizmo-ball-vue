<template>
  <div class="game-panel">
    <div
      ref="game-grid"
      @click="onPanelClick()"
      @drop="onDrop"
      @dragover.prevent="onDragover"
      @dragenter.prevent
      class="game-grid"
      style="background-image: url(img/grid.png)"
    >
      <ItemImage
        v-for="(item, index) in items"
        :key="index"
        :item="item"
        :selected="currentItemId === item.id"
        @click.native.stop="onImgClick(item)"
      >
      </ItemImage>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ItemImage from "@/components/base/ItemImage.vue";
import store from "@/store/index";
import { MapItem } from "@/core/mapitems/map-item";
import Controller from "@/core/controller/Controller";
import { isViewItem } from "@/core/constants/gizmo";
import { Vector2D } from "@/core/physics";
import { Gizmo } from "@/core/constants/gizmo";

@Component({
  components: {
    ItemImage
  }
})
export default class GamePanel extends Vue {
  $refs!: {
    "game-grid": HTMLElement;
  };

  items: MapItem[] = [];

  get currentItemId(): number {
    if (
      store.state.module1.currentMode === "LAYOUT" &&
      store.state.module1.panelCurrentItem
    ) {
      return store.state.module1.panelCurrentItem.id;
    } else {
      return 0;
    }
  }

  private gridX!: number;
  private gridY!: number;

  mounted() {
    const p = this.$refs["game-grid"].getBoundingClientRect();
    this.gridX = p.left;
    this.gridY = p.top;
    setInterval(() => {
      this.items = Controller.getInstance().items;
    }, 100);
  }

  /**
   * 点击空白区域
   */
  onPanelClick() {
    store.commit.changePanelCurrentItem(null);
  }

  /**
   * 点击图片（item）
   */
  onImgClick(item: MapItem) {
    const m = store.state.module1;
    if (
      m.toolZoneCurrentItem.typeValue === "select" &&
      m.currentMode === "LAYOUT"
    ) {
      store.commit.changePanelCurrentItem(item);
    }
  }

  /**
   * 处理从组件栏拖动到网格上的dragover事件
   */
  onDragover(event: DragEvent) {
    const item = store.state.module1.draggingItem;
    if (event.dataTransfer) {
      if (item === null) {
        event.dataTransfer.dropEffect = "none";
      } else if (isViewItem(item)) {
        event.dataTransfer.dropEffect = "copy";
      } else if (item instanceof MapItem) {
        event.dataTransfer.dropEffect = "move";
      }
    }
  }

  /**
   * 处理从组件栏拖动到网格放下后的drop事件
   */
  onDrop(event: DragEvent) {
    // console.log('You dropped something!');
    const item = store.state.module1.draggingItem;
    if (item === null) {
      return;
    }
    const offset = store.state.module1.draggingItemOffset;
    const position = new Vector2D(
      event.clientX - this.gridX - offset.x,
      event.clientY - this.gridY - offset.y
    );
    if (isViewItem(item) && item.typeValue !== "select") {
      this.formatPosition(position, "floor");
      const mapItem = Controller.getInstance().createMapItem(
        item.typeValue,
        position.x,
        position.y
      );
      if (mapItem != null) {
        store.commit.changePanelCurrentItem(mapItem);
      }
    } else if (item instanceof MapItem) {
      this.formatPosition(position, "round");
      Controller.getInstance().handleDraggingItem(item.id, position);
    }
  }

  /**
   * 确定实际所放的位置
   */
  private formatPosition(position: Vector2D, options: "round" | "floor") {
    const cellLength = Gizmo.gridLength + Gizmo.gridLineLength;
    if (options == "round") {
      // 适用于从item zone拖放
      position.x = Math.round(position.x / cellLength) * cellLength;
      position.y = Math.round(position.y / cellLength) * cellLength;
    } else {
      // 适用于从game panel拖放
      position.x = Math.floor(position.x / cellLength) * cellLength;
      position.y = Math.floor(position.y / cellLength) * cellLength;
    }
  }
}
</script>

<style scoped>
.game-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}
.game-grid {
  height: 719px;
  width: 719px;
  border: inset;
  position: relative;
}
</style>
