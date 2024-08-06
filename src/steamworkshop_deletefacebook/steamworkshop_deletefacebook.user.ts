import jQuery from "jquery";

jQuery(($) => {
  "use strict";

  const otherSearchClass = ".fbc-badge";
  let checkedForFbs = false;
  let fbsHidden = 0;
  const debug = false;

  const getFBs = () => $(otherSearchClass);

  const removeFacebook = (_, fb) => {
    fbsHidden += 1;
    $(fb).remove();
    if (debug) {
      console.log(`FBs hidden: ${fbsHidden}`);
    }
  };

  setInterval(() => {
    if (checkedForFbs) {
      return;
    }

    const fbs = getFBs();

    if (fbs.length) {
      Array.from(fbs).forEach(removeFacebook);
      checkedForFbs = true;
    }
  }, 500);

  $(window).on("hashchange", () => {
    $(otherSearchClass).each(() => {
      if (checkedForFbs) {
        return;
      }

      const fbs = getFBs();

      if ($(fbs).length > 0) {
        $(fbs).each(removeFacebook);
        checkedForFbs = true;
      }
    });
  });

  $(document).on("scroll", () => {
    $(getFBs()).each(removeFacebook);
  });
});
