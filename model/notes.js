Notes = new Mongo.Collection("notes");
Notes.helpers({
  work: function() {
    return Works.find({ work_id: this.work_id });
  }
  /*,
  owner: function() {
    return Meteor.users.findOne(this.created_by)
  }*/
});

if (Meteor.isServer) {
  Meteor.publish('notes-by-work', function notesPublication(workId) {
    return Notes.find({ work_id: workId });
  });
}

Notes.attachSchema(Schemas.Note);
