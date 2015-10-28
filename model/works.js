Works = new Mongo.Collection("works");
Works.attachSchema(Schemas.Work);

if (Meteor.isServer) {
  Works.allow({
  insert: function(){
    return true;
  },
  update: function () {
    return true;
  },
  remove: function(){
    return true;
  }
});
}
