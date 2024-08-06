/* global checkAB */
import jQuery from "jquery";

jQuery(($) => {
  setInterval(() => {
    if (unsafeWindow.blockingAds) {
      checkAB(false);
    }
  }, 100);
  const creatorInfo = $("#fileinfo .sideitem:not(.timestamp)")[0];
  const uploaderInfo = $("#fileinfo .sideitem:not(.timestamp)")[1];
  const infos = [creatorInfo, uploaderInfo];
  const createObjects = (id, index) => {
    const tempButton = `<style>#action-${id}{position: relative;margin-left: 100px;margin-top: -35px;}#action-${id}::marker{content:none;}#action-${id} .inline-flex .icon{margin: 0 2px 0 2px;}</style>
    <li style="" id="action-${id}">
      <a class="btn inline-flex" tabindex="0">
        <svg title="" class="icon icon-files">
          <use xlink:href="https://www.nexusmods.com/assets/images/icons/icons.svg#icon-files"></use>
        </svg>
        <span class="flex-label"></span>
      </a>
    </li>`;
    const test = $(infos[index]).html();
    $(infos[index]).html(`${test}\n${tempButton}`);
    $(`#action-${id} a`).on("click", element => {
      const parent = $(document).find($(element.currentTarget)).parent();
      const text = $(parent).parent().text().split("\n")[2].replace(" ", "");
      GM_setClipboard(text);
    });
  };

  createObjects("copycreatorname", 0);
  createObjects("copyuploadername", 1);
});
