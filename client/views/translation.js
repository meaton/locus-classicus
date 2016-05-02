Template.translationContent.onCreated(function() {
  console.log('template translation created');

  var instance = this;
  instance.content = new ReactiveVar(null);
  instance.currentAlignment = new ReactiveVar(null);

  instance.autorun(function() {
    if(instance.content.get() != null)
      console.log('translation loaded' );

    if(instance.view.isRendered)
      if(instance.currentAlignment.get() != null) {
        console.log('alignment loaded');
        instance.$('.translation > .tei-div').each(function(idx, div) {
          LatinRead.offsetContent(div, instance.currentAlignment.get().xtargets_target[0], instance.currentAlignment.get().xtargets_source[0]);
          //setTimeout(LatinRead.offsetContent, 50, div, instance.currentAlignment.get().xtargets_target[0]);
        });
      } else
        instance.$('.translation > .tei-div').css({ top: 0 });
  });
});

Template.translationContent.onRendered(function() {
  console.log('template translationList rendered');
});

Template.translationContent.helpers({
  translationContent: function() {
    var target = this.target;
    var content = Template.instance().content.get();

    if(content == null)
        if(this.chapter_id != null) Template.instance().content.set(ReactiveMethod.call("getChapterData", this.work_id, this.chapter_id));
        if(this.section_id != null) Template.instance().content.set(ReactiveMethod.call("getSectionData", this.work_id, this.section_id));

    if(target && target.xtargets_target.length > 0 && content != null) {
      Template.instance().currentAlignment.set(target);
      content = $(Template.instance().content.get());
      _.each(target.xtargets_target, function(targetVal) {
        content.find(LatinRead.jq(targetVal)).addClass('selected');
      });
    }

    return (target) ? content[0].outerHTML : Template.instance().content.get();
  },
  targetValue: function() {
    return (this.target && this.target.xtargets_target.length > 0) ? "(" + this.target.xtargets_target.toString() + ")": null;
  }
});
