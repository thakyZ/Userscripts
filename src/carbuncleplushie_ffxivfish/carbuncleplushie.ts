export interface IViewModel {
  settings: string[];
  fishEntries: string[];
  /* eslint-disable-next-line no-unused-vars */
  updateDisplay(arg: null): void;
  /* eslint-disable-next-line no-unused-vars */
  overwriteChecklist(settings: string[]): void;
  /* eslint-disable-next-line no-unused-vars */
  applySettings(settings: string[]): void;
  layout: IViewModelLayout;
}
export interface IEntry {
  /* eslint-disable-next-line no-unused-vars */
  update(entry: Date, force: boolean): void;
}
export interface IViewModelLayout {
  /* eslint-disable-next-line no-unused-vars */
  updatePinnedState(entry: IEntry): void;
  /* eslint-disable-next-line no-unused-vars */
  updateCaughtState(entry: IEntry): void;
}

/* eslint-disable-next-line no-unused-vars */
export type CarbunleIterator = (entries: string[]) => IEntry[];
