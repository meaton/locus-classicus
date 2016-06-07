Works = new Mongo.Collection("works");
Works.attachSchema(Schemas.Work);

if (Meteor.isServer) {
  Meteor.publish('works', function() {
    return Works.find({}, {sort: {author: 1}});
  });

  Meteor.publish('current-work-by-book', function(bookId) {
    return Works.find({ 'contents.book_id': bookId }, { limit: 1 });
  });

  Meteor.publish('current-work-by-chapter', function(chapterId) {
    return Works.find({ 'contents.chapters.chapter_id': chapterId }, { limit: 1 });
  });

  Meteor.publish('current-work-by-section', function(sectionId) {
    return Works.find({ 'contents.sections.section_id': sectionId }, { limit: 1 });
  });

  Meteor.publish('current-translations', function(query) {
    return Works.find({ work_id: { $regex: query }}); //TODO: sort lang?
  });

  Works.allow({
    insert: function(){
      return true;
    },
    update: function() {
      return true;
    },
    remove: function(){
      return true;
    }
  });
}
