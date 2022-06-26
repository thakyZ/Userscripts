// ==UserScript==
// @name         Glamour Dresser Copy Author Name
// @namespace    NekoBoiNick.Web.GlamourDresser.CopyAuthorName
// @version      1.0.0
// @description  Adds a copy author name button to Nexus Mods mod page.
// @author       Neko Boi Nick
// @match        https://www.glamourdresser.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=glamourdresser.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL  https://raw.githubusercontent.com/thakyz/Userscripts/master/glamourdresser_copyauthorname/glamourdresser_copyauthorname.user.js
// @updateURL    https://raw.githubusercontent.com/thakyz/Userscripts/master/glamourdresser_copyauthorname/glamourdresser_copyauthorname.user.js
// @supportURL   https://github.com/thakyZ/Userscripts/issues
// @homepageURL  https://github.com/thakyZ/Userscripts
// ==/UserScript==
/* global $ */

$(document).ready(function() {
  var creatorInfo = $("li[itemprop=\"author\"]")[0];
  var creatorInfoParent = $($("li[itemprop=\"author\"]")[0]).parent().parent().parent();
  var createObjects = function() {
    var tempButton = `<div class="elementor-element elementor-element-76f0e0a elementor-align-center elementor-widget elementor-widget-button" style="margin: 0;height: 0;">
      <div class="elementor-widget-container" style="position: relative;top: -50px;left: 250px;">
			  <div class="elementor-button-wrapper">
			    <a href="#" class="elementor-button-link elementor-button elementor-size-xl action-copy-author" role="button" style="margin: 0 0 0 var(--widgets-spacing);padding: 10px 20px;">
						<span class="elementor-button-content-wrapper">
						  <span class="elementor-button-text">Copy Author Name</span>
		        </span>
					</a>
		    </div>
			</div>
    </div>`;
    tempButton = $(tempButton);
    $(creatorInfoParent).after(tempButton);
    $(`.action-copy-author`).on("click", function(e) {
      var parent = $($(creatorInfo).find("span")[0]).text().replace(/^\s*\n\s+Created by:\s*\n\s+/, "").replace(/\s+$/,"");
      var text = parent.replace(" ", "_");
      var $temp = $("<input>");
      $("body").append($temp);
      $temp.val(text).select();
      document.execCommand("copy");
      $temp.remove();
    });
  }
  createObjects();
});
