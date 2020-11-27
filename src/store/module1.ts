import { ViewItem, Gizmo } from "@/core/constants/gizmo";
import { MapItem } from "@/core/mapitems/map-item";
import { Vector2D } from "@/core/physics";
import TSViews from "@/views/TSViews";

export interface Module1State {
  useLightTheme: boolean;
  currentMode: "LAYOUT" | "PLAY";
  currentState: "PAUSE" | "PLAYING";
  draggingItem: MapItem | ViewItem | null;
  draggingItemOffset: Vector2D;
  toolZoneCurrentItem: ViewItem;
  panelCurrentItem: MapItem | null;
}

export default {
  state: {
    useLightTheme: true,
    currentMode: "LAYOUT",
    currentState: "PAUSE",
    draggingItem: null,
    draggingItemOffset: new Vector2D(0, 0),
    toolZoneCurrentItem: Gizmo.selectItem,
    panelCurrentItem: null
  } as Module1State,
  mutations: {
    changeTheme(state: Module1State, useLight: boolean) {
      state.useLightTheme = useLight;
      const theme: string = useLight ? "light" : "dark";
      document
        .getElementById("app-skin")
        ?.setAttribute("href", `skin/${theme}/skin.css`);
    },
    changeMode(state: Module1State, currentMode: "LAYOUT" | "PLAY") {
      state.currentMode = currentMode;
    },
    changeState(state: Module1State, currentState: "PAUSE" | "PLAYING") {
      state.currentState = currentState;
    },
    changeDraggingItem(
      state: Module1State,
      draggingItem: MapItem | ViewItem | null
    ) {
      state.draggingItem = draggingItem;
    },
    changeDraggingItemOffset(
      state: Module1State,
      draggingItemOffset: Vector2D
    ) {
      state.draggingItemOffset = draggingItemOffset;
    },
    changeToolZoneCurrentItem(
      state: Module1State,
      toolZoneCurrentItem: ViewItem
    ) {
      state.toolZoneCurrentItem = toolZoneCurrentItem;
      if (toolZoneCurrentItem.typeValue !== "select") {
        state.panelCurrentItem == null;
      }
    },
    changePanelCurrentItem(
      state: Module1State,
      panelCurrentItem: MapItem | null
    ) {
      state.panelCurrentItem = panelCurrentItem;
    }
  },
  actions: {},
  modules: {}
} as const;
