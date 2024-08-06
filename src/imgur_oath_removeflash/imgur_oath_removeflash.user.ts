import jQuery from "jquery";

jQuery(($) => {
  let id = -1;
  id = setInterval(() => {
    const flashContent = $("#ZeroClipboardMovie_1").parent();
    if ($(flashContent).length > 0) {
      const parentElement = $("#pin-clipboard");
      $(flashContent).remove();
      $(parentElement).on("click", () => {
        GM_setClipboard($("input[name=\"pin\"").val());
      });
      clearInterval(id);
    }
  });
});
