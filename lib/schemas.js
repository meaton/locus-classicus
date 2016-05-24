Schemas = {}

Schemas.Chapter = new SimpleSchema({
  chapter_id: {
    type: String
  },
  title: {
    type: String
  },
  word_count: {
    type: Number,
    optional: true
  },
  sentence_count: {
    type: Number,
    optional: true
  }
});

Schemas.Section = new SimpleSchema({
  section_id: {
    type: String
  },
  word_count: {
    type: Number,
    optional: true
  },
  sentence_count: {
    type: Number,
    optional: true
  }
});

Schemas.Book = new SimpleSchema({
  book_id: {
    type: String
  },
  title: {
    type: String,
    optional: true
  },
  chapters: {
    type: [Schemas.Chapter],
    optional: true
  },
  sections: {
    type: [Schemas.Section],
    optional: true
  }
});

Schemas.Work = new SimpleSchema({
  work_id: {
    type: String
  },
  title: {
    type: String
  },
  lang: {
    type: String,
    min: 2,
    optional: true,
    defaultValue: "la"
  },
  author: {
    type: String,
    optional: true
  },
  contents: {
    type: [Schemas.Book],
    minCount: 1
  }
});

Schemas.Note = new SimpleSchema({
  note_id: {
    type: String
  },
  work_id: {
    type: String
  },
  lang: {
    type: String,
    min: 2,
    defaultValue: "da"
  },
  target: {
    type: String
  },
  cert: {
    type: String,
    defaultValue: "medium"
  },
  label: {
    type: String
  },
  body: {
    type: String
  },
  created_by: {
    type: String, // TODO: change to UserAccount
    optional: true
  },
  created_on: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date;
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date};
      } else {
        this.unset();
      }
    },
    denyUpdate: true,
    optional: true
  },
  last_updated: {
    type: Date,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true,
  },
  attached: {
    type: Boolean,
    optional: true,
    defaultValue: true
  }
});

Schemas.Translation = new SimpleSchema({
  source: {
    type: String,
    min: 2,
    defaultValue: 'la'
  },
  target: {
    type: String,
    min: 2,
    defaultValue: 'da'
  }
});

Schemas.Alignment = new SimpleSchema({
  alignment_id: {
    type: String
  },
  group_id: {
    type: String
  },
  work_id: {
    type: String
  },
  translation_id: {
    type: String
  },
  xtargets_source: {
    type: [String]
  },
  xtargets_target: {
    type: [String]
  },
  translation: {
    type: Schemas.Translation
  }
});
