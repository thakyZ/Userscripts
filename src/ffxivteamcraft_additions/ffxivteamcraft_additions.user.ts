import jQuery from "jquery";

jQuery(($) => {
  let id = -1;
  id = setInterval(() => {
    let headerBars = $("body guides-root nz-layout nz-header ul[nz-menu]");
    let headerMenus = $("body guides-root nz-layout nz-header ul[nz-menu] li");

    if (headerBars.length > 0 && headerMenus.length > 0) {
      headerBars = $("body guides-root nz-layout nz-header ul[nz-menu]");
      headerMenus = $("body guides-root nz-layout nz-header ul[nz-menu] li")[2];
      const cloned = $(headerMenus).clone();
      $(headerMenus).after(cloned);
      const title = $(cloned).find("span[title]");
      $(title).find("i").css("vertical-align", "0px");
      $(title).find("i").html("<img width=\"24\" height=\"24\" src=\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9IiNGRkYiIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyLDEwTDgsMTRIMTFWMjBIMTNWMTRIMTZNMTksNEg1QzMuODksNCAzLDQuOSAzLDZWMThBMiwyIDAgMCwwIDUsMjBIOVYxOEg1VjhIMTlWMThIMTVWMjBIMTlBMiwyIDAgMCwwIDIxLDE4VjZBMiwyIDAgMCwwIDE5LDRaIiAvPjwvc3ZnPg==\"/>");
      $(title).find("span").text("APP");
      $(title).on("click", () => {
        window.location.href = "https://ffxivteamcraft.com";
      });
      clearInterval(id);
    }
  }, 100);
});
