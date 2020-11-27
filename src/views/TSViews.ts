import Controller from "@/core/controller/Controller";
import { MapItemNames } from "@/core/enums";

class TSViews {
  public static keyMap: Map<string, boolean> = new Map<string, boolean>([
    ["a", false],
    ["d", false],
    ["j", false],
    ["l", false]
  ]);

  /**
   * 绑定按键
   */
  public static bindKey() {
    window.onkeydown = (e: KeyboardEvent) => {
      const k = e.key;
      if (this.keyMap.has(k)) {
        this.keyMap.set(k, true);
      }
    };
    window.onkeyup = (e: KeyboardEvent) => {
      const k = e.key;
      if (this.keyMap.has(k)) {
        this.keyMap.set(k, false);
      }
    };
    const controller = Controller.getInstance();

    setInterval(() => {
      if (this.keyMap.get("a")) {
        controller.handleBaffleMove("baffle-alpha", "left");
      }
      if (this.keyMap.get("d")) {
        controller.handleBaffleMove("baffle-alpha", "right");
      }
      if (this.keyMap.get("l")) {
        controller.handleBaffleMove("baffle-beta", "right");
      }
      if (this.keyMap.get("j")) {
        controller.handleBaffleMove("baffle-beta", "left");
      }
    }, 10);
  }
}

export default TSViews;
