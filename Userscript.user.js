// ==UserScript==
// @name         Auto Load Big Image
// @version      0.2
// @description  Auto expand image width height quality for image urls with custom sizes
// @author       navchandar
// @match        http*://*/*
// @grant        none
// @license      MPL-2.0
// @copyright    2019, navchandar (https://github.com/navchandar)
// @downloadURL  https://openuserjs.org/install/navchandar/Auto_Load_Big_Image.user.js
// @updateURL    https://openuserjs.org/meta/navchandar/Auto_Load_Big_Image.meta.js
// @run-at       document-idle
// ==/UserScript==

function isNum(num) {
  return !isNaN(num)
}

function Load(uri) {
  window.location.href = uri
}

function has(String, search) {
  try {
    if (String.indexOf(search) > -1) {
      return true;
    }
  }
  catch (err) {}
  return false;
}

function getRegexMatch(String, regex) {
  var finalText = "";
  try {
    var arr = String.match(regex);
    if (arr != null && arr.length >= 1) {
      finalText = arr[0];
    }
  }
  catch (err) {}
  return finalText;
}

function widthUpdate(uri, w) {
  if (has(uri, w)) {
    var res = uri.split(w);
    if (res.length == 2) {
      if (res[1] != "10000" && isNum(res[1])) {
        var newuri = res[0] + w + "10000";
        Load(newuri);
      }
    }
  }
}

function sizeUpdate(uri, w) {
  if (has(uri, w)) {
    var res = uri.split(w);
    if (res.length == 2) {
      var end = "";
      var width = "";
      if (has(res[1], "&")) {
        var arr = res[1].split("&");
        for (var i = 1; i < arr.length; i++) {
          end += "&" + arr[i];
        }
        width = arr[0]
      }
      else {
        width = res[1]
      }
      if (width != "6000" && isNum(width)) {
        var newuri = res[0] + w + "6000" + end;
        Load(newuri);
      }
    }
  }
}

function WidthandHeightUpdate(uri, format, width, height) {
  if (has(uri, format) && has(uri, width) && has(uri, height)) {
    var res1 = uri.split(width);
    if (res1.length == 2) {
      var res2 = res1[1].split(height);
      if (res2.length == 2) {
        if (res2[0] != "6000" && isNum(res2[0]) && isNum(res2[1])) {
          var w = parseInt(res2[0]);
          var h = parseInt(res2[1]);
          var newh = parseInt((h / w) * 6000);
          var newuri = res1[0] + width + "6000" + height + newh;
          Load(newuri);
        }
        else {
          if (res2[0] != "6000" && has(res2[1], "&") && (has(res2[1], "quality=") || has(res2[1], "q="))) {
            var qual = "";
            if (has(res2[1], "quality=")) {
              qual = "&quality=";
            }
            if (has(res2[1], "q=")) {
              qual = "&q=";
            }
            var res3 = res2[1].split(qual);
            if (res3.length >= 2 && isNum(res2[0]) && isNum(res3[0]) && isNum(res3[1])) {
              w = parseInt(res2[0]);
              h = parseInt(res3[0]);
              newh = parseInt((h / w) * 6000);
              newuri = res1[0] + width + "6000" + height + newh + qual + "100";
              Load(newuri);
            }
          }
        }
      }
    }
  }
}

function HeightandWidthUpdate(uri, format, height, width) {
  if (has(uri, format) && has(uri, width) && has(uri, height)) {
    var res1 = uri.split(height);
    if (res1.length == 2) {
      var res2 = res1[1].split(width);
      if (res2.length >= 2) {
        var end = "";
        var w = "";
        var h = res2[0];
        if (has(res2[1], "&")) {
          var arr = res2[1].split("&");
          for (var i = 1; i < arr.length; i++) {
            end += "&" + arr[i];
          }
          w = arr[0]
        }
        else {
          w = res2[1]
        }
        if (w != "6000" && isNum(w) && isNum(h)) {
          var w1 = parseInt(w);
          var h1 = parseInt(h);
          var newh = parseInt((h1 / w1) * 6000);
          var newuri = res1[0] + height + newh + width + "6000" + end;
          Load(newuri);
        }
      }
    }
  }
}

function QualityUpdate(uri, format, start, end) {
  if (has(uri, format) && has(uri, start) && has(uri, end)) {
    var res1 = uri.split(start);
    if (res1.length >= 2 && has(res1[1], end)) {
      var res2 = res1[1].split(end);
      if (res2.length > 0 && res2[0] != 100 && isNum(res2[0])) {
        var newuri = uri.replace((start + res2[0] + end), (start + "100" + end));
        Load(newuri);
      }
    }
  }
}

function ReplaceCustomCrop(uri, format, regex, replacement) {
  if (has(uri, format)) {
    try {
      if (regex.test(uri)) {
        var newuri = uri.replace(regex, replacement);
        Load(newuri);
      }
    }
    catch (err) {}
  }
}

function UpdateCustomWidthandHeight(uri, format, regex) {
  if (has(uri, format)) {
    try {
      if (regex.test(uri)) {
        var res = getRegexMatch(uri, regex);
        var rep = res.replace("/", "");
        rep = rep.replace("/", "");
        if (has(rep, "x") && has(rep, ",")) {
          var res1 = rep.split("x");
          var res2 = res1[1].split(",");
          if (res1[0] != "6000" && res2.length >= 2 && isNum(res1[0]) && isNum(res2[0]) && isNum(res2[1])) {
            var w = parseInt(res1[0]);
            var h = parseInt(res2[0]);
            var newh = parseInt((h / w) * 6000);
            var replacement = "/" + 6000 + "x" + newh + ",100" + "/";
            var newuri = uri.replace(res, replacement);
            Load(newuri);
          }
        }
      }
    }
    catch (err) {}
  }
}

function DPRUpdate(uri, d) {
  if (has(uri, d)) {
    var res = uri.split(d);
    if (isNum(res[1]) && res[1] < 3) {
      var newuri = res[0] + d + "3";
      Load(newuri);
    }
  }
}

function main(uri, format) {

  if (has(uri, "image/upload/")) {
    ReplaceCustomCrop(uri, "." + format, /q\_auto\//g, "q_auto:best/");
    ReplaceCustomCrop(uri, "." + format, /f\_auto\,|fl\_lossy\,|c\_limit\,/g, "");
    ReplaceCustomCrop(uri, "." + format, /upload\/[hw]\_\d+\,[hw]\_\d+\//g, "upload/");
  }

  if (has(uri, "wiki")) {
    ReplaceCustomCrop(uri, ".svg", /thumb\/|\/\w+px-\w+\.svg(.)*/g, "");
    ReplaceCustomCrop(uri, ".jpg", /thumb\/|\/\w+px(.)*\.jpg(.)*/g, "");
    ReplaceCustomCrop(uri, ".png", /thumb\/|\/\w+px(.)*\.png(.)*/g, "");
  }

  widthUpdate(uri, "." + format + "?w=");
  WidthandHeightUpdate(uri, "." + format + "?", "w=", "&h=");
  WidthandHeightUpdate(uri, "." + format + "?", "width=", "&height=");

  HeightandWidthUpdate(uri, "." + format + "?", "h=", "&w=");

  // Remove crops
  ReplaceCustomCrop(uri, "." + format, /\/\d+\,\d+\,\d+\,\d+\//g, "/");
  ReplaceCustomCrop(uri, "." + format, /\?crop=\d+\%\d\w\d+\%\d\w\w+\%\w+/g, "");
  // Remove watermark
  ReplaceCustomCrop(uri, format, /\&mark64\=(.)*/g, "");

  UpdateCustomWidthandHeight(uri, "." + format, /\/\d+\x\d+\,\d+\//g);

  QualityUpdate(uri, "." + format, "/q_", "/");
  QualityUpdate(uri, "." + format, "/x,", "/");
  QualityUpdate(uri, format, "&q=", "&");

  sizeUpdate(uri, "." + format + "?size=");
  DPRUpdate(uri, "&dpr=");

}

(function () {
  'use strict';
  var uri = window.location.href;
  if (has(uri, "jpg")) {
    main(uri, "jpg");
  }
  else if (has(uri, "png")) {
    main(uri, "png");
  }
  else if (has(uri, "webp")) {
    main(uri, "webp");
  }

})();
