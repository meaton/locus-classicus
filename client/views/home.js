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
