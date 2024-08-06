import jQuery from "jquery";

jQuery(($) => {
  const debug = true;

  const stopBubble = event => {
    event.stopPropagation();
    event.preventDefault();
    return false;
  };

  const visualStudio2022 = {
    "ctrl+p": "#new-button",
    "ctrl+s": "#save-button",
    "ctrl+g": "#fork-button",
    "ctrl+f5": "#run-button",
    "ctrl+1": "button#Share",
    "ctrl+2": "button#togetherjs",
    "Shift+tab": "#tidyup-button",
    "ctrl+h": "a[href=\"/GettingStarted/\"]",
    "ctrl+u": "a[href=\"/Search\"]"
  };

  $(window).bind("keydown", event => {
    if (event.originalEvent.repeat) {
      return;
    }

    if (debug) {
      console.log(`KeyCode: ${event.keyCode}\nCtrl: ${event.ctrlKey}\nShift: ${event.shiftKey}\nAlt: ${event.altKey}\nRepeat: ${event.originalEvent.repeat}`);
      console.log(GM_info);
      console.log(event);
    }
  });

  const addKey = (key, value) => {
    $("*").bind("keydown", key, event => {
      if ($(value).prop("tagName") === "A") {
        console.log($(value));
        $(value)[0].click();
      } else {
        $(value).click();
      }

      return stopBubble(event);
    });
  };

  const addKeys = map => {
    for (const [key, value] of Object.entries(map)) {
      addKey(key, value);
    }
  };

  addKeys(visualStudio2022);
});
