/* eslint-disable no-unused-vars, no-var */
import { CommonNotifications } from "./classes.ts";

declare global {
  declare var spinnerCount: number = 0;
  declare interface JQuery {
    // TODO: Figure out argument "fnc" type.
    enterKey<TELement extends Element = HTMLElement>(this: JQuery<TELement>, fnc: (...args: any[]) => unknown): JQuery<TELement>;
  }
  declare function trunc(string: string, length: number): string;
  declare function showError(title: string, err?: string): void;
  declare function showSpinner(): void;
  declare function hideSpinner(clearAll: boolean = false): void;
  declare function removeNotifyQueryParameter(): void;
  declare function removeURLParameter(url: string, parameter: string): string;
  declare function handleQueryNotification(): void;
  declare var commonNotifications: CommonNotifications = {
    modSaved: { text: "Mod/Draft saved successfully." },
    settingsSaved: { text: "Settings saved successfully." },
    modDeleted: { text: "Mod/Draft deleted successfully." },
  };
  declare var notificationQueue: string[] = [];
  declare function showNotification(notification: string): void;
  declare function showNextNotification(): void;
  declare var _LAST_UNIQUE_ID: number = 0;
  declare function getNextUniqueId(): string;
  function createProgressbar(id: string, value: string, message: string): string;
  function updateProgressBar(id: string, value: string, message: string): void;
  function errorProgressBar(id: string, error: string): void;
  function clearProgressBar(id: string): void;
  // TODO: Figure out argument "func" type & the return type.
  function debounce(func: (...args: any[]) => unknown, timeout: number = 500): (...args: any[]) => void;
}
