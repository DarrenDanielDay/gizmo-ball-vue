import { MapItem } from "./map-item";
import { MapItemNames } from "../enums";
import { PolygonCollider, Vector2D } from "../physics";
import { PolygonMapItem } from "./polygon";

export class TriangleCollider extends PolygonCollider {
  public get center(): Vector2D {
    return this.position.add(
      MapItem.vertical
        .clone()
        .add(MapItem.horizontal)
        .mult(0.5 * this.zoom)
    );
  }
  constructor(position: Vector2D) {
    super(
      [
        position.clone(),
        position.clone().add(MapItem.vertical),
        position
          .clone()
          .add(MapItem.horizontal)
          .add(MapItem.vertical)
      ],
      position
    );
  }
}

export class TriangleMapItem extends PolygonMapItem {
  public get name(): MapItemNames {
    return TriangleMapItem.Name;
  }
  public get center(): Vector2D {
    return this.collider.center;
  }
  get imgURL(): string {
    return TriangleMapItem.imageUrl;
  }
  public static readonly Name: MapItemNames = "triangle";
  public static readonly imageUrl: string = "img/item/triangle.png";
  constructor(x: number, y: number) {
    super(new TriangleCollider(new Vector2D(x, y)));
  }
}
