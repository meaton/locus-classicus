Router.route('/', function() {
  this.render('home');
}, {
  name: 'home'
});

Router.route('chapter.show', {
  name: 'chapter.show',
  path: '/chapter/:chapter_id',
  data: function () {
    Session.set("currentChapterId", this.params.chapter_id);
    var work = Works.findOne({'contents.chapters.chapter_id': this.params.chapter_id });
    if(work) {
        Session.set("currentWorkId", work.work_id);
        return work;
    } else {
      return null;
    }
  },
  template: 'chapter',
  layoutTemplate: 'chapterViewLayout',
  action: function() {
    if(Session.get("activeTranslation") == undefined) Session.set("activeTranslation", true);
    this.render();
  }
});
