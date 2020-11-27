import { IRotatable, IZoomable } from "../interfaces";

export function isRotatable(obj: any): obj is IRotatable {
  return obj.rotate !== undefined;
}

export function isZoomable(obj: any): obj is IZoomable {
  return obj.zoomTo !== undefined;
}
