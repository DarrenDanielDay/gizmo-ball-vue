import { Vector2D } from ".";

export enum Direction {
  Up,
  Right,
  Down,
  Left
}
export class Line {
  /**
   * 直线方向向量
   */
  get directionVector(): Vector2D {
    return Vector2D.difference(this.p1, this.p2);
  }

  /**
   * 直线法向量,在方向向量右侧:原↖法↗
   */
  get normalVector(): Vector2D {
    return this.directionVector.normalVector;
  }
  constructor(public readonly p1: Vector2D, public readonly p2: Vector2D) {
    if (p1.equals(p2)) {
      throw new Error("Points cannot be the same!");
    }
  }

  /**
   * 点到直线距离
   */
  public distance(point: Vector2D): number {
    const v1: Vector2D = Vector2D.difference(point, this.p1);
    const n: Vector2D = this.normalVector;
    return Math.abs(v1.projection(n));
  }

  /**
   * 返回自身复制
   */
  public clone(): Line {
    return new Line(this.p1.clone(), this.p2.clone());
  }
}

export class Angle {
  constructor(
    public readonly special: "" | "right-angle" | "right-angle-reverse",
    public readonly value: number
  ) {}
  public static readonly RIGHT_ANGLE: Angle = new Angle(
    "right-angle",
    Math.PI / 2
  );
  public static readonly RIGHT_ANGLE_REVERSE: Angle = new Angle(
    "right-angle-reverse",
    0 - Math.PI / 2
  );
}
