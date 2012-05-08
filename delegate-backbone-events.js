// Delegate Backbone Events - Backbone.js Plugin
// by Ian Storm Taylor
//
// Provides a delegateBackboneEvents() method that allows you to keep all of
// your event bindings in a `backboneEvents` hash instead of spread everywhere.
// Which makes it much easier to get a grasp on what events are being triggered
// where.

;(function (Backbone) {

  Backbone.Model.prototype.delegateBackboneEvents =
  Backbone.Collection.prototype.delegateBackboneEvents =
  Backbone.Router.prototype.delegateBackboneEvents =
  Backbone.View.prototype.delegateBackboneEvents =
  function delegateBackboneEvents(dict) {

    dict || (dict = this.backboneEvents);

    for (var key in dict) {

      var keys, values, subject, event, method, context;

      // A regex to split commas with optional spaces around them.
      var commaSplitter = /\s*,\s*/;

      // A regex to split optional, dot-separated, properties.
      var propertySplitter = /(\w+)(\.(\w+))?/;

      keys = key.split(commaSplitter);

      // Default subject.
      subject = this;

      // Subject other than this.
      if (keys.length === 2) {

        // Split subject from sub-subjects.
        var subjs = propertySplitter.exec(keys[0]);

        subject = this[subjs[1]];

        // Special case to let models listen to their attributes.
        // Useful only for view models, otherwise its reaching.
        if (subject instanceof Backbone.Model && subjs[3])
          subject = subject.attributes[subjs[3]];
      }

      // The event is either the only thing or the second value.
      event = keys.length === 1 ? keys[0] : keys[1];

      // We need an event.
      if (!event) throw new Error('Invalid event');

      // Make sure value is an array, so we can always just iterate.
      values = typeof dict[key] === 'string' ? [dict[key]] : dict[key];

      // Iterate over values, binding each one to the subject + event.
      for (var i = 0, value; value = values[i]; i++) {

        value = value.split(commaSplitter);

        // Split method-subject from method.
        var meths = propertySplitter.exec(value[0]);

        // Either a method on a subview or a method on this.
        method = meths[3] ? this[meths[1]][meths[3]] : this[meths[1]];

        // We need a method.
        if (!method) throw new Error('Invalid method');

        // If a context is passed in use it, otherwise if the method has a
        // subject other than this use it's subject, otherwise use this.
        if (value[1])
          context = value[1] === 'this' ? this : this[value[1]];
        else if (meths[3])
          context = this[meths[1]];
        else
          context = this;

        // We need a context.
        if (!context) throw new Error('Invalid context');

        // Bind to each event in the list. Subject is the only one that fails
        // silently so that events can be added to the dictionary even if the
        // subject only gets created in certain cases. Otherwise, those cases
        // would always require breaking out of the dictionary and then is isn't
        // as useful because it doesn't hold all the events.
        if (subject) subject.on(event, method, context);
      }
    }
  };

}(Backbone));