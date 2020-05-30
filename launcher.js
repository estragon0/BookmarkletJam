/* eslint max-lines-per-function: "off" */

(() => {
  function sendTerrain() {
    const d = $(document);
    const MIN_TERRAIN = 12

    const MAX_AREA = d.height() * d.width()/5;
    const MIN_AREA = 0 //d.height() * d.width()/1000;
    const TARGET_URL = "//ganbaranai.net/cclicks/index.html"; //configurable

    $('a, button, img, td, video').filter(function() {
      return $(this).width() * $(this).height() < MAX_AREA &&
             $(this).width() * $(this).height() > MIN_AREA;
    }).addClass('gameified');
    $('.gameified .gameified').removeClass('gameified');

    if ($('.gameified').length >= MIN_TERRAIN) {
      let terrain_list = [];
      $('.gameified').each(function() {
        terrain_list.push({
          y: $(this).offset().top,
          x: $(this).offset().left,
          height: $(this).height(),
          width: $(this).width()
        });
      });
      let output = {
        "field": {
          "height": d.height(),
          "width": d.width()
        },
        "terrain": terrain_list
      };
      $('body').wrapInner('<div class="cclick-grey" />');

      let game_frame = $('<iframe src="' +
         TARGET_URL +
        '?terrain=' +
        btoa(JSON.stringify(output)) +
      '" allowtransparency="true"></iframe>').css({
        "position": "absolute",
        "left": "0px",
        "top": "0px",
        "width": d.width(),
        "height": d.height(),
        "z-index": 1000
      });
      $('.cclick-grey').fadeTo(2000, 0.2, () => game_frame.prependTo($('body')));
      //window.open(TARGET_URL + "?terrain=" + btoa(JSON.stringify(output)));
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
