import Controller from "../controller/Controller";
import { MapItemNames } from "../enums";
import { ICollisible } from "../interfaces";
import { Vector2D } from "../physics";
import { Ball } from "./ball";
import { PolygonMapItem } from "./polygon";
import { SquareCollider } from "./square";

export class AbsorberMapItem extends PolygonMapItem {
  public static readonly imageURL: string = "img/item/absorber.png";
  public static readonly Name: MapItemNames = "absorber";
  get name(): MapItemNames {
    return AbsorberMapItem.Name;
  }
  get imgURL(): string {
    return AbsorberMapItem.imageURL;
  }
  constructor(x: number, y: number) {
    super(new SquareCollider(new Vector2D(x, y)));
  }
  public crashHandle(ball: ICollisible): void {
    if (ball instanceof Ball) {
      Controller.getInstance().handleAbsorb(ball.id);
    }
  }
}
