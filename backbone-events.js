//     Backbone Events 0.0.1
//
//     by Ian Storm Taylor
//     https://github.com/ianstormtaylor/backbone-events
;(function (_, Backbone) {
  if (_ === undefined) throw new Error('Couldn\'t find Underscore');
  if (Backbone === undefined) throw new Error('Couldn\'t find Backbone');

  Backbone.mixin || (Backbone.mixin = {});
  Backbone.mixin.events = function () {

    // A regex to split commas with optional spaces around them.
    var commaSplitter = /\s*,\s*/;
    // A regex to split dot-separated, properties.
    var propertySplitter = /\./g;

    // Delegates all Backbone events as passed in or as defined in
    // `this.backboneEvents`.
    this.prototype.delegateBackboneEvents = function (events) {
      events || (events = this.backboneEvents) || (events = {});
      this._backboneEvents || (this._backboneEvents = []);
      this.undelegateBackboneEvents();

      for (var key in events) {
        var keys   = key.split(commaSplitter);
        var values = typeof events[key] === 'string' ? [events[key]] : events[key];


        // Event
        // -----

        var event = keys[keys.length-1];
        if (event === undefined) throw new Error('Invalid event: ' + key);


        // Subject
        // -------

        var subject = this;
        // If we have a subject other than this...
        if (keys.length === 2) {
          // Split up sub-subjects. Recursively travel down properties, and allow
          // for the properties actually being inside a Model's `attributes`.
          var subjects = keys[0].split(propertySplitter);
          for (var l = 0, subsubject; subsubject = subjects[l]; l++) {
            subject = !subject[subsubject] && subject.get ? subject.get(subsubject) : subject[subsubject];
          }
        }

        // Iterate over values, binding each one to the subject + event.
        for (var i = 0, value; value = values[i]; i++) {
          value = value.split(commaSplitter);


          // Method
          // ------

          var methods = value[0].split(propertySplitter);
          // Either a method on a subview or a method on this.
          var method = methods[1] ? this[methods[0]][methods[1]] : this[methods[0]];
          if (method === undefined) throw new Error('Cant find method: ' + value[0]);


          // Context
          // -------

          var context = this;
          // If a context is passed in use it, otherwise if the method has a
          // subject other than this use it's subject, otherwise use this.
          if (value[1] && this[value[1]] && value[1] !== 'this') context = this[value[1]];
          else if (methods[1] && this[methods[0]]) context = this[methods[0]];


          // Bind
          // ----

          // Bind to each event in the list. Subjects always fail silently so
          // that events can be added to the dictionary even if the subject only
          // gets created in certain cases. Otherwise, those cases would always
          // require breaking out of the dictionary and then it isn't as useful
          // because it doesn't hold all your events nicely.
          if (subject) {
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
}(_, Backbone));