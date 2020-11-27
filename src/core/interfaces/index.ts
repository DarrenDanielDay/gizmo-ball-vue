import { Direction } from "../physics";
import { Vector2D, Angle } from "../physics";
export interface IRotatable {
  /**
   * 旋转偏移量
   */
  rotation: Direction;

  /**
   * 旋转操作
   * @param center 旋转中心
   * @param angle 旋转角
   */
  rotate(center: Vector2D, angle: Angle): IRotatable;
}

export interface ICollisible {
  /**
   * 碰撞检测,返回是否碰撞
   * @param collisible 可碰撞对象
   */
  crashDetect(collisible: ICollisible): boolean;

  /**
   * 碰撞处理函数
   * @param collisible 被碰撞的对象
   */
  crashHandle(collisible: ICollisible): void;
}

export interface IZoomable {
  /**
   * 仿射倍率，必须为正值
   */
  zoom: number;

  /**
   *
   * @param zoomCenter 仿射中心
   * @param zoom 仿射倍率，必须为正
   */
  zoomTo(zoomCenter: Vector2D, zoom: number): IZoomable;
}

export interface ITransmittable {
  /**
   * 校准点
   */
  position: Vector2D;

  /**
   * 所占格点的中心
   */
  center: Vector2D;

  /**
   * 传送
   * @param point 传送目标坐标
   */
  translate(point: Vector2D): ITransmittable;
}
