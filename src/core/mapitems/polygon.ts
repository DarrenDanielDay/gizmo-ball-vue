import { Direction } from "../physics";
import { MapItem } from "./map-item";
import { IRotatable, IZoomable } from "../interfaces";
import { PolygonCollider, Vector2D, Angle } from "../physics";

export abstract class PolygonMapItem extends MapItem
  implements IRotatable, IZoomable {
  constructor(protected collider: PolygonCollider) {
    super(collider);
  }
  get zoom(): number {
    return this.collider.zoom;
  }
  zoomTo(zoomCenter: Vector2D, zoom: number): IZoomable {
    this.collider.zoomTo(zoomCenter, zoom);
    return this;
  }
  get rotation(): Direction {
    return this.collider.rotation;
  }
  set rotation(rotation: Direction) {
    this.collider.rotation = rotation;
  }
  rotate(center: Vector2D, angle: Angle): IRotatable {
    this.collider.rotate(center, angle);
    return this;
  }
  public get center(): Vector2D {
    return this.collider.center;
  }
}
