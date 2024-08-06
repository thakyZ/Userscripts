import jQuery from "jquery";

jQuery(($) => {
  "use strict";

  const otherSearchClasses = [".prime-offers > div:last-child", ".prime-offers__pill"];
  const twitchFrontPageSystem = ".featured-content-carousel__item-container--center video";
  let checkedForClasses = false;
  let classesHidden = 0;
  const debug = false;

  const getClasses = () => {
    const test = [];
    for (const [, searchClass] of Object.entries(otherSearchClasses)) {
      if (searchClass !== null) {
        test.push($(searchClass));
      }
    }

    return test;
  };

  const hideClass = (_class) => {
    _class.style.cssText += "display:none";
    classesHidden += 1;
    if (debug) {
      console.log("Ads hidden: ", classesHidden.toString());
    }
  };

  setInterval(() => {
    if (checkedForClasses) {
      return;
    }

    const classes = getClasses();
    if (classes.length > 0) {
      classes.forEach((obj) => {
        hideClass(obj);
      });
      checkedForClasses = true;
    }
  }, 1000);

  setInterval(() => {
    if (checkedForClasses) {
      checkedForClasses = false;
    }
  }, 5000);

  const pauseMainVideo = function () {
    if (window.location.href.match(/^https?:\/\/(www.)?twitch.tv(\/)?$/)) {
      const video = document.querySelector(twitchFrontPageSystem);
      video.onplay = function () {
        video.pause();
      };
    }
  };

  let id = -1;
  id = setInterval(() => {
    if ($(twitchFrontPageSystem).length > 0) {
      pauseMainVideo();
      clearInterval(id);
    }
  }, 2500);

  const runCommands = () => {
    $(getClasses()).each((_, element) => {
      $(element).each(() => hideClass());
    });
    pauseMainVideo();
  };

  $(window).on("hashchange", () => {
    runCommands();
  });

  $(document).on("scroll", () => {
    runCommands();
  });
});
