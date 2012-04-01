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
    "locations/edit": "editLocation",
    "locations/create": "createLocation",
    "locations/:id": "show"
  },
  _toggleListClasses: function(){
    var $locations = $("#locations");
    $locations.find("li").toggleClass("arrow");
    $locations.find("span").toggleClass("hide");
    $locations.find("a").toggleClass("hide");
  },
  index: function(){
    this.before(function(){
      if (!app.fromEditView){
        app.fromEditView = false;
        app.showView(new LocationIndexView({collection: app.locations}));
      }
      app._toggleListClasses();
    });
  },
  show: function(id){
    this.before(function(){
      var location = app.locations.get(id);
      app.showView(new LocationView({model: location}));
    });
  },
  editLocation: function(){
    var $editButton = $("#edit-button");
    $editButton.toggleClass("active");
    app._toggleListClasses();
    if ($editButton.hasClass("active")){
      app.fromEditView = true;
      $editButton.attr("href", "");
    }
    else{
      $editButton.attr("href", "locations/edit");
    }
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
        app.navigate("", true);
        app.locations.fetch();
      },
      error: function(x){
        alert(x);
      }
    });
  },
  updateLocation: function(){
    alert(name);
    alert(address);
  },
  showView: function(view){
    if (this.currentView)
      this.currentView.close();
    $('#jqt').html(view.render().el);
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
    Template.loadTemplates(['index', 'show', 'location-list-item', 'new'], function(){
      app = new QuickNav();
      Backbone.history.start();
    });
  });
}