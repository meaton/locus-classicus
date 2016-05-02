LatinRead = {};
LatinRead.convertRoman = function(num) {
  var rom = { M: 1000, CM: 900, D: 500, CD: 400,
              C:  100, XC:  90, L:  50, XL:  40,
              X:   10, IX:   9, V:   5, IV:   4,
              I:    1 };
  return Object.keys(rom).reduce(function (acc, ch) {
    acc.str += ch.repeat(acc.num / rom[ch]);
    acc.num %= rom[ch];
    return acc;
  }, { str: '', num: num }).str;
};

LatinRead.jq = function(myid) {
  return "#" + myid.replace( /(:|\.|\[|\]|,)/g, "\\$1" );
};

LatinRead.offsetContent = function(div, targetId, alignmentTargetId) {
  var target = $(div).find('.tei-s[id="' + targetId + '"]');
  var posTop = target.position().top;
  var height = target.height();

  /*var alignmentTop = 0;
  var alignmentTarget = (alignmentTargetId && alignmentTargetId.indexOf('_trans') > 0) ? $('.translations .tei-div') : $('.content .tei-div');

  if(alignmentTarget != $(div) && alignmentTarget.find('.tei-s[id="' + alignmentTargetId + '"]').length > 0)
    alignmentTop = alignmentTarget.find('.tei-s[id="' + alignmentTargetId + '"]').position().top;

  if(alignmentTargetId.indexOf('_trans') > 0)
      alignmentTop = alignmentTop + 18; // (margin-top + border + padding-top) selected tei-s
  */

  if(posTop != undefined) {
    var heightDiv = $('.chapter').height() - (screen.height*0.26); // static notes height
    if($('.chapter-title').length == 1)
      heightDiv -= $('.chapter-title').height();

    //console.log(targetId, ' :: pos top: ' + posTop);
    //console.log(targetId, ' :: align top: ' + alignmentTop);
    //console.log(targetId, ' :: height: ' + height);
    //console.log(targetId, ' :: height-div: ', heightDiv*0.85);

    if((posTop + height + 50) > heightDiv*0.90)
        $(div).css({ top: - posTop + 25 });
  }
};
