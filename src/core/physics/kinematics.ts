import { Vector2D } from ".";

/**
 * `gravity` 重力加速度
 *
 * `pipe` 管道加速度
 *
 * `centripetal` 向心加速度
 */
type AccelerationType = "gravity" | "pipe" | "centripetal";

export class Physical {
  public static get gravity(): Vector2D {
    return new Vector2D(0, 15);
  }
  public static readonly tick: number = 0.025;
  public static readonly pipeAcc: Vector2D = Vector2D.negate(Physical.gravity);

  /**
   * 表面反弹
   * @param massPoint 质点
   * @param axis 反弹面法向量，指向反弹面的外侧
   */
  public static surfaceVelocityReflect(
    massPoint: MassPoint,
    axis: Vector2D
  ): void {
    const v: Vector2D = massPoint.v;
    if (v.dot(axis) < 0) {
      massPoint.move(-Physical.tick);
      massPoint.setVelocity(massPoint.v.reflet(axis));
    }
  }

  /**
   * 两质点完全弹性碰撞
   * @param m1 质点1
   * @param m2 质点2
   */
  public static perfectElasticCollision(m1: MassPoint, m2: MassPoint): void {
    const v1: Vector2D = m1.v,
      v2: Vector2D = m2.v,
      axis: Vector2D = Vector2D.difference(m2.p, m1.p),
      reflectLine: Vector2D = axis.normalVector;
    if (axis.dot(v1) > 0) {
      // 轴向连线分量交换
      const newV1: Vector2D = v2.component(axis).add(v1.component(reflectLine));
      const newV2: Vector2D = v1.component(axis).add(v2.component(reflectLine));
      m1.setVelocity(newV1);
      m2.setVelocity(newV2);
    }
  }

  public static centripetalAcceleration(
    massPoint: MassPoint,
    radius: number,
    center: Vector2D
  ): Vector2D {
    const v: Vector2D = massPoint.v;
    const value: number = v.dot(v) / radius;
    return Vector2D.difference(center, massPoint.p).unitVector.mult(value);
  }
}

export class MassPoint {
  private _p: Vector2D;
  private _v: Vector2D;
  private _a: Vector2D;
  private _accRecord: Map<AccelerationType, Vector2D>;
  constructor() {
    this._a = new Vector2D(0, 0);
    this._v = new Vector2D(0, 0);
    this._p = new Vector2D(0, 0);
    this._accRecord = new Map<AccelerationType, Vector2D>([
      ["gravity", Physical.gravity],
      ["centripetal", new Vector2D(0, 0)],
      ["pipe", new Vector2D(0, 0)]
    ]);
  }
  get p(): Vector2D {
    return Vector2D.copy(this._p);
  }
  get v(): Vector2D {
    return Vector2D.copy(this._v);
  }
  get a(): Vector2D {
    return Vector2D.copy(this._a);
  }

  public tick(): void {
    this.changeVelocity();
    this.move();
  }

  /**
   * 质点传送
   * @param p 目标位置
   */
  public translate(p: Vector2D): MassPoint {
    this._p = p.clone();
    return this;
  }

  /**
   * 匀速移动
   * @param t 极短时间
   */
  public move(t: number = Physical.tick): MassPoint {
    this._p.add(Vector2D.mult(this._v, t));
    return this;
  }

  /**
   * 按时间改变速度
   * @param t 极短的时间
   */
  public changeVelocity(t: number = Physical.tick): MassPoint {
    this._v.add(Vector2D.mult(this._a, t));
    if (this._v.radius >= 200) {
      this._v.mult(200 / this._v.radius);
    }
    return this;
  }

  /**
   * 设置速度
   * @param v 速度
   */
  public setVelocity(v: Vector2D): MassPoint {
    this._v.as(v);
    return this;
  }

  /**
   * 增加速度
   * @param v 速度变化量
   */
  public addVelocity(v: Vector2D): MassPoint {
    this._v.add(v);
    return this;
  }

  // /**
  //  * 增加加速度
  //  * @param a 加速度
  //  */
  // public addAcceleration(a: Vector2D):MassPoint {
  //   this._a.add(a);
  //   return this;
  // }

  /**
   * 设置指定类型的加速度
   * @param accType 加速度类型
   * @param a 加速度值
   */
  public setAcceleration(accType: AccelerationType, a: Vector2D): MassPoint {
    this._accRecord.set(accType, a);
    const v = Vector2D.sum(this._accRecord);
    this._a = v;
    return this;
  }

  // /**
  //  * 设置加速度
  //  * @param a 加速度
  //  */
  // public setAccelerationT(a: Vector2D):MassPoint {
  //   this._a.as(a);
  //   return this;
  // }
}
