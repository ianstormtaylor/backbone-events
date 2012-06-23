/*global Backbone, _, sinon, suite, beforeEach, test, expect */

(function () {

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



  suite('event');
  beforeEach(function () {
    this.view = new TestView({
      backboneEvents : {
        'event1' : 'method',
        'event2' : 'method, view',
        'event3' : 'view.method',
        'event4' : 'view.method, this',
        'event5' : 'view.method, model'
      }
    });
  });

  // method
  test('method:subject and event are set', function () {
    expect(this.view._callbacks.event1).to.exist;
  });
  test('method:method is set', function () {
    expect(this.view._callbacks.event1.next.callback).to.be(this.view.method);
  });
  test('method:context is set', function () {
    expect(this.view._callbacks.event1.next.context).to.be(this.view);
  });

  // method context
  test('method context:subject and event are set', function () {
    expect(this.view._callbacks.event2).to.exist;
  });
  test('method context:method is set', function () {
    expect(this.view._callbacks.event2.next.context).to.be(this.view.method);
  });
  test('method context:context is set', function () {
    expect(this.view._callbacks.event2.next.context).to.be(this.view.view);
  });

  // subview.method
  test('subview.method:subject and event are set', function () {
    expect(this.view._callbacks.event3).to.exist;
  });
  test('subview.method:method is set', function () {
    expect(this.view._callbacks.event3.next.context).to.be(this.view.view.method);
  });
  test('subview.method:context is set', function () {
    expect(this.view._callbacks.event3.next.context).to.be(this.view.view);
  });

  // subview.method context(this)
  test('subview.method context(this):subject and event are set', function () {
    expect(this.view._callbacks.event4).to.exist;
  });
  test('subview.method context(this):method is set', function () {
    expect(this.view._callbacks.event4.next.context).to.be(this.view.view.method);
  });
  test('subview.method context(this):context is set', function () {
    expect(this.view._callbacks.event4.next.context).to.be(this.view);
  });

  // subview.method
  test('subview.method context:subject and event are set', function () {
    expect(this.view._callbacks.event5).to.exist;
  });
  test('subview.method context:method is set', function () {
    expect(this.view._callbacks.event5.next.context).to.be(this.view.view.method);
  });
  test('subview.method context:context is set', function () {
    expect(this.view._callbacks.event5.next.context).to.be(this.view.model);
  });




  suite('subview event');
  beforeEach(function () {
    this.view = new TestView({
      backboneEvents : {
        'view, event1' : 'method',
        'view, event2' : 'method, view',
        'view, event3' : 'view.method',
        'view, event4' : 'view.method, this',
        'view, event5' : 'view.method, model'
      }
    });
  });

  // method
  test('method:subject and event are set', function () {
    expect(this.view.view._callbacks.event1).to.exist;
  });
  test('method:method is set', function () {
    expect(this.view.view._callbacks.event1.next.callback).to.be(this.view.method);
  });
  test('method:context is set', function () {
    expect(this.view.view._callbacks.event1.next.context).to.be(this.view);
  });

  // method context
  test('method context:subject and event are set', function () {
    expect(this.view.view._callbacks.event2).to.exist;
  });
  test('method context:method is set', function () {
    expect(this.view.view._callbacks.event2.next.callback).to.be(this.view.method);
  });
  test('method context:context is set', function () {
    expect(this.view.view._callbacks.event2.next.context).to.be(this.view.view);
  });

  // subview.method
  test('subview.method:subject and event are set', function () {
    expect(this.view.view._callbacks.event3).to.exist;
  });
  test('subview.method:method is set', function () {
    expect(this.view.view._callbacks.event3.next.callback).to.be(this.view.view.method);
  });
  test('subview.method:context is set', function () {
    expect(this.view.view._callbacks.event3.next.context).to.be(this.view.view);
  });

  // subview.method context(this)
  test('subview.method context(this):subject and event are set', function () {
    expect(this.view.view._callbacks.event4).to.exist;
  });
  test('subview.method context(this):method is set', function () {
    expect(this.view.view._callbacks.event4.next.callback).to.be(this.view.view.method);
  });
  test('subview.method context(this):context is set', function () {
    expect(this.view.view._callbacks.event4.next.context).to.be(this.view);
  });

  // subview.method
  test('subview.method context:subject and event are set', function () {
    expect(this.view.view._callbacks.event5).to.exist;
  });
  test('subview.method context:method is set', function () {
    expect(this.view.view._callbacks.event5.next.callback).to.be(this.view.view.method);
  });
  test('subview.method context:context is set', function () {
    expect(this.view.view._callbacks.event5.next.context).to.be(this.view.model);
  });




  suite('submodel.attribute event');
  beforeEach(function () {
    this.view = new TestView({
      backboneEvents : {
        'model.collection, event1' : 'method',
        'model.collection, event2' : 'method, view',
        'model.collection, event3' : 'view.method',
        'model.collection, event4' : 'view.method, this',
        'model.collection, event5' : 'view.method, model'
      }
    });
  });

  // method
  test('method:subject and event are set', function () {
    expect(this.view.model.get('collection')._callbacks.event1).to.exist;
  });
  test('method:method is set', function () {
    expect(this.view.model.get('collection')._callbacks.event1.next.callback).to.be(this.view.method);
  });
  test('method:context is set', function () {
    expect(this.view.model.get('collection')._callbacks.event1.next.context).to.be(this.view);
  });

  // method context
  test('method context:subject and event are set', function () {
    expect(this.view.model.get('collection')._callbacks.event2).to.exist;
  });
  test('method context:method is set', function () {
    expect(this.view.model.get('collection')._callbacks.event2.next.callback).to.be(this.view.method);
  });
  test('method context:context is set', function () {
    expect(this.view.model.get('collection')._callbacks.event2.next.context).to.be(this.view.view);
  });

  // subview.method
  test('subview.method:subject and event are set', function () {
    expect(this.view.model.get('collection')._callbacks.event3).to.exist;
  });
  test('subview.method:method is set', function () {
    expect(this.view.model.get('collection')._callbacks.event3.next.callback).to.be(this.view.view.method);
  });
  test('subview.method:context is set', function () {
    expect(this.view.model.get('collection')._callbacks.event3.next.context).to.be(this.view.view);
  });

  // subview.method context(this)
  test('subview.method context(this):subject and event are set', function () {
    expect(this.view.model.get('collection')._callbacks.event4).to.exist;
  });
  test('subview.method context(this):method is set', function () {
    expect(this.view.model.get('collection')._callbacks.event4.next.callback).to.be(this.view.view.method);
  });
  test('subview.method context(this):context is set', function () {
    expect(this.view.model.get('collection')._callbacks.event4.next.context).to.be(this.view);
  });

  // subview.method
  test('subview.method context:subject and event are set', function () {
    expect(this.view.model.get('collection')._callbacks.event5).to.exist;
  });
  test('subview.method context:method is set', function () {
    expect(this.view.model.get('collection')._callbacks.event5.next.callback).to.be(this.view.view.method);
  });
  test('subview.method context:context is set', function () {
    expect(this.view.model.get('collection')._callbacks.event5.next.context).to.be(this.view.model);
  });




  suite('undelegate');
  beforeEach(function () {
    this.view = new TestView({
      backboneEvents : {
        'event1' : 'method',
        'event2' : 'method, view',
        'event3' : 'view.method',
        'event4' : 'view.method, this',
        'event5' : 'view.method, model'
      }
    });
  });

  test('should be able to unbind events with undelegate', function () {
    var callbacks = this.view._callbacks;
    expect(_.size(callbacks)).to.be(5);
    this.view.undelegateBackboneEvents();
    expect(_.size(callbacks)).to.be(0);
  });

  test('should be able to rebind undelegated events', function () {
    var callbacks = this.view._callbacks;
    this.view.undelegateBackboneEvents();
    expect(_.size(callbacks)).to.be(0);
    this.view.delegateBackboneEvents();
    expect(_.size(callbacks)).to.be(5);
  });

  test('should not double-bind events when delegate called twice', function () {
    var callbacks = this.view._callbacks;
    expect(callbacks.event1.next.callback).to.exist;
    this.view.delegateBackboneEvents();
    expect(callbacks.event1.next.callback).to.exist;
    expect(callbacks.event1.next.next.callback).not.to.exist;
  });



}());



