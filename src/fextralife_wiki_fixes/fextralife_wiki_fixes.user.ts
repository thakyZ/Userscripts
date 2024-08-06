import jQuery from "jquery";

jQuery(($) => {
  const otherSearchClass = "#sidebar-wrapper";
  let checkedForAds = false;
  let adsHidden = 0;
  const debug = false;

  function getAds() {
    return $(otherSearchClass);
  }

  function hideAd(ad) {
    ad.remove();
    adsHidden += 1;
    if (debug) {
      console.log("Ads hidden: " + adsHidden.toString());
    }
  }

  setInterval(() => {
    if (checkedForAds) {
      return;
    }

    const ads = getAds();

    if (ads.length) {
      Array.from(ads).forEach(hideAd);
      checkedForAds = true;
    }
  }, 500);

  // Window.onhashchange = function() {
  //  [...document.getElementsByTagName(otherSearchClass)].forEach((element, index, array) => {
  //    if (checked_for_ads) {
  //      return;
  //    }
  //
  //    const ads = getAds();
  //
  //    if (ads.length) {
  //      Array.from(ads).forEach(hideAd);
  //      checked_for_ads = true;
  //    }
  //  });
  // }

  $(document).on("scroll", () => Array.from(getAds()).forEach(hideAd));
});
