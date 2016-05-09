Alignments = new Mongo.Collection("alignments");
Alignments.helpers({
  source: function() {
    return Works.find({ work_id: this.work_id });
  },
  translation: function() {
    return Works.find({ work_id: this.translation_id });
  },
  languagePair: function() {
    return this.translation.source.concat(' ' + this.translation.target);
  }
});

if (Meteor.isServer) {
  Meteor.publish('alignments-by-work', function notesPublication(workId) {
    return Alignments.find({ work_id: workId });
  });
}

Alignments.attachSchema(Schemas.Alignment);
