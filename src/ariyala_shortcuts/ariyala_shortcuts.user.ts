import { jQuery } from "../library/index.js";

jQuery(($) => {
  const jsonConfig = {
    items: [
      {
        icon: "BLU",
        name: "Lvl 60",
        // cSpell:ignore 1DEGU
        url: "1DEGU",
        id: "blu_level_60_melds",
      },
    ],
  };

  GM_addStyle(GM_getResourceText("css"));

  const item: HTMLElement[] = [];

  for (const [index, value] of Object.entries(jsonConfig.items)) {
    if (isNaN(Number(index))) continue;
    item.push($.createElement("items", { "#{{id}}": value.id, "#{{icon}}": value.icon, "#{{url}}": value.url, "#{{name}}": value.name }).value!);
  }

  $("#body").append("<div class=\"tray\" id=\"bookmarks\"></div>");
  for (const [index, value] of Object.entries(item)) {
    if (isNaN(Number(index))) continue;
    $("#bookmarks").append(value);
  }
});
