var urlExistDB_RESTPath = function(path, workId, targetId) {
    return Meteor.settings.exist.protocol + '://' + Meteor.settings.exist.host + ':' + Meteor.settings.exist.port + Meteor.settings.exist.restpath + '/work/' + workId + '/' + path + targetId;
};

Meteor.methods({
  getChapterData: function(workId, chapterId) {
    var chapterData = null;
    if(workId && chapterId) {
      chapterData = HTTP.get(urlExistDB_RESTPath('chapter/', workId, chapterId), {
        auth: "admin:admin",
        headers: { Accept: "text/html" }
      }).content;
    }
    return chapterData;
  },
  getSectionData: function(workId, sectionId) {
    var sectionData = null;
    if(workId && sectionId) {
      sectionData = HTTP.get(urlExistDB_RESTPath('section/', workId, sectionId), {
        auth: "admin:admin",
        headers: { Accept: "text/html" }
      }).content;
    }
    return sectionData;
  }
});
