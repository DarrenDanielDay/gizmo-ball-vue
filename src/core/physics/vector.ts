import { Angle } from ".";

export class Vector2D {
  constructor(public x: number, public y: number) {}

  /**
   * 返回自身相等于v的判断
   */
  public equals(v: Vector2D): boolean {
    return Vector2D.equals(this, v);
  }

  /**
   * 返回自身的复制
   */
  public clone(): Vector2D {
    return Vector2D.copy(this);
  }

  /**
   * 自身加上向量v,返回自身
   */
  public add(v: Vector2D): Vector2D {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  /**
   * 重新赋值为v/拷贝v的值,返回自身
   */
  public as(v: Vector2D): Vector2D {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  /**
   * 自乘实数n,返回自身
   */
  public mult(n: number): Vector2D {
    this.x *= n;
    this.y *= n;
    return this;
  }

  /**
   * 自身与v的数量积/点积
   */
  public dot(v: Vector2D): number {
    return Vector2D.dot(this, v);
  }

  /**
   * 自身模长
   */
  get radius(): number {
    return Vector2D.radius(this);
  }

  /**
   * 自身法向量,返回新向量,在向量左侧:法↖原↗
   */
  get normalVector(): Vector2D {
    return Vector2D.normalVector(this);
  }

  /**
   * 与自身同向的单位向量,返回新向量
   */
  get unitVector(): Vector2D {
    return Vector2D.unitization(this);
  }

  /**
   * 计算自身在v上的投影值
   */
  public projection(v: Vector2D): number {
    return Vector2D.projection(this, v);
  }

  /**
   * 自身在轴axis上的分量,返回新向量
   */
  public component(axis: Vector2D): Vector2D {
    return Vector2D.vectorProjection(this, axis);
  }

  /**
   * 自身旋转一个角度angle,返回自身
   */
  public vectorRotate(angle: Angle): Vector2D {
    return this.as(Vector2D.vectorRotate(this, angle));
  }

  /**
   * 自身视作点,让自身并绕中心点center旋转一个角度angle,返回自身
   */
  public pointRotate(center: Vector2D, angle: Angle): Vector2D {
    return this.as(Vector2D.pointRotate(this, center, angle));
  }

  /**
   * 自身旋转到与direction一致的方向，返回自身
   * @param direction 目标方向向量
   */
  public directionRotate(direction: Vector2D): Vector2D {
    return this.as(direction.clone().mult(this.radius / direction.radius));
  }

  /**
   * 自身在axis向量为法线的平面进行反射,返回自身
   * @param axis 反射面法线
   */
  public reflet(axis: Vector2D): Vector2D {
    return this.as(Vector2D.reflect(this, axis));
  }

  /**
   * 向量加法
   */
  public static add(v1: Vector2D, v2: Vector2D): Vector2D {
    return new Vector2D(v1.x + v2.x, v1.y + v2.y);
  }

  /**
   * 向量减法
   */
  public static difference(v1: Vector2D, v2: Vector2D): Vector2D {
    return new Vector2D(v1.x - v2.x, v1.y - v2.y);
  }

  /**
   * 向量取反
   */
  public static negate(v: Vector2D): Vector2D {
    return new Vector2D(-v.x, -v.y);
  }

  /**
   * 向量数乘计算
   */
  public static mult(v: Vector2D, n: number): Vector2D {
    return new Vector2D(v.x * n, v.y * n);
  }

  /**
   * 向量点积计算
   */
  public static dot(v1: Vector2D, v2: Vector2D): number {
    return v1.x * v2.x + v1.y * v2.y;
  }

  /**
   * 向量模长计算
   */
  public static radius(v: Vector2D): number {
    return Math.sqrt(Vector2D.dot(v, v));
  }

  /**
   * 向量单位化
   */
  public static unitization(v: Vector2D): Vector2D {
    if (v.equals(Vector2D.ZERO)) {
      throw new Error("cannot get unitization of zero vector");
    }
    return v.clone().mult(1 / v.radius);
  }

  /**
   * 向量投影计算
   */
  public static projection(v1: Vector2D, v2: Vector2D): number {
    return Vector2D.dot(v1, v2) / v2.radius;
  }

  /**
   * 向量投影分量计算
   */
  public static vectorProjection(v: Vector2D, axis: Vector2D): Vector2D {
    return axis.clone().mult(v.dot(axis) / axis.dot(axis));
  }

  /**
   * 向量夹角计算
   */
  public static angle(v1: Vector2D, v2: Vector2D): number {
    return Math.acos(Vector2D.dot(v1, v2) / (v1.radius * v2.radius));
  }

  /**
   * 拷贝向量
   */
  public static copy(v: Vector2D): Vector2D {
    return new Vector2D(v.x, v.y);
  }

  /**
   * 零向量
   */
  public static get ZERO(): Vector2D {
    return new Vector2D(0, 0);
  }

  /**
   * 向量相等判定
   */
  public static equals(v1: Vector2D, v2: Vector2D): boolean {
    return v1.x === v2.x && v1.y === v2.y;
  }

  /**
   * 法向量计算,在向量左侧:法↖原↗
   */
  public static normalVector(v: Vector2D): Vector2D {
    return new Vector2D(v.y, -v.x);
  }

  /**
   * 向量旋转计算
   */
  public static vectorRotate(v: Vector2D, angle: Angle): Vector2D {
    const a: number = angle.value;
    const cos: number = Math.cos(a),
      sin: number = Math.sin(a);
    switch (angle.special) {
      case "right-angle":
        return new Vector2D(-v.y, v.x);
      case "right-angle-reverse":
        return new Vector2D(v.y, -v.x);
      case "":
        return new Vector2D(v.x * cos - v.y * sin, v.y * cos + v.x * sin);
    }
  }

  /**
   * 点绕点旋转计算
   * @param p 被旋转的点
   * @param center 旋转中心
   * @param angle 旋转角度
   */
  public static pointRotate(
    p: Vector2D,
    center: Vector2D,
    angle: Angle
  ): Vector2D {
    return Vector2D.difference(p, center)
      .vectorRotate(angle)
      .add(center);
  }

  /**
   * 向量反射
   * @param v 入射向量
   * @param axis 法线轴向量
   */
  public static reflect(v: Vector2D, axis: Vector2D): Vector2D {
    return v
      .component(axis)
      .mult(-2)
      .add(v);
  }

  /**
   * 向量求和
   * @param vectors 向量迭代器
   */
  public static sum(vectors: Vector2D[] | Map<any, Vector2D>): Vector2D {
    const sum: Vector2D = Vector2D.ZERO;
    vectors.forEach((vertex: Vector2D): void => {
      sum.add(vertex);
    });
    return sum;
  }

  public static average(vectors: Vector2D[]) {
    if (vectors.length) {
      return Vector2D.sum(vectors).mult(1 / vectors.length);
    }
    return Vector2D.ZERO;
  }

  /**
   * 重心
   * @param polygon 多边形
   */
  public static center(polygon: Vector2D[]): Vector2D {
    return Vector2D.sum(polygon).mult(1 / polygon.length);
  }
}
