// Delegate Backbone Events - Backbone.js Plugin
// by Ian Storm Taylor
//
// Provides a delegateBackboneEvents() method that allows you to keep all of
// your event bindings in a `backboneEvents` hash instead of spread everywhere.
// Which makes it much easier to get a grasp on what events are being triggered
// where.

;(function (Backbone) {

    Backbone.View.prototype.delegateBackboneEvents =
    function delegateBackboneEvents(eventsDictionary) {

        eventsDictionary || (eventsDictionary = this.backboneEvents);

        for (var key in eventsDictionary) {

            var value = eventsDictionary[key],
                subject,
                event,
                method,
                context;

            var subjectRegex       = /^\w+\b/               ,
                subSubjectRegex    = /^(\w+)\.(\w+)\b/      ,
                eventRegex         = /(?:(?:^\w*\s)|^)(.+)$/,
                methodSubjectRegex = /^\w+\b/               ,
                methodMethodRegex  = /(?:\.)(\w+)\b/        ,
                methodRegex        = /^\w+\b/               ,
                contextRegex       = /\b\w+$/               ;

            // Figure out the key.
            // Space? then we got a subject other than this.
            if (/\s/.test(key)) {
                // Period? then we got a sub-subject.
                if (/\./.test(key)) {
                    var subSubject = subSubjectRegex.exec(key);

                    if (this[subSubject[1]] instanceof Backbone.Model) {
                        subject = this[subSubject[1]].attributes[subSubject[2]];
                    }
                    else {
                        subject = this[subSubject[1]][subSubject[2]];
                    }
                }
                else {
                    subject = this[subjectRegex.exec(key)[0]];
                }
            }
            else {
                subject = this;
            }

            // Event is all or everything after the first break.
            event = eventRegex.exec(key)[1].split(/\s/);

            // Figure out the value.
            // Make it an array, so we can always just iterate.
            if (typeof value === 'string') value = [value];

            for (var i = 0, string; string = value[i]; i++) {

                // Period? then we got a method not on this.
                if (/\./.test(string)) {

                    var methodSubject = this[methodSubjectRegex.exec(string)[0]],
                        methodMethod = methodMethodRegex.exec(string)[1];

                    if (methodSubject)
                        method = methodSubject[methodMethod];

                    // Space? then a context other than the subject.
                    if (/\s/.test(string)) {

                        context = contextRegex.exec(string)[0];

                        context = (context === 'this' ?
                            this : this[context]);
                    }
                    // Otherwise just use the subject as the context.
                    else {
                        context = methodSubject;
                    }
                }
                else {
                    // Simple method.
                    method = this[methodRegex.exec(string)[0]];

                    if (method === undefined) {
                        console.warn('Tried to bind to undefined method "' + methodRegex.exec(string)[0] + '".');
                    }

                    // Space? then there's a context other than this.
                    context = /\s/.test(string) ?
                        this[contextRegex.exec(string)[0]] : this;
                }

                // Bind it.
                if (subject && method && context) {

                    // Allow for binding a bunch of events.
                    for (var j = 0, ev; ev = event[j]; j++) {

                        subject.on(ev, method, context);
                    }
                }
            }
        }
    };

}(Backbone));