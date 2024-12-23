import { CssObject, _jQuery as jQuery, _JQuery as JQuery } from "../../library/index.js";

jQuery(($) => {
  "use strict";
  const jsonconfig = {
    items: [
      {
        name: "Highland Exp.",
        url: "/wiki/Highland_Exploration",
        id: "highlandexp"
      },
      {
        name: "Woodland Exp.",
        url: "/wiki/Woodland_Exploration",
        id: "woodlandexp"
      },
      {
        name: "Waterside Exp.",
        url: "/wiki/Waterside_Exploration",
        id: "watersideexp"
      },
      {
        name: "Field Exp.",
        url: "/wiki/Field_Exploration",
        id: "fieldexp"
      }
    ]
  };
  const item: JQuery<HTMLDivElement>[] = jsonconfig.items.map((value) => {
    const tempElement = $<HTMLDivElement>("div");
    $(tempElement).addClass("shortcut");
    $(tempElement).attr("id", `${value.id}`);
    const tempLink = document.createElement("a");
    $(tempLink).attr("href", `${value.url}`);
    $(tempLink).append(`${value.name}`);
    $(tempElement).append(tempLink);
    return tempElement;
  });
  const tray = document.createElement("div");
  $(tray).addClass("shortcuts");
  $(tray).attr("id", "shortcuts");
  $("#mw-head").append(tray);
  for (const value of item) {
    $("#shortcuts").append(value);
  }
  $("head").appendCssBlock(new CssObject({
    "#shortcuts": {
      backgroundColor: "rgba(215 239 242 / 50%)",
      border: "1px solid #a7d7f9",
      width: "fit-content",
      left: "194px",
      position: "absolute",
    },
    ".shortcut": {
      marginRight: "10px",
      height: "fit-content",
      float: "left",
      padding: "2px",
      textAlign: "left",
    },
    "#shortcuts a:visited": {
      color: "#000",
    },
    "#shortcuts a": {
      fontWeight: 700,
      fontSize: "13px",
      fontFamily: "sans-serif",
      color: "rgb(0, 0, 0)",
    },
  }));
});
