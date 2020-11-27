import { Direction } from "../physics";
import { isRotatable, isZoomable } from "../common";
import { itemMap } from "../constants";
import { MapItemNames } from "../enums";
import { BaffleAlphaMapItem, BaffleBetaMapItem } from "../mapitems/baffle";
import { Ball } from "../mapitems/ball";
import { BorderMapItem } from "../mapitems/border-map-item";
import { MapItem } from "../mapitems/map-item";
import { Vector2D, Angle } from "../physics";
import { Physical } from "../physics/kinematics";

abstract class MapItemJSON {
  abstract name: MapItemNames;
  abstract position: Vector2D;
  abstract zoom?: number;
  abstract rotation?: Direction;
  public static createFromJSON(obj: any): MapItemJSON | null {
    if (
      obj.name &&
      obj.position &&
      obj.position.x !== undefined &&
      obj.position.y !== undefined
    ) {
      return {
        name: obj.name,
        position: new Vector2D(obj.position.x, obj.position.y),
        zoom: obj.zoom,
        rotation: obj.rotation
      };
    } else {
      return null;
    }
  }
}

export class Controller {
  private static controller: Controller;
  public static readonly maxGridCount: number = 20;
  public static readonly maxXY: number =
    Controller.maxGridCount * MapItem.gridScale;
  public static getInstance(): Controller {
    return this.controller ?? (this.controller = new Controller());
  }

  private mapItems: Map<number, MapItem>;
  private savedJSONString: string;
  private balls: Map<number, Ball>;
  private border: BorderMapItem;
  private alphaBaffles: Map<number, BaffleAlphaMapItem>;
  private betaBaffles: Map<number, BaffleBetaMapItem>;
  private constructor() {
    this.mapItems = new Map<number, MapItem>();
    this.balls = new Map<number, Ball>();
    this.border = new BorderMapItem();
    this.mapItems.set(this.border.id, this.border);
    this.alphaBaffles = new Map<number, BaffleAlphaMapItem>();
    this.betaBaffles = new Map<number, BaffleBetaMapItem>();
    this.savedJSONString = this.mapItemsToJSON(this.mapItems);
  }

  public get items(): MapItem[] {
    const mapItem: MapItem[] = [];
    for (const [, item] of this.mapItems) {
      if (!(item instanceof BorderMapItem)) {
        mapItem.push(item);
      }
    }
    return mapItem;
  }

  /**
   * 创建地图元素实例
   * @param name 类型
   * @param x
   * @param y
   * @returns 是否成功
   */
  public createMapItem(
    name: MapItemNames,
    x: number,
    y: number
  ): MapItem | null {
    const mapItem = new itemMap[name](x, y);
    if (this.handleAddItem(mapItem)) {
      this.savedJSONString = this.mapItemsToJSON(this.mapItems);
      return mapItem;
    }
    return null;
  }

  private loadMapItemsFromItems(items: MapItem[]) {
    this.clearAll();
    for (const item of items) {
      if (item instanceof Ball) {
        this.balls.set(item.id, item);
      } else if (item instanceof BaffleAlphaMapItem) {
        this.alphaBaffles.set(item.id, item);
      } else if (item instanceof BaffleBetaMapItem) {
        this.betaBaffles.set(item.id, item);
      }
      this.mapItems.set(item.id, item);
    }
  }

  private loadMapItemsFromJSON(content: string) {
    const items = this.readFromJSON(content);
    if (items != null) {
      this.loadMapItemsFromItems(items);
    } else {
      throw new Error("内部读取错误");
    }
  }

  private readFromJSON(content: string): MapItem[] | null {
    const jsonItems = JSON.parse(content);
    const items: MapItem[] = [];
    if (jsonItems instanceof Array) {
      for (const jsonItem of jsonItems) {
        const item = MapItemJSON.createFromJSON(jsonItem);
        if (item !== null) {
          const mapItem = new itemMap[item.name](
            item.position.x,
            item.position.y
          );
          // 检测是否旋转
          if (isRotatable(mapItem)) {
            if (item.rotation !== undefined) {
              mapItem.rotation = item.rotation;
            } else {
              return null;
            }
          }
          // 检测是否放缩
          if (isZoomable(mapItem)) {
            if (item.zoom !== undefined) {
              mapItem.zoomTo(mapItem.position, item.zoom);
            } else {
              return null;
            }
          }
          items.push(mapItem);
        } else {
          return null;
        }
      }
    }
    // 检测是否发生碰撞
    for (const from of items) {
      for (const to of items) {
        if (from.id !== to.id && from.crashDetect(to)) {
          return null;
        }
      }
    }
    return items;
  }

  private collidesWithOthers(mapItem: MapItem): boolean {
    for (const element of this.mapItems) {
      if (element[0] !== mapItem.id && element[1].crashDetect(mapItem)) {
        return true;
      }
    }
    return false;
  }

  /**
   * 处理元件添加,返回是否成功添加
   * @param mapitem 添加的元件
   */
  public handleAddItem(mapitem: MapItem): boolean {
    for (const i of this.mapItems) {
      if (i[1].crashDetect(mapitem)) {
        return false;
      }
    }
    this.mapItems.set(mapitem.id, mapitem);
    if (mapitem instanceof Ball) {
      this.balls.set(mapitem.id, mapitem);
    } else if (mapitem instanceof BaffleAlphaMapItem) {
      this.alphaBaffles.set(mapitem.id, mapitem);
    } else if (mapitem instanceof BaffleBetaMapItem) {
      this.betaBaffles.set(mapitem.id, mapitem);
    }
    // this.currentFileModified = true;
    return true;
  }

  /**
   * 拖动元件的处理,返回是否成功拖动
   * @param id 元件ID
   * @param newPosition 新位置
   */
  public handleDraggingItem(id: number, newPosition: Vector2D): boolean {
    const mapItem: MapItem | undefined = this.mapItems.get(id);
    if (mapItem !== undefined) {
      const oldPosition: Vector2D = mapItem.position;
      mapItem.translate(newPosition);
      if (this.collidesWithOthers(mapItem)) {
        mapItem.translate(oldPosition);
        return false;
      }
      // this.currentFileModified = true;
      this.savedJSONString = this.mapItemsToJSON(this.mapItems);
      return true;
    }
    return false;
  }

  /**
   * 删除元件的处理,返回是否成功删除
   * @param id 元件ID
   */
  public handleDeleteItem(id: number): boolean {
    this.balls.delete(id);
    this.alphaBaffles.delete(id);
    this.betaBaffles.delete(id);
    const result = this.mapItems.delete(id);
    // if (result) this.currentFileModified = true;
    this.savedJSONString = this.mapItemsToJSON(this.mapItems);
    return result;
  }

  /**
   * 吸收球处理
   * @param id 球ID
   */
  public handleAbsorb(id: number): boolean {
    const ball: MapItem | undefined = this.mapItems.get(id);
    if (ball !== undefined && ball instanceof Ball) {
      this.balls.delete(id);
      this.mapItems.delete(id);
      return true;
    } else {
      return false;
    }
  }

  /**
   * 处理放大操作,返回是否成功放大
   * @param id 元件ID
   */
  public handleZoomIn(id: number): boolean {
    const mapItem: MapItem | undefined = this.mapItems.get(id);
    if (mapItem !== undefined && isZoomable(mapItem)) {
      const zoom: number = mapItem.zoom;
      mapItem.zoomTo(mapItem.position, zoom + 1);
      if (this.collidesWithOthers(mapItem)) {
        mapItem.zoomTo(mapItem.position, zoom);
        return false;
      }
      // this.currentFileModified = true;
      this.savedJSONString = this.mapItemsToJSON(this.mapItems);
      return true;
    }
    return false;
  }

  /**
   * 处理缩小操作,返回是否成功缩小
   * @param id 元件ID
   */
  public handleZoomOut(id: number): boolean {
    const mapItem: MapItem | undefined = this.mapItems.get(id);
    if (mapItem !== undefined && isZoomable(mapItem)) {
      const zoom: number = mapItem.zoom;
      if (zoom <= 1) {
        return false;
      }
      mapItem.zoomTo(mapItem.position, zoom - 1);
      if (this.collidesWithOthers(mapItem)) {
        mapItem.zoomTo(mapItem.position, zoom);
        return false;
      }
      // this.currentFileModified = true;
      this.savedJSONString = this.mapItemsToJSON(this.mapItems);
      return true;
    }
    return false;
  }

  /**
   * 处理旋转操作,返回是否成功旋转
   * @param id 元件ID
   */
  public handleRotate(id: number): boolean {
    const mapItem: MapItem | undefined = this.mapItems.get(id);
    if (mapItem !== undefined && isRotatable(mapItem)) {
      mapItem.rotate(mapItem.center, Angle.RIGHT_ANGLE);
      if (this.collidesWithOthers(mapItem)) {
        mapItem.rotate(mapItem.center, Angle.RIGHT_ANGLE_REVERSE);
        return false;
      }
      // this.currentFileModified = true;
      this.savedJSONString = this.mapItemsToJSON(this.mapItems);
      return true;
    }
    return false;
  }

  private state: "LAYOUT" | "PAUSED" | "PLAYING" = "LAYOUT";

  /**
   * 开始游玩模式
   */
  public startPlaying(): void {
    this.state = "PLAYING";
    for (const kv of this.balls) {
      const ball: Ball = kv[1];
      ball.massPoint.setAcceleration("gravity", Physical.gravity);
      ball.massPoint.setAcceleration("pipe", new Vector2D(0, 0));
      ball.massPoint.setAcceleration("centripetal", new Vector2D(0, 0));
    }
    const timer: number = setInterval(() => {
      switch (this.state) {
        case "PLAYING":
          for (const [, ball] of this.balls) {
            ball.massPoint.tick();
            ball.translate(
              Vector2D.difference(ball.position, ball.center).add(
                ball.massPoint.p
              )
            );
            for (const [, item] of this.mapItems) {
              if (item.id != ball.id) {
                if (item.crashDetect(ball)) {
                  item.crashHandle(ball);
                }
              }
            }
          }
          break;
        case "PAUSED":
          break;
        case "LAYOUT":
          clearInterval(timer);
          break;
        default:
          break;
      }
    }, 1);
  }

  /**
   * 停止游玩
   */
  public stopPlaying(): void {
    // todo
    this.state = "LAYOUT";
    this.mapItems.clear();
    this.mapItems.set(this.border.id, this.border);
    // TODO: 从JSON读取
    this.loadMapItemsFromJSON(this.savedJSONString);
  }

  public pause(): void {
    this.state = "PAUSED";
  }

  public continue(): void {
    this.state = "PLAYING";
  }

  /**
   * 将mapItems转换为JSON格式string
   */
  private mapItemsToJSON(mapItems: Map<number, MapItem>): string {
    const mapItemJSONs: MapItemJSON[] = [];
    for (const [, item] of mapItems) {
      const mapItem: MapItem = item;
      const mapItemJSON: MapItemJSON = {
        name: mapItem.name,
        position: mapItem.position,
        rotation: isRotatable(mapItem) ? mapItem.rotation : undefined,
        zoom: isZoomable(mapItem) ? mapItem.zoom : undefined
      };
      mapItemJSONs.push(mapItemJSON);
    }
    return JSON.stringify(mapItemJSONs);
  }

  private clearAll() {
    this.balls.clear();
    this.alphaBaffles.clear();
    this.betaBaffles.clear();
    this.mapItems.clear();
  }

  public handleBaffleMove(name: MapItemNames, direction: "left" | "right") {
    const movement: Vector2D = Vector2D.ZERO;
    switch (direction) {
      case "left":
        movement.x = -5;
        break;
      case "right":
        movement.x = 5;
        break;
      default:
        break;
    }
    switch (name) {
      case "baffle-alpha":
        for (const [, baffle] of this.alphaBaffles) {
          baffle.move(movement);
          if (this.collidesWithOthers(baffle)) {
            baffle.move(Vector2D.negate(movement));
          }
        }
        break;
      case "baffle-beta":
        for (const [, baffle] of this.betaBaffles) {
          baffle.move(movement);
          if (this.collidesWithOthers(baffle)) {
            baffle.move(Vector2D.negate(movement));
          }
        }
        break;
      default:
        break;
    }
  }
}

export default Controller;
