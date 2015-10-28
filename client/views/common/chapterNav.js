function convertRoman(num) {
  var rom = { M: 1000, CM: 900, D: 500, CD: 400,
              C:  100, XC:  90, L:  50, XL:  40,
              X:   10, IX:   9, V:   5, IV:   4,
              I:    1 };
  return Object.keys(rom).reduce(function (acc, ch) {
    acc.str += ch.repeat(acc.num / rom[ch]);
    acc.num %= rom[ch];
    return acc;
  }, { str: '', num: num }).str;
}

Template.chapterNav.helpers({
  workContents: function() {
    var currentWork = Works.findOne({ work_id: Session.get('currentWorkId') });
    if(currentWork)
      return currentWork.contents;
    else null;
  },
  maybeActiveBook: function() {
    var currentRoute = Router.current();
    return currentRoute && !_.isEmpty(_.where(this.chapters, { chapter_id: currentRoute.params.chapter_id })) ? 'active' : null;
  },
  maybeActiveChapter: function() {
    var currentRoute = Router.current();
    return currentRoute && this.chapter_id === currentRoute.params.chapter_id ? 'active' : null;
  },
  toRoman: function(index) {
    return convertRoman(index+1);
  },
  toArabic: function(index) {
    return index+1;
  }
});

Template.chapterNav.events({
  "click .chapters-list .list-group-item": function(event, template){
    var link = $(event.currentTarget).find('a');
    if(link) Router.go(link.attr('href'));
  }
});
