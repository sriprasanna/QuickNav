window.LocationView = Backbone.View.extend({
  initialize: function(){
    this.template = _.template(Template.get('show'));
  },
  render: function(eventName){
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  }
});