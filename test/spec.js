// All the testing classes.
var TestCollection = Backbone.Collection.extend({
  method : function () {}
});

var TestModel = Backbone.Model.extend({
  initialize : function () {
    this.attributes.collection = new TestCollection();
  },
  method : function () {}
});

var TestRouter = Backbone.Router.extend({
  method : function () {}
});

var TestView = Backbone.View.extend({
  constructor : function (options) {
    Backbone.View.prototype.constructor.apply(this, arguments);
    _.extend(this.backboneEvents, options.backboneEvents);
    this.delegateBackboneEvents();
  },
  initialize : function () {
    this.view   = new TestSubView();
    this.model  = new TestModel();
    this.router = new TestRouter();
  },
  backboneEvents : {},
  method : function () {}
});

var TestSubView = Backbone.View.extend({
  initialize : function () {
    this.view  = new TestSubSubView();
    this.model = new TestModel();
  },
  method : function () {}
});

var TestSubSubView = Backbone.View.extend({
  method : function () {}
});




module('event', {
  setup : function () {
    this.view = new TestView({
      backboneEvents : {
        'event1' : 'method',
        'event2' : 'method, view',
        'event3' : 'view.method',
        'event4' : 'view.method, this',
        'event5' : 'view.method, model'
      }
    });
  }
});

test('method', function () {

  ok(this.view._callbacks.event1 !== undefined,
    'subject and event are set');
  ok(this.view._callbacks.event1.next.callback === this.view.method,
    'method is set');
  ok(this.view._callbacks.event1.next.context === this.view,
    'context is set');
});

test('method context', function () {

  ok(this.view._callbacks.event2 !== undefined,
    'subject and event are set');
  ok(this.view._callbacks.event2.next.callback === this.view.method,
    'method is set');
  ok(this.view._callbacks.event2.next.context === this.view.view,
    'context is set');
});

test('subview.method', function () {

  ok(this.view._callbacks.event3 !== undefined,
    'subject and event are set');
  ok(this.view._callbacks.event3.next.callback === this.view.view.method,
    'method is set');
  ok(this.view._callbacks.event3.next.context === this.view.view,
    'context is set');
});

test('subview.method context(this)', function () {

  ok(this.view._callbacks.event4 !== undefined,
    'subject and event are set');
  ok(this.view._callbacks.event4.next.callback === this.view.view.method,
    'method is set');
  ok(this.view._callbacks.event4.next.context === this.view,
    'context is set');
});

test('subview.method context', function () {

  ok(this.view._callbacks.event5 !== undefined,
    'subject and event are set');
  ok(this.view._callbacks.event5.next.callback === this.view.view.method,
    'method is set');
  ok(this.view._callbacks.event5.next.context === this.view.model,
    'context is set');
});






module('subview event', {
  setup : function () {
    this.view = new TestView({
      backboneEvents : {
        'view, event1' : 'method',
        'view, event2' : 'method, view',
        'view, event3' : 'view.method',
        'view, event4' : 'view.method, this',
        'view, event5' : 'view.method, model'
      }
    });
  }
});

test('method', function () {

  ok(this.view.view._callbacks.event1 !== undefined,
    'subject and event are set');
  ok(this.view.view._callbacks.event1.next.callback === this.view.method,
    'method is set');
  ok(this.view.view._callbacks.event1.next.context === this.view,
    'context is set');
});

test('method context', function () {

  ok(this.view.view._callbacks.event2 !== undefined,
    'subject and event are set');
  ok(this.view.view._callbacks.event2.next.callback === this.view.method,
    'method is set');
  ok(this.view.view._callbacks.event2.next.context === this.view.view,
    'context is set');
});

test('subview.method', function () {

  ok(this.view.view._callbacks.event3 !== undefined,
    'subject and event are set');
  ok(this.view.view._callbacks.event3.next.callback === this.view.view.method,
    'method is set');
  ok(this.view.view._callbacks.event3.next.context === this.view.view,
    'context is set');
});

test('subview.method context(this)', function () {

  ok(this.view.view._callbacks.event4 !== undefined,
    'subject and event are set');
  ok(this.view.view._callbacks.event4.next.callback === this.view.view.method,
    'method is set');
  ok(this.view.view._callbacks.event4.next.context === this.view,
    'context is set');
});

test('subview.method context', function () {

  ok(this.view.view._callbacks.event5 !== undefined,
    'subject and event are set');
  ok(this.view.view._callbacks.event5.next.callback === this.view.view.method,
    'method is set');
  ok(this.view.view._callbacks.event5.next.context === this.view.model,
    'context is set');
});






module('submodel.attribute event', {
  setup : function () {
    this.view = new TestView({
      backboneEvents : {
        'model.collection, event1' : 'method',
        'model.collection, event2' : 'method, view',
        'model.collection, event3' : 'view.method',
        'model.collection, event4' : 'view.method, this',
        'model.collection, event5' : 'view.method, model'
      }
    });
  }
});

test('method', function () {

  ok(this.view.model.get('collection')._callbacks.event1 !== undefined,
    'subject and event are set');
  ok(this.view.model.get('collection')._callbacks.event1.next.callback === this.view.method,
    'method is set');
  ok(this.view.model.get('collection')._callbacks.event1.next.context === this.view,
    'context is set');
});

test('method context', function () {

  ok(this.view.model.get('collection')._callbacks.event2 !== undefined,
    'subject and event are set');
  ok(this.view.model.get('collection')._callbacks.event2.next.callback === this.view.method,
    'method is set');
  ok(this.view.model.get('collection')._callbacks.event2.next.context === this.view.view,
    'context is set');
});

test('subview.method', function () {

  ok(this.view.model.get('collection')._callbacks.event3 !== undefined,
    'subject and event are set');
  ok(this.view.model.get('collection')._callbacks.event3.next.callback === this.view.view.method,
    'method is set');
  ok(this.view.model.get('collection')._callbacks.event3.next.context === this.view.view,
    'context is set');
});

test('subview.method context(this)', function () {

  ok(this.view.model.get('collection')._callbacks.event4 !== undefined,
    'subject and event are set');
  ok(this.view.model.get('collection')._callbacks.event4.next.callback === this.view.view.method,
    'method is set');
  ok(this.view.model.get('collection')._callbacks.event4.next.context === this.view,
    'context is set');
});

test('subview.method context', function () {

  ok(this.view.model.get('collection')._callbacks.event5 !== undefined,
    'subject and event are set');
  ok(this.view.model.get('collection')._callbacks.event5.next.callback === this.view.view.method,
    'method is set');
  ok(this.view.model.get('collection')._callbacks.event5.next.context === this.view.model,
    'context is set');
});