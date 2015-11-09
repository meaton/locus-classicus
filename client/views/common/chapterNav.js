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
    return LatinRead.convertRoman(index+1);
  },
  toArabic: function(index) {
    return index+1;
  }
});

Template.chapterNav.events({
  "click .chapter-nav .list-group-item": function(event, template) {
    var link = $(event.currentTarget).find('a');
    if(link) Router.go(link.attr('href'));
  }
});
