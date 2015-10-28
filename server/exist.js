Meteor.methods({
  getChapterData: function(workId, chapterId) {
    var chapterData = null;
    if(workId && chapterId) {
      chapterData = HTTP.get(Meteor.settings.exist.protocol + '://' + Meteor.settings.exist.host + ':' + Meteor.settings.exist.port + Meteor.settings.exist.restpath + '/work/' + workId + '/chapter/' + chapterId, {
        auth: "admin:admin",
        headers: { Accept: "text/html" }
      }).content;
    }
    return chapterData;
  }
});
