function loadFixture(fixtures, collection, callback) {
  _.each(fixtures, function(fixture) {
    check(collection.simpleSchema().clean(fixture), collection.simpleSchema());
    console.log('fixture data: ', fixture);
    var workId = fixture.work_id;
    console.log('fixture workId: ' + workId);
    collection.insert(fixture, function(error, result) {
      if(error) console.error(error);
      if(result) {
        console.log('data added: ', result);
        if(callback && workId != undefined) {
          console.log('callback workId: ' + workId);
          callback(workId);
        }
      }
    });
  });
};

Meteor.startup(function () {
  console.log('starting up..');
  /* package: http */
  var restpath = Meteor.settings.exist.protocol + "://" + Meteor.settings.exist.host + ":" + Meteor.settings.exist.port + Meteor.settings.exist.restpath;
  var json = HTTP.call("GET", restpath  + "/works/fixture", { auth: 'admin:admin', headers: { Accept: 'application/json' } }).data;
  var notes = [];

  if(json) {
    var result = (_.isArray(json.work)) ? json.work : [json.work];
    result = _.map(result, function(work) {

      work.contents = (_.isArray(work.contents.book)) ? work.contents.book : [work.contents.book];
      work.contents = _.map(work.contents, function(book) {
        if(book.sections) book.sections = (_.isArray(book.chapters.chapter)) ? book.chapters.chapter : [book.chapters.chapter]; 
        if(book.chapters) book.chapters = (_.isArray(book.chapters.chapter)) ? book.chapters.chapter : [book.chapters.chapter];
        return book;
      });

      return work;
    });

    /* init load TEI text data */
    //console.log('result', result);
    if(Works.find({}).count() == 0) {
      console.info('startup:: adding fixture data...');

      loadFixture(result, Works, function(workId) {
        /* init load TEI notes data */
        console.log('restpath: ' + restpath);
        console.log('workId: ' + workId);

        var notes = HTTP.call("GET", restpath + "/work/" + workId + "/notes", { auth: 'admin:admin', headers: { Accept: 'application/json' } }).data;
        console.log('notes: ' + notes);

        if(notes && Notes.find({ work_id: workId }).count() == 0) {
          var notesToAdd = (_.isArray(notes.note)) ? notes.note : [notes.note];
          console.info('startup:: adding notes (' + notesToAdd.length + ') for work ', workId);
          loadFixture(notesToAdd, Notes);
        }

        /* init linking data - xtargets */
        var alignments = HTTP.call("GET", restpath + "/work/" + workId + "/alignments", { auth: 'admin:admin', headers: { Accept: 'application/json' } }).data;
        console.log('alignments: ' + alignments);

        if(alignments && Alignments.find({ work_id: workId }).count() == 0) {
          var linkGrps = (_.isArray(alignments.linkGrp)) ? alignments.linkGrp : [alignments.linkGrp];
          linkGrps = _.map(linkGrps, function(linkGrp) {
            linkGrp.alignments = _.map(linkGrp.alignments.alignment, function(alignment) {

              alignment['group_id'] = linkGrp.group_id;
              alignment['translation'] = new Object();
              alignment['translation'].source = linkGrp.lang_source;
              alignment['translation'].target = linkGrp.lang_target;

              if(!_.isArray(alignment['xtargets_source'])) alignment['xtargets_source'] = [alignment['xtargets_source']];
              if(!_.isArray(alignment['xtargets_target'])) alignment['xtargets_target'] = [alignment['xtargets_target']];

              return alignment;
            });
            return linkGrp;
          });

          _.each(linkGrps, function(linkGrp) {
            if(Alignments.find({ group_id: linkGrp.group_id } ).count() == 0) {
              console.info('startup:: adding alignments for group ' + linkGrp.group_id + ' (' + linkGrp.alignments.length + ') for work ', workId);
              loadFixture(linkGrp.alignments, Alignments);
            }
          });
        }
      });
    }
  }
});
