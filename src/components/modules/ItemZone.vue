<template>
  <div
    class="item-zone"
    :style="'pointer-events: ' + (currentMode == 'LAYOUT' ? 'auto' : 'none')"
  >
    <table class="item-table" width="100%">
      <caption class="caption">
        组件栏
      </caption>
      <tr class="two-item" v-for="(items, rowIndex) in itemss" :key="rowIndex">
        <td v-for="(item, colIndex) in items" :key="colIndex">
          <label class="item">
            <input
              :checked="item.typeValue"
              :id="'items' + (rowIndex * 4 + colIndex)"
              type="radio"
              name="chooseItem"
              :value="item.typeValue"
              v-model="currentItem"
            />
            <img
              @dragstart="onDragstart(item, $event)"
              @dragend="onDragend(item, $event)"
              :src="item.img"
              :draggable="item.typeValue != 'select'"
              :height="length"
              :width="length"
            />
          </label>
        </td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import store from "@/store/index";
import { ViewItem, Gizmo, ItemType } from "@/core/constants/gizmo";
import { itemMap } from "@/core/constants";
import { Vector2D } from "@/core/physics";
@Component
export default class ItemZone extends Vue {
  get currentMode() {
    return store.state.module1.currentMode;
  }

  private length = 48;
  private currentItem: ItemType = "select";

  @Watch("currentItem")
  onCurrentItemChanged(val: ItemType, oldVal: ItemType) {
    store.commit.changeToolZoneCurrentItem(Gizmo.getViewItemByType(val));
  }

  readonly itemss: ViewItem[][] = Gizmo.itemss;

  onDragstart(item: ViewItem, event: DragEvent) {
    store.commit.changeDraggingItemOffset(new Vector2D(0, 0));
    store.commit.changeDraggingItem(item);
  }

  onDragend(item: ViewItem, event: DragEvent) {
    store.commit.changeDraggingItem(null);
  }
}
</script>

<style scoped>
.item-zone {
  height: 100%;
}

.two-item {
  display: flex;
  justify-content: center;
}

.item {
  display: flex;
  align-items: center;
  margin: 5px 10px;
}

img {
  margin-left: 5px;
}
</style>
