Buzz = new Mongo.Collection('buzz')

Meteor.startup(function(){
  console.log('client %s, cordova %s', Meteor.isClient, Meteor.isCordova)
})

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault("counter", 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get("counter");
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set("counter", Session.get("counter") + 1);

      Buzz.insert({ createdAt: Date.now()})
    }
  });

  Buzz.find({}).observe({
    added:function (doc) {
      console.log('BUZZ', doc)
      $('body').addClass('buzz')
      setTimeout(function () { $('body').removeClass('buzz')}, 500)


      //if (Meteor.isCordova) {
      //  console.log('buzz from cordova', navigator)
      //  navigator.notification.vibrate(1000)
      //}
    }
  })
}

if (Meteor.isCordova){
  Meteor.startup(function () {
    Buzz.find({}).observe({
      added:function (doc) {
        console.log('buzz from cordova', navigator)
        navigator.notification.vibrate(500)
      }
    })
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
