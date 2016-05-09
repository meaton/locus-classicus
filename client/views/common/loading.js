Template.loading.onRendered(function() {
  console.log('loading template rendered')
  this.$('p.loading').delay(500).fadeIn(50);
});
