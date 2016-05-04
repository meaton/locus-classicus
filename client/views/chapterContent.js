Template.chapterContent.onCreated(function() {
    console.log('chapterContent template created');
    var instance = this;
    instance.autorun(function() {
      console.log('autorun chapterContent');
    });
});

Template.chapterContent.onRendered(function() {
    console.log('chapterContent template rendered');
});

Template.chapterContent.helpers({
  content: function() {
    /* package: simple:reactive-method */
    if(!this.chapterData)
      this.chapterData = ReactiveMethod.call("getChapterData", Session.get('currentWorkId'), Session.get('currentChapterId'));

    return this.chapterData;
  },
  targetClass: function() {
    if(this.target != undefined)
      return (this.target.get() != null) ? "targeted" : null;
    return null;
  },
  chapterClasses: function() {
    var classes = "chapter";
    if(this.target != undefined && this.target.get() != null)
      classes += " highlight";
    return classes;
  },
  isTranslationOn: function() {
    return Session.get('activeTranslation');
  }
});
