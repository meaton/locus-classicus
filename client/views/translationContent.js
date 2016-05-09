Template.translationContent.onCreated(function() {
  console.log('template translation created');

  var instance = this;
  instance.content = new ReactiveVar(null);
  instance.currentAlignment = new ReactiveVar(null);

  instance.autorun(function() {
    if(instance.content.get() != null)
      console.log('translation loaded' );

    if(instance.view.isRendered) {
      if(instance.currentAlignment.get() != null) {
        console.log('alignment loading from target');

        instance.$('.translation > .tei-div').each(function(idx, div) {
          LatinRead.offsetContent(div, instance.currentAlignment.get().xtargets_target[0], instance.currentAlignment.get().xtargets_source[0]);
        });
      } else {
        instance.$('.translation > .tei-div').css({ top: 0 });
      }
    }
  });
  var query = '^' + Session.get('currentWorkId').substring(0, Session.get('currentWorkId').indexOf('_original')) + '_trans.*';
  Meteor.subscribe('current-translations', query);
});

Template.translationContent.onRendered(function() {
  console.log('template translationList rendered');
});

Template.translationContent.helpers({
  getTranslation: function() {
    var lang = (this.lang != undefined) ? this.lang : "da";

    var currentWorkId = Session.get('currentWorkId');
    var currentTransId = Session.get('currentTransId');

    if(currentTransId) {
      return Works.findOne({ work_id: currentTransId });
    } else {
      var trans = Works.findOne({ work_id: { $regex: '^' + currentWorkId.substring(0, currentWorkId.indexOf('_original')) + '_trans.*' }, lang: lang });
      Session.set('currentTransId', trans.work_id);

      return trans;
    }
  },
  setAlignment: function() {
    // TODO: Handle cursor for multiple Alignments (translations), Filter on selected translation available in interface
    if(this.target.get() != null) {
      var alignment = Alignments.findOne({ work_id: Session.get('currentWorkId'), xtargets_source: this.target.get() })
      if(alignment != null)
        Template.instance().currentAlignment.set(alignment);
    } else {
      Template.instance().currentAlignment.set(null);
    }
  },
  content: function(translation) {
    var alignment = Template.instance().currentAlignment.get();
    var currentChapterId = Session.get('currentChapterId');
    var index = currentChapterId.substring(currentChapterId.lastIndexOf('.') + 1) - 1;

    if(translation) { // translation work contents
      if(index >= translation.contents[0].chapters.length || index < 0) index = -1;
      this.chapter_id = (index > -1) ? translation.contents[0].chapters[index].chapter_id : null;

      //TODO handle sections
      var content = Template.instance().content.get();

      if(content == null && this.chapter_id != null)
          Template.instance().content.set(ReactiveMethod.call("getChapterData", translation.work_id, this.chapter_id));
      else if(content == null && this.section_id != null)
          Template.instance().content.set(ReactiveMethod.call("getSectionData", translation.work_id, this.section_id));

      if(alignment && alignment.xtargets_target.length > 0 && content != null) {
        content = $(Template.instance().content.get());
        _.each(alignment.xtargets_target, function(targetVal) {
          content.find(LatinRead.jq(targetVal)).addClass('selected');
        });
      }
    }

    return (alignment != null) ? content[0].outerHTML : Template.instance().content.get();
  },
  targetValue: function() {
    var target = Template.instance().currentAlignment.get();
    return (target && target.xtargets_target.length > 0) ? "(" + target.xtargets_target.toString() + ")": null;
  },
  hasTarget: function() {
    return this.target.get() != null;
  }
});
