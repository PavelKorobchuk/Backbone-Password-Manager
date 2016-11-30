


    'use strict'
        var userList = [];
         (function getPassList (){
            if (localStorage.length > 0) {
               for(var i in localStorage){
                  var val = localStorage.getItem(i); 
                  var parseStorage = JSON.parse(val);
                  userList.push(parseStorage)  
            }
        } 
})();

    var User = Backbone.Model.extend({
        defaults: {
            email: "",
            password: "",
            numb:""
        }
    });
    //create collection
    var Directory = Backbone.Collection.extend({
        model: User
    });

    //create single element
    var UserView = Backbone.View.extend({
        tagName: "section",
        className: "user_list-container",
        template: _.template($("#userTemplate").html()),
        editTemplate: _.template($("#userEditTemplate").html()),
        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        events: {
            "click button.delete": "deleteUser",
            "click button.edit": "editUser",
            "click button.save": "saveEdits",
            "click button.cancel": "cancelEdit"
        },

        deleteUser: function () {
            this.model.destroy();
            this.remove();
        },
         editUser: function () {
            this.$el.html(this.editTemplate(this.model.toJSON()));
            this.$el.find("input[type='hidden']").remove();
        },
           saveEdits: function (e) {
            e.preventDefault();
            var formData = {},
            prev = this.model.previousAttributes();
            $(e.target).closest("form").find(":input").not("button").each(function () {
                var el = $(this);
                formData[el.attr("class")] = el.val();
            });
              var newNote = JSON.stringify(formData);
              localStorage.setItem(formData.numb, newNote);
            this.model.set(formData);
            this.render();
            _.each(userList, function (user) {
                if (_.isEqual(user, prev)) {
                    userList.splice(_.indexOf(userList, user), 1, formData);
                }
            });
        },
        cancelEdit: function () {
            this.render();
        }
    });

 var DirectoryHome = Backbone.View.extend({
     el: $("#users"),
      homeTemplate: _.template($("#homeTemplate").html()),
      initialize: function () {
      this.render();
      },
      render: function () {
            this.$el.html(this.homeTemplate);
            return this;
        },
         events: {
            "click #reg": "addUser",
            "click #sign": "logUser"
      
        },
        logUser: function(e){
        e.preventDefault();
          var formData = {};
            $(e.target).closest("form").find(":input").not("button").each(function () {
                var el = $(this);
                formData[el.attr("class")] = el.val();
            });
            
             
             if (localStorage.getItem(formData.email) === null) {
             alert('user not found')
             } else {
                 r.navigate("list", {trigger: true});
             var isUser = JSON.parse(localStorage.getItem(formData.email));
             if (isUser.password == formData.password) {
                 $("#users").html(''); 
                 var directory = new DirectoryView();
             }
             }
            
        },
        addUser: function(e){
            e.preventDefault();
            var formData = {};
               $("#addUser").children("input").each(function (i, el) {
                if ($(el).val() !== "") {
                    formData[el.id] = $(el).val();
                }
            });
            var newNote = {
                 numb: localStorage.length,
                 email: formData.email,
                 password: formData.password
             }
              var newNoteNote = JSON.stringify(newNote);
              localStorage.setItem(newNote.email, newNoteNote);
        }
 });
    //create parent view
    var DirectoryView = Backbone.View.extend({
        el: $("#users"),
        headerTemplate: _.template($("#headerTemplate").html()),
        initialize: function () {
            this.collection = new Directory(userList);
            this.render();
            this.collection.on("reset", this.render, this);
            this.collection.on("add", this.renderUser, this);
            this.collection.on("remove", this.removeUser, this);
        },

        render: function () {
            this.$el.html(this.headerTemplate);
            this.$el.find("section").remove();

            _.each(this.collection.models, function (item) {
                this.renderUser(item);
            }, this);
        },

        renderUser: function (item) {
            var userView = new UserView({
                model: item
            });
            this.$el.append(userView.render().el);
        },

        //add ui events
        events: {
            "click #add": "addUser"
      
        },
    
        //create new user
        addUser: function (e) {
            e.preventDefault();
            var formData = {};
            $("#addUser").children("input").each(function (i, el) {
                if ($(el).val() !== "") {
                    formData[el.id] = $(el).val();
                }
            });
            userList.push(formData);
            this.collection.add(new User(formData));  
             var newNote = {
                 numb: localStorage.length,
                 email: formData.email,
                 password: formData.password
             }
              var newNoteNote = JSON.stringify(newNote);
              localStorage.setItem(newNote.email, newNoteNote);
        },
        removeUser: function (removedModel) {
            var removed = removedModel.attributes;
             localStorage.removeItem(removed.email);
            _.each(userList, function (user) {
                if (_.isEqual(user, removed)) {
                    userList.splice(_.indexOf(userList, user), 1);
                }
            });

        },
    });

   
    var ContactsRouter = Backbone.Router.extend({
        routes: {
            
            'list': 'list'
        },
        list: function(){

        }
    });

    var home = new DirectoryHome()

    //create router instance
    var r = new ContactsRouter();

   Backbone.history.start();

