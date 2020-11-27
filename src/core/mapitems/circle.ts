import { MapItem } from "./map-item";
import { MapItemNames } from "../enums";
import { CircleCollider, Vector2D } from "../physics";
import { PolygonMapItem } from "./polygon";

export class CircleMapItem extends PolygonMapItem {
  public static readonly imageURL: string = "img/item/circle.png";
  public static readonly Name: MapItemNames = "circle";
  get name(): MapItemNames {
    return CircleMapItem.Name;
  }
  get imgURL(): string {
    return CircleMapItem.imageURL;
  }
  constructor(x: number, y: number) {
    super(new CircleCollider(new Vector2D(x, y), MapItem.gridScale / 2));
  }
}
