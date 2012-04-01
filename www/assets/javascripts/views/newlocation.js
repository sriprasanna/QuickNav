window.NewLocationView = Backbone.View.extend({
  id: "new",
  className: "current", //"current slideup in",
  initialize: function(){
    this.template = _.template(Template.get('new'));
  },
  render: function(eventName){
    $(this.el).html(this.template());
    return this;
  }
});