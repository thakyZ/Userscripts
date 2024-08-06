/* global jQuery */
this.jQuery = jQuery.noConflict(true);

/* Css
 * .nbn.SocialLinkBtn {
 *   font-size: 12px;
 *   font-weight: 700;
 *   line-height: 16px;
 *   -ms-flex-align: center;
 *   align-items: center;
 *   background-color: var(--newRedditTheme-flair);
 *   border-radius: 9999px;
 *   color: var(--newRedditTheme-bodyText);
 *   cursor: pointer;
 *   display: -ms-flexbox;
 *   display: flex;
 *   height: 20px;
 *   margin-right: 8px;
 *   padding: 10px 12px;
 *   white-space: nowrap;
 * }
 * .nbn.SocialLinkBtn .nbn.SocialLink {
 *   width: 100%;
 *   height: 100%;
 *   display: -ms-flexbox;
 *   display: flex;
 *   padding: 10px 0;
 * }
 * .nbn.SocialLinkBtn .nbn.SocialIcon {
 *   margin-right: 8px;
 * }
 */

this.jQuery(($) => {
  const createBtn = (parent, opts) => {
    $(parent).attr("class", "nbn SocialLinkBtn");
    const btn = document.createElement("a");
    $(btn).attr("class", "nbn SocialLink");
    $(btn).attr("target", "_blank");
    $(btn).attr("rel", "noopener noreferrer");
    $(btn).attr("href", opts.href);
    $(btn).append(`<img class="nbn SocialIcon" src="https://www.google.com/s2/favicons?domain=${opts.domain}">${opts.text}`);
    $(parent).append(btn);
    return btn;
  };

  let removeWatchers = [];
  function watchForRemoval(watchElem, parentElem) {
    function callback(mutationList) {
      let wasRemoved = false;
      for (const mutant of mutationList) {
        if (!wasRemoved) {
          for (const removed of mutant.removedNodes) {
            wasRemoved = wasRemoved || removed === watchElem;
          }
        }
      }

      if (wasRemoved) {
        parentElem.append(watchElem);
      }
    }

    const watcher = new MutationObserver(callback);
    watcher.observe(parentElem, { childList: true });
    removeWatchers.push(watcher);
  }

  function clearRemoveWatchers() {
    removeWatchers.forEach((obs) => obs.disconnect());
    removeWatchers = [];
  }

  function insertCss() {
    if ($("#nbnCSS").length > 0) {
      return;
    }

    const css = $("<link id=\"nbnCSS\" rel=\"stylesheet\" href=\"data:text/css;base64,Lm5ibi5Tb2NpYWxMaW5rQnRuIHtmb250LXNpemU6IDEycHg7Zm9udC13ZWlnaHQ6IDcwMDtsaW5lLWhlaWdodDogMTZweDstbXMtZmxle"
                + "C1hbGlnbjogY2VudGVyO2FsaWduLWl0ZW1zOiBjZW50ZXI7YmFja2dyb3VuZC1jb2xvcjogdmFyKC0tbmV3UmVkZGl0VGhlbWUtZmxhaXIpO2JvcmRlci1yYWRpdXM6IDk5OTlweDtjb2xvcjogdmFyKC0tbmV3UmVkZGl0VGhlb"
                + "WUtYm9keVRleHQpO2N1cnNvcjogcG9pbnRlcjtkaXNwbGF5OiAtbXMtZmxleGJveDtkaXNwbGF5OiBmbGV4O2hlaWdodDogMjBweDttYXJnaW4tcmlnaHQ6IDhweDtwYWRkaW5nOiAxMHB4IDEycHg7d2hpdGUtc3BhY2U6IG5vd"
                + "3JhcDt9Lm5ibi5Tb2NpYWxMaW5rQnRuIC5uYm4uU29jaWFsTGluayB7d2lkdGg6IDEwMCU7aGVpZ2h0OiAxMDAlO2Rpc3BsYXk6IC1tcy1mbGV4Ym94O2Rpc3BsYXk6IGZsZXg7cGFkZGluZzogMTBweCAwO30ubmJuLlNvY2lhb"
                + "ExpbmtCdG4gLm5ibi5Tb2NpYWxJY29uIHttYXJnaW4tcmlnaHQ6IDhweDt9\">");
    watchForRemoval(css, $("head")[0]);
    $("head").append($(css));
  }

  const cache = {};

  function generateLinks() {
    const pageUrl = window.location.href;
    const usrUrl = pageUrl.replace(/^https?:\/\/(www.)?reddit.com\/(user|u)\//, "");
    const userProfileLnk = document.querySelector(`.ListingLayout-outerContainer > div:last-child > div:last-child > div:last-child > div > div:first-child > div > a[href="/user/${usrUrl}/"] + button + div`);
    const userSocialLnk = document.querySelector(`.ListingLayout-outerContainer > div:last-child > div:last-child > div:last-child > div > div:first-child > div > a[href="/user/${usrUrl}/"] + button + div + div + nav > ul`);
    if (!userProfileLnk) {
      removeWatchers.forEach((obs) => obs.disconnect());
      removeWatchers = [];
      return;
    }

    if (cache[usrUrl] !== undefined) {
      return;
    }

    insertCss();

    const root = $(userProfileLnk);
    const inputText = $(root).text();
    let matchText = 0;
    // URLs starting with http://, https://, or ftp://
    const matchPattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gim;
    const matchText1 = inputText.match(matchPattern1);

    for (const [, text] of Object.entries(matchText1)) {
      matchText += 1;
      const url = text.replace(/https?:\/\/((.+\.)?[a-z0-9]+\.[a-z]+)\/.*/gi, "$1");
      let user = text.replace(/https?:\/\/(.+\.)?\w+\.\w+(\/[\w\s]*)*\/(.*)/gi, "$3");
      if (user === "") {
        user = "website";
      }

      const buttonRow = document.createElement("li");
      createBtn(buttonRow, {
        href: text,
        domain: url,
        text: user
      });
      userSocialLnk.prepend(buttonRow);
      watchForRemoval(buttonRow, userSocialLnk);
    }

    // URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    const matchPattern2 = /(^|\/)(www\.\S+(\b|$))/gim;
    const matchText2 = inputText.match(matchPattern2);

    for (const [, text] of Object.entries(matchText2)) {
      matchText += 1;
      const url = text.replace(/((.+\.)?[a-z0-9]+\.[a-z]+)\/.*/gi, "$1");
      let user = text.replace(/(.+\.)?\w+\.\w+(\/[\w\s]*)*\/(.*)/gi, "$3");
      if (user === "") {
        user = "website";
      }

      const buttonRow = document.createElement("li");
      createBtn(buttonRow, {
        href: text,
        domain: url,
        text: user
      });
      userSocialLnk.prepend(buttonRow);
      watchForRemoval(buttonRow, userSocialLnk);
    }

    // Change email addresses to mailto:: links.
    const matchPattern3 = /(([a-z0-9\-_.])+@[a-z_]+?(\.[a-z]{2,6})+)/gim;
    const matchText3 = inputText.match(matchPattern3);

    for (const [, text] of Object.entries(matchText3)) {
      matchText += 1;
      const icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAKCAMAAABcxfTLAAAACVBMVEW+vr7////a2trdmc6vAAAAMUlEQVR42mXLQRIAIAhCUeX+h46Y0NH+InyL4i87MZpJc4oy30cbOmFjLMfhuqiPuwMd6ABk3pQhaQAAAABJRU5ErkJggg==";
      const buttonRow = document.createElement("li");
      createBtn(buttonRow, {
        href: `mailto:${text}`,
        domain: icon,
        text: "eMail"
      });
      userSocialLnk.prepend(buttonRow);
      watchForRemoval(buttonRow, userSocialLnk);
    }

    cache[usrUrl] = matchText;
  }

  generateLinks();

  const redditWatcher = window.redditWatcher || (unsafeWindow && unsafeWindow.redditWatcher);
  if (redditWatcher) {
    redditWatcher.body.onUpdate(generateLinks);
    redditWatcher.feed.onChange(clearRemoveWatchers);
  }

  let lastFirstPost = null;

  (new MutationObserver(() => {
    generateLinks();

    const listing = document.querySelector(".mantine-AppShell-main");
    const firstPost = listing && listing.querySelector(".ListingLayout-outerContainer");
    if (firstPost !== lastFirstPost) {
      lastFirstPost = firstPost;
      clearRemoveWatchers();
    }
  })).observe(document.body, { childList: true, subtree: true });

  /* Old Code
  const setupMutationObserver = () => {
    const targetNode = $("body")[0];
    const config = { attributes: true, childList: true, subtree: true };

    const callback = mutationList => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList" && $(mutation.target).attr("class").includes("mantine-AppShell-main")) {
          generateLinks();
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    $(document).on("unload", () => {
      observer.disconnect();
    });
  };

  setupMutationObserver();
  */
});
