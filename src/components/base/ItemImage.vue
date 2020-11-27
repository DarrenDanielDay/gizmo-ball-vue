<template>
  <img
    @dragstart="onDragstart($event)"
    @dragend="onDragend()"
    :class="cssClass"
    ref="img"
    :src="item.imgURL"
    :width="`${width}px`"
    :height="`${height}px`"
    :draggable="imageDraggable"
    :style="
      `position: absolute;top:${item.position.y}px;left:${item.position.x}px;z-index:${zindex};transform: rotate(${rotation}deg)`
    "
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { MapItem } from "@/core/mapitems/map-item";
import { Ball } from "@/core/mapitems/ball";
import store from "@/store";
import { Vector2D } from "@/core/physics";
import { Gizmo } from "@/core/constants/gizmo";
import { isRotatable, isZoomable } from "@/core/common";

@Component
export default class ItemImage extends Vue {
  @Prop() private item!: MapItem;
  @Prop() private selected!: boolean;

  $refs!: {
    img: HTMLElement;
  };

  get cssClass(): string {
    return this.selected ? "pick-box" : "";
  }

  get rotation(): number {
    if (isRotatable(this.item)) {
      return this.item.rotation * 90;
    }
    return 0;
  }

  get zindex(): number {
    if (this.item instanceof Ball) {
      return 100;
    } else {
      return 1;
    }
  }

  private readonly defaultSize: number =
    Gizmo.gridLength + Gizmo.gridLineLength;

  get width(): number {
    let base: number = this.defaultSize;
    if (this.item.name === "baffle-alpha" || this.item.name === "baffle-beta") {
      base = base * 2 - 1;
    }
    let result: number = base - 1;
    if (isZoomable(this.item)) {
      result = this.item.zoom * base - 1;
    }
    return result;
  }

  get height(): number {
    let result: number = this.defaultSize - 1;
    if (isZoomable(this.item)) {
      result = this.item.zoom * this.defaultSize - 1;
    }
    return result;
  }

  get imageDraggable(): boolean {
    const m = store.state.module1;
    if (
      m.currentMode == "LAYOUT" &&
      m.toolZoneCurrentItem.typeValue == "select"
    ) {
      return true;
    }
    return false;
  }

  onDragstart(event: DragEvent) {
    store.commit.changeDraggingItemOffset(
      new Vector2D(event.offsetX, event.offsetY)
    );
    store.commit.changeDraggingItem(this.item);
  }

  onDragend() {
    store.commit.changeDraggingItem(null);
  }
}
</script>

<style scoped>
.pick-box {
  border-color: #33ff00;
  border-width: 2px;
  border-style: solid;
}
</style>
