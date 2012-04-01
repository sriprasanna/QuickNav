window.NewLocationView = Backbone.View.extend({
  initialize: function(){
    this.template = _.template(Template.get('new'));
  },
  render: function(eventName){
    $(this.el).html(this.template());
    return this;
  }
});