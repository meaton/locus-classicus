Template.attribution.onCreated(function() {
  console.log('Template attribution created');
});

Template.attribution.helpers({
  hasDescription: function() {
    return this.description != null;
  },
  hasLicense: function() {
    return this.license != null;
  },
  isVisible: function() {
    return (this.description != null) || (this.license != null);
  }
})
