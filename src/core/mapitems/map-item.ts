import { MapItemNames } from "../enums";
import { ICollisible, ITransmittable } from "../interfaces";
import { Vector2D, Collider } from "../physics";

export abstract class MapItem implements ICollisible, ITransmittable {
  abstract get name(): MapItemNames;
  get center(): Vector2D {
    return this.collider.center;
  }
  translate(point: Vector2D): ITransmittable {
    this.collider.translate(point);
    return this;
  }
  public crashDetect(collisible: ICollisible): boolean {
    if (collisible instanceof MapItem) {
      return this.collider.crashDetect(collisible.collider);
    }
    return this.collider.crashDetect(collisible);
  }
  public crashHandle(collisible: ICollisible): void {
    return this.collider.crashHandle(collisible);
  }

  /**
   * 格点大小，单位为像素
   */
  public static readonly gridScale: number = 36;

  /**
   * 单位格点的垂直正方向向量
   */
  public static readonly vertical: Vector2D = new Vector2D(
    0,
    MapItem.gridScale
  );

  /**
   * 单位格点的水平正方向向量
   */
  public static readonly horizontal: Vector2D = new Vector2D(
    MapItem.gridScale,
    0
  );

  /**
   * 图片素材的URL
   */
  abstract get imgURL(): string;

  protected static currentID = 0;
  public readonly id: number;

  constructor(protected collider: Collider) {
    this.id = ++MapItem.currentID;
    console.log(`MapItem ${this.id} init`);
  }

  public get position(): Vector2D {
    return this.collider.position;
  }
  public set position(position: Vector2D) {
    this.collider.position = position;
  }
}
