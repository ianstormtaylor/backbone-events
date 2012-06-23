// Delegate Backbone Events - Backbone.js Plugin
// by Ian Storm Taylor
//
// Provides `delegateBackboneEvents()` and `undelegateBackboneEvents()` methods so you can keep all of your event bindings in a `backboneEvents` hash instead of spread everywhere. Which makes it much easier to get a grasp on what events are being triggered where.

;(function (Backbone) {

  Backbone.Model.prototype.delegateBackboneEvents =
  Backbone.Collection.prototype.delegateBackboneEvents =
  Backbone.Router.prototype.delegateBackboneEvents =
  Backbone.View.prototype.delegateBackboneEvents =
  function delegateBackboneEvents(dict) {

    dict || (dict = this.backboneEvents);

    this._backboneEvents || (this._backboneEvents = []);

    this.undelegateBackboneEvents();

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
        if (this[meths[1]])
          method = meths[3] ? this[meths[1]][meths[3]] : this[meths[1]];

        if ((this[meths[1]] &&
             meths[3] &&
             this[meths[1]][meths[3]] === undefined) ||
            (this[meths[1]] === undefined &&
             meths[3] === undefined))
          throw new Error('Cant find method');

        // Default context.
        context = this;

        // If a context is passed in use it, otherwise if the method has a
        // subject other than this use it's subject, otherwise use this.
        if (value[1] && value[1] === 'this')
          context = this;
        else if (value[1] && this[value[1]])
          context = this[value[1]];
        else if (meths[3] && this[meths[1]])
          context = this[meths[1]];

        // Bind to each event in the list. Subjects and method/context subjects
        // always fail silently so that events can be added to the dictionary
        // even if the subject only gets created in certain cases. Otherwise, // those cases would always require breaking out of the dictionary and
        // then is isn't as useful because it doesn't hold all the events.
        if (subject && method && context) {
          subject.on(event, method, context);
          this._backboneEvents.push([subject, event, method, context]);
        }
      }
    }
  };

  Backbone.Model.prototype.undelegateBackboneEvents =
  Backbone.Collection.prototype.undelegateBackboneEvents =
  Backbone.Router.prototype.undelegateBackboneEvents =
  Backbone.View.prototype.undelegateBackboneEvents =
  function undelegateBackboneEvents() {

    if (!this._backboneEvents || this._backboneEvents.length === 0) return;

    // Loop over the stored bindings and call subject.off()
    for (var i = 0, args; args = this._backboneEvents[i]; i++) {
      args[0].off(args[1], args[2], args[3]);
    }
  };

}(Backbone));