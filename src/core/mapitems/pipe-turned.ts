import { Direction } from "../physics";
import { MapItemNames } from "../enums";
import { IRotatable, ICollisible } from "../interfaces";
import { PolygonCollider, Vector2D, Angle, Line } from "../physics";
import { MassPoint, Physical } from "../physics/kinematics";
import { Ball } from "./ball";
import { MapItem } from "./map-item";

export class PipeTurnedCollider extends PolygonCollider {
  public get center(): Vector2D {
    return this.position.add(
      MapItem.vertical
        .clone()
        .add(MapItem.horizontal)
        .mult(0.5 * this.zoom)
    );
  }

  /**
   * 转弯点
   */
  public get centre(): Vector2D {
    return this._vertexes[2].clone();
  }
  public get entryAxis1(): Vector2D {
    return this._edges[1].normalVector;
  }
  public get entryAxis2(): Vector2D {
    return this._edges[2].normalVector;
  }
  constructor(position: Vector2D) {
    super(
      [
        position.clone(),
        position.clone().add(MapItem.vertical),
        position
          .clone()
          .add(MapItem.horizontal)
          .add(MapItem.vertical),
        position.clone().add(MapItem.horizontal)
      ],
      position
    );
  }
}

export class PipeTurnedMapItem extends MapItem implements IRotatable {
  public get rotation(): Direction {
    return this.collider.rotation;
  }
  public set rotation(rotation: Direction) {
    this.collider.rotation = rotation;
  }
  rotate(center: Vector2D, angle: Angle): IRotatable {
    this.collider.rotate(center, angle);
    return this;
  }
  public get name(): MapItemNames {
    return PipeTurnedMapItem.Name;
  }
  get imgURL(): string {
    return PipeTurnedMapItem.imageUrl;
  }

  public static readonly Name: MapItemNames = "pipe-turned";
  public static readonly imageUrl: string = "img/item/pipe_turned.png";
  protected collider!: PipeTurnedCollider;
  constructor(x: number, y: number) {
    super(new PipeTurnedCollider(new Vector2D(x, y)));
  }

  public crashHandle(crashable: ICollisible): void {
    // 断言已经碰撞
    if (crashable instanceof Ball) {
      const massPoint: MassPoint = crashable.massPoint;
      const v: Vector2D = massPoint.v;
      let crashLine: Line | null = null;
      const ballPos: Vector2D = crashable.massPoint.p.add(
        massPoint.v.mult(-Physical.tick)
      );
      // 获取碰撞边
      const edges: Line[] = this.collider.edges;
      for (const edge of edges) {
        const v1: Vector2D = Vector2D.difference(ballPos, edge.p1);
        const v2: Vector2D = Vector2D.difference(ballPos, edge.p2);
        if (crashLine === null) {
          const axis: Vector2D = edge.normalVector;
          if (v1.dot(axis) >= 0 && v2.dot(axis) >= 0) {
            crashLine = edge;
            break;
          }
        }
      }
      if (crashLine !== null) {
        // 管道外部
        // 通过向量终点比较，判断碰撞线是否为可碰撞的侧边
        if (
          crashLine.p1.equals(edges[0].p1) ||
          crashLine.p1.equals(edges[3].p1)
        ) {
          // 侧边
          // console.log("side!");
          this.collider.crashHandle(crashable);
        } else {
          // 管道口
          const axis: Vector2D = crashLine.normalVector;

          if (v.dot(axis) < 0) {
            // 准备进入管道
            // console.log("entry!");
            const lineCenter: Vector2D = Vector2D.center([
              crashLine.p1,
              crashLine.p2
            ]);
            const ballCenter: Vector2D = crashable.center;
            if (
              Math.abs(
                Vector2D.difference(ballCenter, lineCenter).projection(
                  crashLine.directionVector
                )
              ) < 10
            ) {
              // console.log("move!");
              crashable.pipeID = this.id;
              massPoint.setVelocity(v.component(axis));
              massPoint.setAcceleration("pipe", Physical.pipeAcc);
              const change: Vector2D = Vector2D.difference(
                lineCenter,
                ballCenter
              ).component(crashLine.directionVector);
              crashable.translate(crashable.position.add(change));
            } else {
              // console.log("bounce!");
              this.collider.crashHandle(crashable);
            }
          } else {
            // 出管道
            // console.log("exit!");
            if (crashable.pipeID === this.id) {
              crashable.pipeID = -1;
              massPoint.setAcceleration("pipe", Vector2D.ZERO);
              massPoint.setAcceleration("centripetal", Vector2D.ZERO);
            }
          }
        }
      } else {
        // 管道内
        // console.log("in!");
        if (Vector2D.difference(crashable.center, this.center).radius < 5) {
          if (this.collider.entryAxis1.dot(v) < 0) {
            // 从entryAxis1进入
            crashable.translate(this.position);
            massPoint.setVelocity(
              v.clone().directionRotate(this.collider.entryAxis2)
            );
          } else if (this.collider.entryAxis2.dot(v) < 0) {
            // 从entryAxis2进入
            crashable.translate(this.position);
            massPoint.setVelocity(
              v.clone().directionRotate(this.collider.entryAxis1)
            );
          }
        }
        // const a:Vector2D = Physical.centripetalAcceleration(crashable.massPoint, MapItem.gridScale / 2, edges[1].p2);
        // console.log(a);
        // crashable.massPoint.setAcceleration("centripetal", a);
        // todo
      }
    }
  }
}
