import { _jQuery as jQuery } from "../../library/index.js";
import { IViewModel, CarbunleIterator } from "./carbuncleplushie.js";

declare namespace global {
  /* eslint-disable-next-line no-unused-vars */
  const ViewModel: IViewModel;
  /* eslint-disable-next-line no-unused-vars */
  const _: CarbunleIterator;
}

const SettingsSaveName = "FishTrackingApp.Settings";
const DateSaveName = "FishTrackingApp.Date";

jQuery(() => {
  const getSettings = () => JSON.stringify(global.ViewModel.settings, (_, value) => (value instanceof Set ? [...value] : value));

  function setSettings(settings: string) {
    // Apply the imported settings now.
    const _settings = JSON.parse(settings);
    // Check if the `settings` is a list or object.
    if (Array.isArray(_settings)) {
      // Array means it's just a checklist. Don't overwrite any other settings...
      // NOTE: This will OVERWRITE the checklist! I'm assuming you've tracked the fish elsewhere...
      global.ViewModel.overwriteChecklist(_settings);
    } else {
      // Otherwise, it should be valid settings.
      global.ViewModel.applySettings(_settings);
    }

    // Update the fish entries.
    const earthTime = new Date();

    console.debug("Starting fish entries.");
    for (const entry of global.ViewModel.fishEntries) {
      console.debug(entry);
    }

    for (const entry of global._(global.ViewModel.fishEntries)) {
      entry.update(earthTime, true);
      global.ViewModel.layout.updatePinnedState(entry);
      global.ViewModel.layout.updateCaughtState(entry);
    }

    // Update the display to update the fish table as well.
    global.ViewModel.updateDisplay(null);
    return true;
  }

  const getDate = (): Date => new Date(Date.now());

  const compareDate = (cur: Date, prev: Date) => cur > prev;

  function saveSettings(force: boolean = false): boolean {
    const date = new Date(GM_getValue(DateSaveName));
    const settings = getSettings();
    const settingsPrev = GM_getValue(SettingsSaveName);
    const dateNow = getDate();
    if (force) {
      GM_setValue(SettingsSaveName, settings);
      GM_setValue(DateSaveName, dateNow);
      return false;
    }

    if (compareDate(dateNow, date) && settings !== settingsPrev) {
      GM_setValue(SettingsSaveName, settings);
      GM_setValue(DateSaveName, dateNow);
      return true;
    }

    return false;
  }

  function loadSettings(force: boolean = false): boolean {
    const date = new Date(GM_getValue(DateSaveName));
    const settings: string = GM_getValue(SettingsSaveName);
    if (force) {
      setSettings(settings);
      return true;
    }

    if (!compareDate(getDate(), date) && settings !== getSettings()) {
      setSettings(settings);
      return true;
    }

    return false;
  }

  setInterval(() => {
    saveSettings();
  }, 15000);
  GM_registerMenuCommand("Load Settings", () => {
    loadSettings(true);
  });
  GM_registerMenuCommand("Save Settings", () => {
    saveSettings(true);
  });
});
