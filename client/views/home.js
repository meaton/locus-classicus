Template.home.onRendered(function() {
  console.log('home template rendered');
});

Template.home.helpers({
  works: function(lang) {
    if(lang == undefined) lang = 'la';
    return Works.find({ lang: lang }, { sort: { author: 1}});
  }
});

Template.translationsList.helpers({
  works: function(lang) {
    if(lang == undefined) lang = 'da';
    return Works.find({ lang: lang }, { sort: { author: 1}});
  }
});

Template.work_listing.onCreated(function() {
    this.open = new ReactiveVar(false);
});

Template.work_listing.helpers({
  convertRoman: function(idx){
    return LatinRead.convertRoman(idx+1);
  },
  open: function() {
    return Template.instance().open.get();
  },
  classes: function() {
    return (Template.instance().open.get() === true) ? "open": "";
  }
});

Template.book_listing.helpers({
  getIndex: function(idx){
    return new String(idx+1);
  }
});

Template.work_listing.events({
  "click li > label.work-label": function(event, template) {
    var parent = template.$(event.currentTarget).parent();

    if(template.open.get()) template.open.set(false)
    else template.open.set(true);

    parent.children('ul.tree').slideToggle(200);
  }
});
