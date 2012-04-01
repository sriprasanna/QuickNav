Backbone.View.prototype.close = function () {
  if (this.beforeClose) {
    this.beforeClose();
  }
  this.remove();
  this.unbind();
};

var QuickNav = Backbone.Router.extend({
  routes: {
    "": "index",
    "locations/new": "newLocation",
    "locations/edit": "editLocations",
    "locations/create": "createLocation",
    "locations/:id": "show",
    "locations/:id/update": "updateLocation"
  },
  index: function(){
    this.before(function(){
      app.showView(new LocationIndexView({collection: app.locations}));
    });
  },
  show: function(id){
    this.before(function(){
      var location = app.locations.get(id);
      app.showView(new LocationView({model: location}));
    });
  },
  editLocations: function(){
    this.before(function(){
      app.showView(new LocationsEditView({collection: app.locations}));
    });
  },
  newLocation: function(){
    this.before(function(){
      app.showView(new NewLocationView());      
    });
  },
  createLocation: function(){
    var location = new Location({name: $("#name").val(), address: $("#address").val()});
    location.save([], {
      success: function(){
        app.locations.fetch();
        app.navigate("", true);
      },
      error: function(x){
        alert(x);
      }
    });
  },
  updateLocation: function(id){
    this.before(function(){
      var location = app.locations.get(id);
      location.set({
        name: $("#name").val(),
        address: $("#address").val()
      });
      location.save([], {
        success: function(){
          app.locations.fetch();
          app.navigate("#locations/edit", true);
        },
        error: function(x){
          alert(x);
        }
      });
    });
  },
  showView: function(view){
    if (this.currentView)
      this.currentView.close();
    var renderedHTML = $(view.render().el);
    $('#jqt').html(renderedHTML);
    this.currentView = view;
    return view;
  },
  before: function(callback){
    if (this.locations) {
      callback();
    }else{
      this.locations = new LocationCollection();
      this.locations.fetch({
        success: function(){
          callback();
        }
      });
    }
  }
});

function start(){
  var self = this;
  window.db = window.openDatabase("QuickNav", "1.0", "QuickNav DB", 200000);
  var locationDAO = new LocationDAO(self.db);
  locationDAO.populate(function(){
    Template.loadTemplates(['index', 'show', 'location-list-item', 'new', 'edit', 'location-edit-list-item'], function(){
      app = new QuickNav();
      Backbone.history.start();
    });
  });
}