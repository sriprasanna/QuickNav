window.LocationsEditView = Backbone.View.extend({
  id: "edit",
  className: "current", //"current slideup in",
  initialize: function(){
    this.template = _.template(Template.get('edit'));
    this.collection.bind("reset", this.render, this);
    this.collection.bind("add", function(location){
      $(this.el).append(new LocationEditListItemView({model: location}).render().el);
    });
  },
  render: function(eventName){
    $(this.el).html(this.template());
    var ul = $('ul', $(this.el));
    _.each(this.collection.models, function(location){
      ul.append(new LocationEditListItemView({model: location}).render().el);
    }, this);
    return this;
  }
});

window.LocationEditListItemView = Backbone.View.extend({
  tagName: 'li',
  className: 'arrow',
  initialize: function(){
    this.template = _.template(Template.get('location-edit-list-item'));
    this.model.bind("change", this.render, this);
    this.model.bind("destroy", this.render, this);
  },
  render: function(eventName){
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  }
});