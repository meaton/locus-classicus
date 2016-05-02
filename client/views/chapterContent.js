Template.chapterContent.helpers({
  content: function() {
    /* package: simple:reactive-method */
    if(!this.chapterData)
      this.chapterData = ReactiveMethod.call("getChapterData", Session.get('currentWorkId'), Session.get('currentChapterId'));

    return this.chapterData;
  },
  targetClass: function() {
    if(Template.instance().data.target != undefined)
      return (Template.instance().data.target.get() != null) ? "targeted" : null;
    return null;
  },
  chapterClasses: function() {
    var classes = "chapter";
    if(Template.instance().data.target != undefined && Template.instance().data.target.get() != null)
      classes += " highlight";
    return classes;
  },
  isTranslationOn: function() {
    return Session.get('activeTranslation');
  },
  targetArgs: function(translation) {
    var currentChapterId = Session.get('currentChapterId');

    var index = currentChapterId.substring(currentChapterId.lastIndexOf('.') + 1) - 1;
    if(index >= translation.contents[0].chapters.length || index < 0) index = -1;

    //TODO: Handle sections
    return { work_id: translation.work_id, chapter_id: (index > -1) ? translation.contents[0].chapters[index].chapter_id : null, section_id: null, target: this.alignment };
  },
  translation: function(targetLang) {
    var lang = (targetLang != undefined) ? targetLang : "da";
    var currentWorkId = Session.get('currentWorkId');
    var currentTransId = Session.get('currentTransId');

    if(currentTransId) return Works.findOne({ work_id: currentTransId });
    else {
      var trans = Works.findOne({ work_id: { $regex: '^' + currentWorkId.substring(0, currentWorkId.indexOf('_original')) + '_trans.*' }, lang: lang });

      Session.set('currentTransId', trans.work_id);

      return trans;
    }
  }
});
