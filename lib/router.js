Router.route('/', function() {
  this.render('home');
}, {
  name: 'home'
});

Router.route('book', {
  name: 'book',
  path: '/book/:book_id',
  onBeforeAction: function () {
    var work = Works.findOne({'contents.book_id': this.params.book_id });
    if(work) {
      var param_id = this.params.book_id;
      work.contents.forEach(function(book, idx) {
        if(book.book_id === param_id)
          if(book.chapters)
            Router.go('chapter.show', { chapter_id: book.chapters[0].chapter_id });
          else if(book.sections)
            Router.go('section.show', { section_id: book.sections[0].section_id });
      });
    }
    this.next();
  },
  data: function () {
    var work = Works.findOne({'contents.book_id': this.params.book_id });
  },
  action: function() {
    this.render('notFound');
  }
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
  template: 'LC_content',
  layoutTemplate: 'contentViewLayout',
  action: function() {
    if(Session.get("activeTranslation") == undefined) Session.set("activeTranslation", true);
    this.render();
  }
});

Router.route('section.show', {
  name: 'section.show',
  path: '/section/:section_id',
  data: function () {
    Session.set("currentSectionId", this.params.section_id);
    var work = Works.findOne({'contents.sections.section_id': this.params.section_id });

    if(work) {
        Session.set("currentWorkId", work.work_id);
        return work;
    } else {
      return null;
    }
  },
  template: 'LC_content',
  layoutTemplate: 'contentViewLayout',
  action: function() {
    if(Session.get("activeTranslation") == undefined) Session.set("activeTranslation", true);
    this.render();
  }
});
