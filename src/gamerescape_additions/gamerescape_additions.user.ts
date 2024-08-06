import jQuery from "jquery";

jQuery(($) => {
  // Pulled from stack overflow: https://stackoverflow.com/a/2771544/1112800
  $.fn.textWidth = () => {
    const htmlOrg = $(this).html();
    const htmlCalc = `<span>${htmlOrg}</span>`;
    $(this).html(htmlCalc);
    const width = $(this).find("span:first").width();
    $(this).html(htmlOrg);
    return width;
  };

  $.fn.onlyText = () => $(this)
    .clone() // Clone the element
    .children() // Select all the children
    .remove() // Remove all the children
    .end() // Again go back to selected element
    .text();

  $.fn.setData = (name, data) => {
    const prevData = $(this).data(name) === undefined ? {} : $(this).data(name);
    if (prevData === undefined) {
      $(this).data(name, {});
    }

    for (const [key, value] of Object.entries(data)) {
      if (Object.hasOwn(data, key) || !Object.hasOwn(data, key)) {
        prevData[key] = value;
      }
    }

    $(this).data(name, prevData);
    return $(this);
  };

  $.fn.addData = (name, data) => {
    const prevData = $(this).data(name) === undefined ? {} : $(this).data(name);
    if (prevData === undefined) {
      $(this).data(name, {});
    }

    for (const [key, value] of Object.entries(data)) {
      if (!Object.hasOwn(data, key)) {
        prevData[key] = value;
      }
    }

    $(this).data(name, prevData);
    return $(this);
  };

  $.fn.removeData = (name, keys) => {
    const prevData = $(this).data(name) === undefined ? {} : $(this).data(name);

    for (const key of keys) {
      if (Object.hasOwn(prevData, key)) {
        prevData.delete(key);
      }
    }

    $(this).data(name, prevData);
    return $(this);
  };

  $.fn.modifyStyle = (name) => {
    const data = $(this).data(name);
    let stringBuilder = "";
    for (const [key, value] in Object.entries(data)) {
      if (Object.hasOwn(data, key)) {
        stringBuilder += `--${key}: ${value}; `;
      }
    }

    $(this).text(`:root { ${stringBuilder}}`);
  };

  GM_addStyle(GM_getResourceText("css"));

  const SettingsSaveName = "GamerEscapeAdditions.Settings";

  const config = new MonkeyConfig({
    title: "Configure",
    storageKey: SettingsSaveName,
    menuCommand: true,
    openWin: true,
    params: {
      darkByDefault: {
        type: "checkbox",
        default: false
      },
      hideComments: {
        type: "checkbox",
        default: false
      },
    },
  });

  let disqus = $("#disqus_thread");
  const hideButton = () => "<div id=\"hide-disqus_thead\"><button id=\"hide-disqus_thread-button\"><div id=\"hide-disqus_thread-button-icon\" class=\"fold-icon\"></div></button></div>";

  const marked = ["#d7d8db", "#000", "#ebecf0", "#f9f9f9", "#fffae1"]; // NOSONAR
  const categoryLinks = $("#catlinks");
  const nbnStylesAdditions = $("<style id=\"nbnStylesAdditions\"></style>");
  $("head").append($(nbnStylesAdditions));

  function callbackFoldButton(mutationList) {
    for (const mutation of mutationList) {
      if (mutation.type === "childList" || mutation.type === "attributes") {
        if ($(mutation.target).hasClass("wiki") && $(mutation.target).hasClass("main")) {
          if (typeof $(mutation.target).children("#hide-disqus_thead").next().attr("srcdoc") !== "undefined") {
            disqus = $($(mutation.target).children("#hide-disqus_thead").next());
            const hideButtonStyleVar = $(mutation.target).children("#hide-disqus_thead").next().height();
            $(mutation.target).children("#hide-disqus_thead").next().attr("style", (_, s) => (s.replace(/min-height: \d+px/gi, "min-height: 1px") || ""));
            const disqusHeight = $(disqus).height();
            $(nbnStylesAdditions).setData("css", { hideButtonStyleVar: `${hideButtonStyleVar}px`, disqusHeight: `${disqusHeight}px` }).modifyStyle("css");
            $("iframe[src*=\"https://disqus.com/embed/comments/\"]").css({ height: "" });
          } else if ($(mutation.target).children("#hide-disqus_thead").next().attr("id") === "disqus_thread") {
            disqus = $($(mutation.target).children("#hide-disqus_thead").next());
            const hideButtonStyleVar = $("iframe[src*=\"https://disqus.com/embed/comments/\"]").height();
            const disqusHeight = $(disqus).height();
            $(nbnStylesAdditions).setData("css", { hideButtonStyleVar: `${hideButtonStyleVar}px`, disqusHeight: `${disqusHeight}px` }).modifyStyle("css");
            $("iframe[src*=\"https://disqus.com/embed/comments/\"]").css({ height: "" });
          }
        }
      }
    }
  }

  function setupFoldButtonMutationObserver() {
    const targetNode = $(".wiki.main")[0];
    const config = { attributes: true, childList: true, subtree: true };

    const observer = new MutationObserver(callbackFoldButton);
    observer.observe(targetNode, config);

    $(document).on("unload", () => {
      observer.disconnect();
    });
  }

  function createFoldButton() {
    if ($(categoryLinks).length > 0) {
      $(categoryLinks).after(hideButton());
      let id = -1;
      // Const height = -1;
      id = setInterval(() => {
        const iframe = $("iframe[src*=\"https://disqus.com/embed/comments/\"]");
        if (iframe.length > 0 && $(disqus).height() > 109 && $("iframe[src*=\"https://disqus.com/embed/comments/\"]").css("height") !== "") {
          $(disqus).attr("data-hide", "false");
          if (config.get("hide_comments")) {
            if ($(disqus).attr("data-hide") !== "true") {
              $(disqus).attr("data-hide", "true");
              $("#hide-disqus_thread-button-icon").addClass("hidden");
            }
          }

          clearInterval(id);
        }
      });

      $("#hide-disqus_thread-button").on("click", () => {
        if (!$(disqus).attr("data-hide")) {
          $(disqus).attr("data-hide", "false");
          $("#hide-disqus_thread-button-icon").addClass("unhidden");
        }

        if ($(disqus).attr("data-hide") === "false") {
          $(disqus).attr("data-hide", "true");
          $("#hide-disqus_thread-button-icon").addClass("hidden");
          $("#hide-disqus_thread-button-icon").removeClass("unhidden");
        } else if ($(disqus).attr("data-hide") === "true") {
          $(disqus).attr("data-hide", "false");
          $("#hide-disqus_thread-button-icon").addClass("unhidden");
          $("#hide-disqus_thread-button-icon").removeClass("hidden");
        }
      });
    }

    setupFoldButtonMutationObserver();
  }

  createFoldButton();
  const isDark = () => Boolean($("body").hasClass("dark"));

  function darkChanges0(_, element) {
    let convert = null;
    if ($(element).parents(".arrquestbox").length > 0) {
      return;
    }

    if ($(element).css("background-color") === "rgb(235, 236, 240)") {
      $(element).css({ "background-color": darkerWhite });
    }

    if ($(element).css("background-color") === "rgb(255, 255, 255)") {
      $(element).css({ "background-color": darkerWhite });
    }

    if ($(element).hasClass("navbox-list") && $(element).css("border-left-color") === "rgb(253, 253, 253)") {
      if ($(element).attr("style").toString().match(/border-left:\s?\d+(\.\d+)?px solid (#[a-zA-Z0-9]{3,6}|rgb\(\d+, \d+, \d+\))/)) {
        convert = $(element).css("border-left").toString().replace(/rgb\(\d+, \d+, \d+\)/, "#000");
        $(element).css({ "border-left": convert });
      }
    }

    if ($(element).hasClass("wikitable") && $(element).css("border-color") === "rgb(170, 170, 170)") {
      if ($(element).attr("style").toString().match(/border:\s?\d+(\.\d+)?px solid (#[a-zA-Z0-9]{3,6}|rgb\(\d+, \d+, \d+\))/)) {
        convert = $(element).css("border").toString().replace(/rgb\(\d+, \d+, \d+\)/, "#000");
        $(element).css({ border: convert });
      }
    }

    if ($(element).is("table") && !$(element).hasClass("wikitable") && $(element).css("background-color") === "rgb(212, 214, 203)") {
      if ($(element).attr("style").toString().match(/Background:\s?(#[a-zA-Z0-9]{3,6}|rgb\(\d+, \d+, \d+\))/)) {
        convert = $(element).css("background").toString().replace(/rgb\(\d+, \d+, \d+\)/, darkerWhite);
        $(element).css({ background: convert });
      }
    }

    if ($(element).is("th")) {
      if ($(element).css("background-color") === "rgb(212, 214, 203)") {
        if ($(element).attr("style").toString().match(/background:\s?(#[a-zA-Z0-9]{3,6}|rgb\(\d+, \d+, \d+\))/)) {
          convert = $(element).css("background").toString().replace(/rgb\(\d+, \d+, \d+\)/, lighterWhite);
          $(element).css({ background: convert });
        }
      } else if ($(element).css("background-color") === "rgb(229, 231, 217)") {
        if ($(element).attr("style").toString().match(/background:\s?(#[a-zA-Z0-9]{3,6}|rgb\(\d+, \d+, \d+\))/)) {
          convert = $(element).css("background").toString().replace(/rgb\(\d+, \d+, \d+\)/, darkerWhite);
          $(element).css({ background: convert });
        }
      }
    }

    if ($(element).css("color") === "rgb(0, 0, 0)") {
      $(element).css({ color: "white" });
    }
  }

  const darkerWhite = "#252526";
  const lighterWhite = "#2F2F30";
  const lighterWhiteHover = "#39393A";
  function darkChanges() {
    marked[0] = lighterWhite;
    marked[1] = "white";
    marked[2] = lighterWhiteHover;
    marked[3] = darkerWhite;
    const tableHeader = $(".wiki.main *[style]");
    $(tableHeader).each((index, element) => {
      darkChanges0(index, element);
      if ($(element).css("border-color") === "rgb(199, 199, 199)") {
        if ($(element).attr("style").toString().match(/border:\s?\d+(\.\d+)?px solid (#[a-zA-Z0-9]{3,6}|rgb\(\d+, \d+, \d+\))/)) {
          const convert = $(element).css("border").toString().replace(/rgb\(\d+, \d+, \d+\)/, "#000");
          $(element).css({ border: convert });
        }
      }

      if ($(element).is("tr")) {
        if ($(element).css("background-color") === "rgb(192, 192, 192)") {
          $(element).css({ background: "#3E3E40" });
        }

        if ($(element).css("background-color") === "rgb(150, 150, 150)") {
          $(element).css({ background: "#252526" });
        }
      }
    });

    /* eslint-disable-next-line no-unused-vars */
    function rgbToHsl(rgb) { // NOSONAR
      // Choose correct separator
      const sep = rgb.indexOf(",") > -1 ? "," : " ";
      // Turn "rgb(r,g,b)" into [r,g,b]
      rgb = rgb.substr(4).split(")")[0].split(sep);
      let r = rgb[0];
      let g = rgb[1];
      let b = rgb[2];
      // Make r, g, and b fractions of 1
      r /= 255;
      g /= 255;
      b /= 255;
      // Find greatest and smallest channel values
      const cMin = Math.min(r, g, b);
      const cMax = Math.max(r, g, b);
      const delta = cMax - cMin;
      let h = 0;
      let s = 0;
      let l = 0;
      // Calculate hue
      // No difference
      if (delta === 0) {
        h = 0; // NOSONAR
        // eslint-disable-next-line brace-style
      }
      // Red is max
      else if (cMax === r) {
        h = ((g - b) / delta) % 6;
      } else if (cMax === g) {
        h = ((b - r) / delta) + 2;
      } else {
        h = ((r - g) / delta) + 4;
      }

      h = Math.round(h * 60);
      // Make negative hues positive behind 360°
      if (h < 0) {
        h += 360;
      }

      // Calculate lightness
      l = (cMax + cMin) / 2;
      // Calculate saturation
      s = delta === 0 ? 0 : delta / (1 - Math.abs((2 * l) - 1));
      // Multiply l and s by 100
      s = Number((s * 100).toFixed(1));
      l = Number((l * 100).toFixed(1));
      return "hsl(" + h + "," + s + "%," + l + "%)";
    }

    $(nbnStylesAdditions).setData("css", { lighterWhite: `${lighterWhite}`, lighterWhiteHover: `${lighterWhiteHover}`, darkerWhite: `${darkerWhite}` }).modifyStyle("css");
  }

  if (isDark()) {
    darkChanges();
  }

  function filterCatListByNumberOfMembers(count) {
    if (/https:\/\/ffxiv\.gamerescape\.com\/(wiki\/Special:Categories|w\/index\.php\?title=Special:Categories).*/gi.test(window.location.href)) {
      // cSpell:ignoreRegExp /(?<=.mw-)spcontent/
      $(".mw-spcontent ul").find("li").each((i, e) => {
        const text = $(e).clone().children().remove().end().text().replaceAll(/.*\(([\d,]+)\smembers?\).*/gi, "$1").replaceAll(/,/gi, "");
        if (parseInt(text, 10) < count) {
          $(e).remove();
        }
      });
    }
  }

  filterCatListByNumberOfMembers(1000);

  function getPageCategory() {
    const categories = $("#catlinks");
    if ($(categories).length === 0) {
      return null;
    }

    const subCategories = $(categories).find("#mw-normal-catlinks > ul > li");
    if ($(subCategories).length > 0) {
      for (const element of $(subCategories)) {
        const categoryElement = $(element);
        const categoryText = $(categoryElement).find("a").text().toLowerCase();
        if (categoryText === "item") {
          return "item";
        }

        if (categoryText === "merchant") {
          return "merchant";
        }

        if (categoryText === "achievement") {
          return "achievement";
        }

        if (categoryText === "action") {
          return "action";
        }

        if (categoryText === "armor") {
          return "armor";
        }

        if (categoryText === "bestiary") {
          return "bestiary";
        }
      }
    }
  }

  function createCopyItemButton() {
    if (getPageCategory() === "item") {
      const itemBoxHeader = $("div.wiki.main table.itembox:first-child > tbody:first-child > tr:first-child > td:first-child table > tbody > tr:first-child > td:last-child");
      const itemBoxHeaderWidth = $(itemBoxHeader).prop("clientWidth");
      const copyButtonContainer = $("<div class=\"copyItemBoxHeaderButton\"><button id=\"copyItemNameButton\" class=\"btn btn-primary\" type=\"button\"><i class=\"fa fa-clipboard\"></i></button></div>");
      if ($(itemBoxHeader).length > 0) {
        if ($(itemBoxHeader).find("div[style=\"height: 0ex;\"]") !== undefined && $(itemBoxHeader).find("div[style=\"height: 0ex;\"]").length > 0) {
          $(copyButtonContainer).insertBefore($(itemBoxHeader).find("div[style=\"height: 0ex;\"]"));
        } else {
          $(copyButtonContainer).appendTo($(itemBoxHeader));
        }

        $(copyButtonContainer).css({ marginLeft: (itemBoxHeaderWidth - $(copyButtonContainer).prop("offsetLeft")) + "px" });

        $(".copyItemBoxHeaderButton #copyItemNameButton").on("click", () => {
          const itemName = $("div.wiki.main table.itembox:first-child > tbody:first-child > tr:first-child > td:first-child > table > tbody > tr:first-child > td:last-child").clone().children().remove().end().text().replace(/\s+$/gi, "");
          if (itemName !== undefined && itemName !== null && itemName !== "") {
            GM_setClipboard(itemName);
          }
        });
      }
    }
  }

  createCopyItemButton();
});
