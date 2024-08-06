import jQuery from "jquery";

jQuery(($) => {
  if (!window.location.href.match(/^https:\/\/(store\.)?steam(powered|community)\.com\//)) {
    return;
  }

  const createOpenButton = () => "<div class=\"open-in-steam\"><a rel=\"noopener\" style=\"\" class=\"btnv6_blue_hoverfade btn_medium\" id=\"open-in-steam_button\"><span><img class=\"ico16\" src=\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9IiM2NkMwRjQiIHZpZXdCb3g9IjMgMyAxOCAxOCI+PHBhdGggZD0iTTEyLDEwTDgsMTRIMTFWMjBIMTNWMTRIMTZNMTksNEg1QzMuODksNCAzLDQuOSAzLDZWMThBMiwyIDAgMCwwIDUsMjBIOVYxOEg1VjhIMTlWMThIMTVWMjBIMTlBMiwyIDAgMCwwIDIxLDE4VjZBMiwyIDAgMCwwIDE5LDRaIiAvPjwvc3ZnPg==\"></span></a></div>";
  GM_addStyle(".open-in-steam #open-in-steam_button span .ico16 {background: none;}.open-in-steam {margin-left: 10px;display: inline-block;vertical-align: 12px;}");
  const steamOpenUrl = "steam://openurl/";
  const globalHeader = $("#global_header .content");
  const openButton = createOpenButton();
  if ($("#global_actions").children().length > 0) {
    $("#global_actions").children().last().after(openButton);
    if ($("#global_actions").children().find(".user_avatar").length === 0) {
      console.log($(openButton).find(".open-in-steam").length);
      $(".open-in-steam").css({ marginTop: "2px" });
    }
  } else {
    $(globalHeader).append(openButton);
  }

  $(".open-in-steam #open-in-steam_button").attr("href", `${steamOpenUrl}${window.location.href}`);
});
