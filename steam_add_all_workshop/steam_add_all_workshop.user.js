// ==UserScript==
// @name         Steam Add All Workshop Items to Collection
// @namespace    NekoBoiNick.Steam.Workshop.COllecton.AddAllItems
// @version      1.0.0
// @description  Makes GUI to add or remove all items to or from a collection.
// @author       Neko Boi Nick
// @match        https://steamcommunity.com/sharedfiles/managecollection/?id=*&activeSection=MySubscribedItems
// @icon         https://www.google.com/s2/favicons?domain=steamcommunity.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @grant        none
// ==/UserScript==

/* ===============
 * Code borrows from: https://www.reddit.com/r/CitiesSkylines/comments/8hrdsd/add_all_subscribed_items_to_steam_collections_at/
 * Code is made by u/kluvo2
 *
 * Due to current Steam Workshop Collection Issues this script must be disabled before using.
 *
 * Steps:
 * 1. Start creating a new collection
 * 2. Save the title and the details of the collection
 * 3. Go to the My Subscribed Items tab.
 * 4. Enable Script
 * 5. 5. This will create 2 new buttons above the table with the subscribed items. Press the green button to add all subscibed items into this collection and the red button to remove all subscribed items from this collection.
 * 6. After you press the green button, open the "Network" tab in the developer console and wait until the last request gets a "200" response.
 * 7. Refresh the page, your collection will be updated.
 * To see how it looks on the page, see the screenshot: https://imgur.com/a/w8qZ3VM
 */

/* global jQuery */

(function() {
  'use strict';
  setTimeout(function(){
    // Create "Add" button
    var btn_add = document.createElement("BUTTON");
    var collection_window1 = document.querySelector('div.collectionAddItemsSection')
    collection_window1.insertBefore(btn_add,collection_window1.firstChild);
    btn_add.setAttribute('id','ASCM_addall');
    jQuery('button#ASCM_addall').html('+')
    btn_add.style.position = 'absolute';
    btn_add.style.top = '110px';
    btn_add.style.right = '50px';
    btn_add.style['border-radius'] = '10px';
    btn_add.style.color = 'white';
    btn_add.style['font-size'] = '40px';
    btn_add.style.background = '#00c417';
    btn_add.style.width = '60px';
    btn_add.style.height = '60px';
    btn_add.style['text-decoration'] = 'none';
    // Create "Remove" button
    var btn_rem = document.createElement("BUTTON");
    var collection_window2 = document.querySelector('div.collectionAddItemsSection')
    collection_window2.insertBefore(btn_rem ,collection_window2.firstChild);
    btn_rem .setAttribute('id','ASCM_removeall');
    jQuery('button#ASCM_removeall').html('-')
    btn_rem.style.position = 'absolute';
    btn_rem.style.top = '110px';
    btn_rem.style.right = '120px';
    btn_rem.style['border-radius'] = '10px';
    btn_rem.style.color = 'white';
    btn_rem.style['font-size'] = '40px';
    btn_rem.style.background = '#c20000';
    btn_rem.style.width = '60px';
    btn_rem.style.height = '60px';
    btn_rem.style['text-decoration'] = 'none';
    // Bind "Add" button
    jQuery('button#ASCM_addall').click(function(){
      var items = [];
      var collection_name = jQuery('div.manageCollectionHeader div.breadcrumbs a').eq(2).text().trim();
      var url = new URL(document.location.href);
      var collection_id = url.searchParams.get('id');
      jQuery('div#MySubscribedItems div.itemChoice:not(.inCollection)').each(function(){
        var data = {
          id: collection_id,
          sessionid: window.g_sessionID,
          childid: jQuery(this).attr('id').replace('choice_MySubscribedItems_',''),
          activeSection: collection_name
        };
        addToCollection(data, jQuery(this));
      });
    });
    // Bind "Remove" button
    jQuery('button#ASCM_removeall').click(function(){
      jQuery('div#MySubscribedItems div.itemChoice.inCollection').each(function(){
        window.RemoveChildFromCollection(jQuery(this).attr('id').replace('choice_MySubscribedItems_',''))
      });
    });
    // Function to send a request to add item to a collection
    function addToCollection(data, object){
      jQuery.ajax({
        type: "POST",
        url: 'https://steamcommunity.com/sharedfiles/addchild',
        data: data,
        success: function(response){
          if(object && response.success == 1){
            object.addClass('inCollection');
          }
        }
      });
    }
  }, 0);
})();
