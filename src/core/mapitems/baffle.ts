import { MapItemNames } from "../enums";
import { PolygonCollider, Vector2D } from "../physics";
import { MapItem } from "./map-item";

export class BaffleCollider extends PolygonCollider {
  constructor(position: Vector2D) {
    const vertical: Vector2D = MapItem.vertical.clone().mult(0.25);
    const horizontal: Vector2D = MapItem.horizontal.clone().mult(2);
    super(
      [
        position.clone(),
        position.clone().add(vertical),
        position
          .clone()
          .add(horizontal)
          .add(vertical),
        position.clone().add(horizontal)
      ],
      position
    );
  }
}

export abstract class BaffleMapItem extends MapItem {
  get imgURL(): string {
    return BaffleMapItem.imageURL;
  }

  public static readonly imageURL: string = "img/item/baffle.png";

  constructor(x: number, y: number) {
    super(new BaffleCollider(new Vector2D(x, y)));
  }

  public move(offset: Vector2D): BaffleMapItem {
    this.translate(this.position.add(offset));
    return this;
  }
}

export class BaffleAlphaMapItem extends BaffleMapItem {
  get name(): MapItemNames {
    return BaffleAlphaMapItem.Name;
  }
  public static readonly Name: MapItemNames = "baffle-alpha";
}

export class BaffleBetaMapItem extends BaffleMapItem {
  get name(): MapItemNames {
    return BaffleBetaMapItem.Name;
  }
  public static readonly Name: MapItemNames = "baffle-beta";
}
