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

Alignments.attachSchema(Schemas.Alignment);
