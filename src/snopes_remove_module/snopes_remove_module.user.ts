import jQuery from "jquery";

jQuery(($) => {
  const otherSearchClasses = [".tp-modal", ".tp-modal-open", ".tp-banner", ".tp-active"];
  let checkedForClasses = false;
  let classesHidden = 0;
  const debug = false;

  const getClasses = function () {
    const outClasses = [];
    for (const searchClass of otherSearchClasses) {
      if ($(searchClass).length > 0) {
        outClasses.push($(searchClass)[0]);
      }
    }

    return outClasses;
  };

  const hideClass = function (_class) {
    if (_class.tagName === "BODY") {
      otherSearchClasses.forEach(obj => {
        _class.classList.remove(obj.substring(1));
      });
    } else {
      _class.remove();
      classesHidden += 1;
      if (debug) {
        console.log("Ads hidden: ", classesHidden.toString());
      }
    }
  };

  setInterval(() => {
    if (checkedForClasses) {
      return;
    }

    const classes = getClasses();
    if (classes.length > 0) {
      classes.forEach((obj, inx, arr) => {
        if (arr.length > 0) {
          hideClass(obj);
        }
      });
      checkedForClasses = true;
    }
  }, 1000);

  setInterval(() => {
    if (checkedForClasses) {
      checkedForClasses = false;
    }
  }, 5000);

  window.onhashchange = function () {
    [...Array.from(getClasses())].forEach(element => {
      if (element.length) {
        Array.from(element).forEach(hideClass);
      }
    });
  };

  document.addEventListener("scroll", () => Array.from(getClasses()).forEach((obj, _, arr) => {
    if (arr.length > 0) {
      Array.from(obj).forEach(hideClass);
    }
  }));
})();
