import { MapItemNames } from "../enums";
import { AbsorberMapItem } from "../mapitems/absorber";
import { BaffleAlphaMapItem, BaffleBetaMapItem } from "../mapitems/baffle";
import { Ball } from "../mapitems/ball";
import { BorderMapItem } from "../mapitems/border-map-item";
import { CircleMapItem } from "../mapitems/circle";
import { PipeMapItem } from "../mapitems/pipe";
import { PipeTurnedMapItem } from "../mapitems/pipe-turned";
import { SquareMapItem } from "../mapitems/square";
import { TriangleMapItem } from "../mapitems/triangle";

export type MapItems =
  | typeof AbsorberMapItem
  | typeof BaffleAlphaMapItem
  | typeof BaffleBetaMapItem
  | typeof Ball
  | typeof BorderMapItem
  | typeof CircleMapItem
  | typeof PipeMapItem
  | typeof PipeTurnedMapItem
  | typeof SquareMapItem
  | typeof TriangleMapItem;

const itemMap: Record<MapItemNames, MapItems> = {
  absorber: AbsorberMapItem,
  "baffle-alpha": BaffleAlphaMapItem,
  "baffle-beta": BaffleBetaMapItem,
  ball: Ball,
  border: BorderMapItem,
  circle: CircleMapItem,
  pipe: PipeMapItem,
  "pipe-turned": PipeTurnedMapItem,
  square: SquareMapItem,
  triangle: TriangleMapItem
};

export { itemMap };
