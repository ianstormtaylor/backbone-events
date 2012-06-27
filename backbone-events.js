//     Backbone Events 0.0.1
//
//     by Ian Storm Taylor
//     https://github.com/ianstormtaylor/backbone-events
;(function (root, factory) {
  // Set up appropriately for the environment.
  /*global define */
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'backbone'], function(_, Backbone) {
      return factory(root, _);
    });
  }
  else {
    if (root.Backbone === undefined) throw new Error('Couldn\'t find Backbone');
    root.Backbone.mixin || (root.Backbone.mixin = {});
    root.Backbone.mixin.events = factory(root, root._, root.Backbone);
  }
})(this, function (root, _, Backbone) {

  return function () {

    // Augmenting `constructor` to delegate Backbone events right after
    // initializing.
    var _constructor = this.prototype.constructor;
    this.prototype.constructor = function () {
      _constructor.apply(this, arguments);
      this.delegateBackboneEvents();
    };

    // Delegates all Backbone events as passed in or as defined in `this.backboneEvents`.
    this.prototype.delegateBackboneEvents = function (events) {
      events || (events = this.backboneEvents) || (events = {});
      this._backboneEvents || (this._backboneEvents = []);
      this.undelegateBackboneEvents();

      for (var key in events) {
        // A regex to split commas with optional spaces around them.
        var commaSplitter = /\s*,\s*/;
        // A regex to split optional, dot-separated, properties.
        var propertySplitter = /(\w+)(\.(\w+))?/;
        var values, event, method,
            keys = key.split(commaSplitter),
            // Default subject and context to this.
            subject = this,
            context = this;

        // If we have a subject other than this...
        if (keys.length === 2) {
          // Split subject from sub-subjects.
          var subjs = propertySplitter.exec(keys[0]);
          subject = this[subjs[1]];
          // Special case to let models listen to their attributes. Useful only for view models, otherwise its reaching.
          if (subject instanceof Backbone.Model && subjs[3])
            subject = subject.attributes[subjs[3]];
        }

        // The event is either the only or second value, and we need one.
        event = keys.length === 1 ? keys[0] : keys[1];
        if (!event) throw new Error('Invalid event');

        // Iterate over values, binding each one to the subject + event. Make sure value is an array, so we can always just iterate.
        values = typeof events[key] === 'string' ? [events[key]] : events[key];
        for (var i = 0, value; value = values[i]; i++) {
          value = value.split(commaSplitter);
          // Split method-subject from method.
          var meths = propertySplitter.exec(value[0]);

          // Either a method on a subview or a method on this.
          if (this[meths[1]]) method = meths[3] ? this[meths[1]][meths[3]] : this[meths[1]];
          // No event found.
          if ((this[meths[1]] && meths[3] &&
               this[meths[1]][meths[3]] === undefined) ||
              (this[meths[1]] === undefined &&
               meths[3] === undefined))
            throw new Error('Cant find method');

          // If a context is passed in use it, otherwise if the method has a subject other than this use it's subject, otherwise use this.
          if (value[1] && this[value[1]] && value[1] !== 'this') context = this[value[1]];
          else if (meths[3] && this[meths[1]]) context = this[meths[1]];

          // Bind to each event in the list. Subjects and method/context subjects always fail silently so that events can be added to the dictionary even if the subject only gets created in certain cases. Otherwise, those cases would always require breaking out of the dictionary and then is isn't as useful because it doesn't hold all the events.
          if (subject && method && context) {
            subject.on(event, method, context);
            this._backboneEvents.push([subject, event, method, context]);
          }
        }
      }
    };

    // Undelegates all previously delegated Backbone events.
    this.prototype.undelegateBackboneEvents = function () {
      if (!this._backboneEvents || this._backboneEvents.length === 0) return;
      for (var i = 0, args; args = this._backboneEvents[i]; i++) {
        args[0].off(args[1], args[2], args[3]);
      }
    };
  };
});