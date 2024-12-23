import List from "list.js";

export interface State {
  allowed: string[];
  centre: DataCenterWorldType;
  list: List | null,
  lang: string | null,
}

export interface ListItemValues {
  centre: WorldType;
}

export type PartyFinderCategory =
  | "unknown";

export type WorldType =
  | "All"
  | "Aether"
  | "Crystal"
  | "Dynamis"
  | "Primal"
  | "Chaos"
  | "Light"
  | "Elemental"
  | "Gaia"
  | "Mana"
  | "Meteor"
  | "Materia";

export type DataCenterType =
  | "All"
  | "NA"
  | "EU"
  | "JA"
  | "OC"

export type DataCenterWorldType =
  | "All"
  | WorldType
  | DataCenterType;

export type DataCenters = {
  /* eslint-disable-next-line no-unused-vars */
  [key in DataCenterWorldType]: number;
};
