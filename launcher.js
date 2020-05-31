/* eslint max-lines-per-function: "off" */

(() => {
  function sendTerrain() {
    const d = $(document);
    const MIN_TERRAIN = 12

    const MAX_AREA = d.height() * d.width()/5;
    const MIN_AREA = 0 //d.height() * d.width()/1000;
    const TARGET_URL = "//estragon0.github.io/BookmarkletJam/index.html";

    $('a, button, img, td, video').filter(function() {
      return $(this).width() * $(this).height() < MAX_AREA &&
             $(this).width() * $(this).height() > MIN_AREA;
    }).addClass('cclicks-terrain');
    $('.cclicks-terrain .cclicks-terrain').removeClass('cclicks-terrain');

    if ($('.cclicks-terrain').length >= MIN_TERRAIN) {
      let terrain_list = [];
      $('.cclicks-terrain').each(function() {
        terrain_list.push({
          y: $(this).offset().top,
          x: $(this).offset().left,
          height: $(this).height(),
          width: $(this).width()
        });
      });
      const output = {
        "field": {
          "height": d.height(),
          "width": d.width()
        },
        "terrain": terrain_list
      };
      $('body').wrapInner('<div class="cclicks-grey" />');

      $('<form id="cclicks-data" target="cclicks-game" method="post" action="'
        TARGET_URL + '"> ' +
        '<input type="hidden" value="' + btoa(JSON.stringify(output)) + '" />' +
        '<input type="submit" style="display: none" />' +
        '</form>'
      ).prependTo($('body'));
      const game_frame = $('<iframe id="cclicks-game" allowtransparency="true"></iframe>').css({
        "position": "absolute",
        "padding": "0px",
        "left": "0px",
        "top": "0px",
        "width": d.width(),
        "height": d.height(),
        "z-index": 1000
      });

      $('.cclicks-grey').fadeTo(
        2000,
        0.2,
        function() {
          game_frame.prependTo($('body'));
          $('#cclicks-data').submit();
        }
      );
    } else { //not enough terrain from first pass
      alert("Not enough terrain!");
    }
  }

  if (!document.getElementById("jquery")) {
    let s = document.createElement("script");
    s.src = "//cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js";
    s.id = "jquery";
    s.onload = sendTerrain;
    document.getElementsByTagName("head")[0].appendChild(s);
  } else {
    sendTerrain();
  }
})();
