Template.home.onRendered(function() {
  console.log('home template rendered');
});

Template.home.helpers({
  works: function(lang) {
    if(lang == undefined) lang = 'la';
    return Works.find({ lang: lang });
  }
});

Template.translationsList.helpers({
  works: function(lang) {
    if(lang == undefined) lang = 'da';
    return Works.find({ lang: lang });
  }
});

Template.work_listing.helpers({
  convertRoman: function(idx){
    return LatinRead.convertRoman(idx+1);
  }
});

Template.work_listing.events({
  "click .nav-list li > label": function(event, template) {
    var parent = template.$(event.currentTarget).parent();

    if(parent.hasClass('open')) parent.removeClass('open');
    else parent.addClass('open');

    parent.children('ul.tree').slideToggle(200);
  }
});
