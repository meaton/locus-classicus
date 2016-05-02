Template.sectionContent.helpers({
  content: function() {
    /* package: simple:reactive-method */
    if(!this.sectionData)
      this.sectionData = ReactiveMethod.call("getSectionData", Session.get('currentWorkId'), Session.get('currentSectionId'));

    return this.sectionData;
  },
  targetClass: function() {
    if(Template.instance().data.target != undefined)
      return (Template.instance().data.target.get() != null) ? "targeted" : null;
    return null;
  },
  sectionClasses: function() {
    var classes = "section";
    if(Template.instance().data.target != undefined && Template.instance().data.target.get() != null)
      classes += " highlight";
    return classes;
  },
  isTranslationOn: function() {
    return Session.get('activeTranslation');
  }
});
