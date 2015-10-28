function jq(myid) {
  return "#" + myid.replace( /(:|\.|\[|\]|,)/g, "\\$1" );
};

function resetState(template) {
  //reset UI state
  template.$('div.content span.selected').removeClass('selected');
  template.$('div.content span.focus').removeClass('focus');
  template.$('button.clear').attr('disabled', 'disabled');

  //reset reactive vars
  template.currentTargetId.set(null);
  template.currentAlignment.set(null);
};

Template.chapter.onCreated(function() {
  var instance = this;
  instance.currentTargetId = new ReactiveVar(null);
  instance.currentAlignment = new ReactiveVar(null);

  console.log('template chapter created');
  instance.autorun(function() {
    //TODO: remove autopublish pkg and use subscribe('chapters') and sub.isReady()
    console.log('autorun::  currentTargetId: ', instance.currentTargetId.get())
    console.log('autorun:: currentAlignment: ', instance.currentAlignment.get());
  });
});

Template.chapter.onRendered(function() {
  console.log('template chapter rendered');
});

Template.chapter.helpers({
  chapterContent: function() {
    /* package: simple:reactive-method */
    if(!this.chapterData) {
      this.chapterData = ReactiveMethod.call("getChapterData", Session.get('currentWorkId'), Session.get('currentChapterId'));
      if(Template.instance().currentTargetId.get() != null) Template.instance().currentTargetId.set(null);
      console.log('return change content');
    }

    return this.chapterData;
  },
  isCurrentChapter: function(chapterId) {
    return (chapterId == Session.get('currentChapterId'));
  },
  chapterClasses: function() {
    var classes = "chapter";
    if(Template.instance().currentTargetId != undefined && Template.instance().currentTargetId.get() != null)
      classes = classes.concat(" highlight");
    return classes;
  },
  hasTarget: function() {
    if(Template.instance().currentTargetId != undefined)
      return (Template.instance().currentTargetId.get() != null);
    return false;
  },
  notes: function() {
    return (Template.instance().currentTargetId && Template.instance().currentTargetId.get() != null) ? Notes.find({ work_id: Session.get("currentWorkId"), target: "#" + Template.instance().currentTargetId.get() }) : null;
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
  },
  sourceTarget: function() {
    var targetStr = "";
    var sourceTargetId = Template.instance().currentTargetId.get();
    var alignment = Template.instance().currentAlignment.get();

    if(sourceTargetId != null)
      targetStr += sourceTargetId;

    if(alignment != null)
      targetStr += " (" + alignment.xtargets_source.toString() + ")";

    return targetStr;
  },
  targetAlignment: function() {
    // TODO: Handle cursor for multiple Alignments (translations), Filter on selected translation available in interface
    if(Template.instance().currentTargetId && Template.instance().currentTargetId.get() != null)
      return Alignments.findOne({ work_id: Session.get('currentWorkId'), xtargets_source: Template.instance().currentTargetId.get() })
    return null;
  },
  overlayDisplay: function() {
    if(Template.instance().currentTargetId && Template.instance().currentTargetId.get() != null)
      return {'style': 'display:block' };
    else
      return {'style': 'display:none' };
  }
});

Template.chapter.events({
  "click .clear": function(event, template) {
    event.stopPropagation();
    console.log('clear selection: ' + template.currentTargetId.get());

    resetState(template);
  },
  "click .tei-p": function(event, template){
    console.log('clicked paragraph: ', event.currentTarget.id);
  },
  "click .tei-s": function(event, template){
    console.log('clicked sentence: ', event.currentTarget.id);

    var alignment = null, prevAlignment = null;
    var targetId = event.currentTarget.id;

    if(template.currentTargetId && targetId == template.currentTargetId.get()) {
      event.stopPropagation();
      return;
    }
    else if(template.currentAlignment.get() != null && _.indexOf(template.currentAlignment.get().xtargets_target, targetId) > -1) {
      event.stopPropagation();
      return;
    }
    else if(template.$('.overlay').is(':visible')) return;

    if(targetId.indexOf('trans_') > 0) {
      console.log('find alignment for selected target: ' + targetId);
      console.log('current work: ' + Session.get('currentWorkId'));

      //TODO: use selected translation (lang) in alignments query
      alignment = Alignments.findOne({ work_id: Session.get('currentWorkId'), xtargets_target: targetId });
    } else {
      alignment = Alignments.findOne({ work_id: Session.get('currentWorkId'), xtargets_source: targetId });
    }

    if(alignment != null) {
      console.log('setting reactive alignment context: ' + alignment);
      if(_.indexOf(alignment.xtargets_source, targetId) < 0)
        targetId = alignment.xtargets_source[0]; // focus first source-target

      // update DOM
      if(template.currentTargetId.get() != null && template.currentTargetId.get() != targetId) {
        template.$(jq(template.currentTargetId.get())).removeClass('focus');
        prevAlignment = (template.currentAlignment.get() != null) ? template.currentAlignment.get() : Alignments.findOne({ work_id: Session.get('currentWorkId'), xtargets_source: template.currentTargetId.get() });
        if(prevAlignment && prevAlignment.xtargets_source.length > 0)
            for(var i=0; i < prevAlignment.xtargets_source.length; i++)
              template.$(jq(prevAlignment.xtargets_source[i])).removeClass('selected');
      }

      // set new reactive context
      template.currentTargetId.set(targetId);
      template.currentAlignment.set(alignment);

      // update DOM
      template.$(jq(targetId)).addClass('focus'); //TODO: focus on entire source section if m-1 link and translation-select?
      for(var i=0; i < alignment.xtargets_source.length; i++)
        template.$(jq(alignment.xtargets_source[i])).addClass('selected');

    } else { // no alignment exists
      if(targetId.indexOf('trans_') > 0) return;
      if(template.currentTargetId.get() != null && targetId != template.currentTargetId.get())
        template.$(template.currentTargetId.get()).toggleClass('selected');

      template.$(event.currentTarget).addClass('selected');
      template.currentTargetId.set(targetId);
    }

    template.$('button.clear').attr('disabled', null);
  },
  "click .overlay": function(event, template) {
    console.log('overlay clicked: ' + event.currentTarget);
    event.stopPropagation();
    resetState(template);
  },
  "click .chapter.highlight": function(event, template) {
    event.stopPropagation();
    console.log('click target: ' + event.target.id);
    if(event.target.id != template.currentTargetId.get()) resetState(template);
  }
});

Template.translationList.onCreated(function() {
  console.log('template translationList created');
  var instance = this;
  instance.chapterContent = new ReactiveVar(null);
  instance.autorun(function() {
      if(instance.chapterContent.get() != null)
        console.log('chapter translation loaded' );
  });
});

Template.translationList.onRendered(function() {
  console.log('template translationList rendered');
});

Template.translationList.helpers({
  translationContent: function() {
    var currentChapterId = Session.get('currentChapterId');
    var index = currentChapterId.substring(currentChapterId.lastIndexOf('.') + 1) - 1;
    var target = Template.parentData().target;
    var content = Template.instance().chapterContent.get();

    if(content == null && this.contents[0].chapters.length >= index && target == null) {
      Template.instance().chapterContent.set(ReactiveMethod.call("getChapterData", this.work_id, this.contents[0].chapters[index].chapter_id));
    }

    if(target && target.xtargets_target.length > 0 && content != null) {
      content = $(Template.instance().chapterContent.get());
      _.each(target.xtargets_target, function(targetVal) {
        content.find(jq(targetVal)).addClass('selected');
      });
    }

    return (target) ? content[0].outerHTML : Template.instance().chapterContent.get();
  },
  targetValue: function() {
    return (this.target && this.target.xtargets_target.length > 0) ? "(" + this.target.xtargets_target.toString() + ")": null;
  }
});
