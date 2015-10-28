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
Notes.attachSchema(Schemas.Note);
