function resetState(template) {
  //reset UI state
  template.$('div.content span.selected').removeClass('selected');
  template.$('div.content span.focus').removeClass('focus');
  template.$('button.clear').attr('disabled', 'disabled');

  //reset reactive vars
  template.currentTargetId.set(null);
  template.currentAlignment.set(null);
};

Template.LC_content.onCreated(function() {
  var instance = this;
  instance.currentTargetId = new ReactiveVar(null);
  instance.currentAlignment = new ReactiveVar(null);

  console.log('template content created');

  instance.autorun(function() {
    //TODO: remove autopublish pkg and use subscribe('chapters') and sub.isReady()
    console.log('autorun::  currentTargetId: ', instance.currentTargetId.get())
    console.log('autorun:: currentAlignment: ', instance.currentAlignment.get());

    if(instance.view.isRendered)
      if(instance.currentTargetId.get() != null)
        instance.$('.content .tei-div').each(function(idx, div) {
          var alignmentTarget = (instance.currentAlignment.get() != null) ? instance.currentAlignment.get().xtargets_target[0] : null; //TODO: currently unused variable
          LatinRead.offsetContent(div, instance.currentTargetId.get(), alignmentTarget);
        });
      else
        instance.$('.content .tei-div').css({ top: 0 });
  });

  //subscribe alignments
  Meteor.subscribe('alignments-by-work', Session.get('currentWorkId'));

  //subscribe notes
  Meteor.subscribe('notes-by-work', Session.get("currentWorkId"));
});

Template.LC_content.onRendered(function() {
  console.log('template content rendered');
});

Template.LC_content.helpers({
  isCurrentChapter: function(chapterId) {
    return (chapterId == Session.get('currentChapterId'));
  },
  isCurrentSection: function(sectionId) {
    return (sectionId == Session.get('currentSectionId'));
  },
  hasTarget: function() {
    return Template.instance().currentTargetId.get() != null;
  },
  targetArgsChapter: function(chapter, desc) {
    return { chapter_id: chapter.chapter_id, title: chapter.title, desc: desc, target: Template.instance().currentTargetId };
  },
  targetArgsSection: function(section, desc) {
    return { section_id: section.section_id, title: section.title, desc: desc, target: Template.instance().currentTargetId };
  },
  notes: function() {
    return (Template.instance().currentTargetId && Template.instance().currentTargetId.get() != null) ? Notes.find({ work_id: Session.get("currentWorkId"), target: "#" + Template.instance().currentTargetId.get() }) : null;
  },
  toggleTranslationProps: function(isDefault) {
    // isDefault (translation ON setting)
    var btnClasses = "btn btn-xs";

    if(isDefault) btnClasses += " btn-default";

    if((Session.get('activeTranslation') && isDefault) || (!Session.get('activeTranslation') && !isDefault)) {
      return {
        class: btnClasses + " btn-primary active"
      };
    } else {
      return {
        class: btnClasses
      };
    }
  },

  /*sourceTarget: function() {
    var targetStr = "";
    var sourceTargetId = Template.instance().currentTargetId.get();
    var alignment = Template.instance().currentAlignment.get();

    if(sourceTargetId != null)
      targetStr += sourceTargetId;

    if(alignment != null)
      targetStr += " (" + alignment.xtargets_source.toString() + ")";

    return targetStr;
  },*/

  overlayDisplay: function() {
    if(Template.instance().currentTargetId && Template.instance().currentTargetId.get() != null)
      return {'style': 'display:block' };
    else
      return {'style': 'display:none' };
  }
});

Template.LC_content.events({
  "click .translation-toggle .btn": function(event, template) {
    if(!$(event.currentTarget).hasClass('active')) {
      if($(event.currentTarget).hasClass('btn-default')) Session.set('activeTranslation', true);
      else Session.set('activeTranslation', false);
    }
  },
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
        template.$(LatinRead.jq(template.currentTargetId.get())).removeClass('focus');
        prevAlignment = (template.currentAlignment.get() != null) ? template.currentAlignment.get() : Alignments.findOne({ work_id: Session.get('currentWorkId'), xtargets_source: template.currentTargetId.get() });
        if(prevAlignment && prevAlignment.xtargets_source.length > 0)
            for(var i=0; i < prevAlignment.xtargets_source.length; i++)
              template.$(LatinRead.jq(prevAlignment.xtargets_source[i])).removeClass('selected');
      }

      // set new reactive context
      template.currentTargetId.set(targetId);
      template.currentAlignment.set(alignment);

      // update DOM
      template.$(LatinRead.jq(targetId)).addClass('focus'); //TODO: focus on entire source section if m-1 link and translation-select?

      for(var i=0; i < alignment.xtargets_source.length; i++)
        template.$(LatinRead.jq(alignment.xtargets_source[i])).addClass('selected');

    } else { // no alignment exists
      if(targetId.indexOf('trans_') > 0) return;

      if(template.currentTargetId.get() != null && targetId != template.currentTargetId.get()) {
        template.$(LatinRead.jq(template.currentTargetId.get())).toggleClass('selected');
      }

      template.$(LatinRead.jq(targetId)).addClass('focus');
      template.$(LatinRead.jq(targetId)).addClass('selected');

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
  },
  "click .section.highlight": function(event, template) {
    event.stopPropagation();
    console.log('click target: ' + event.target.id);
    if(event.target.id != template.currentTargetId.get()) resetState(template);
  }
});
