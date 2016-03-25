var AppView = Backbone.View.extend({

    el: '#container',
    intitialize: function(){
        this.render();
    },
    render: function(){
        this.$el.html("Hello World")
    }


})

var appView = new AppView();



