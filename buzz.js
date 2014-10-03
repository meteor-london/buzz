Buzz = new Mongo.Collection('buzz')

if (Meteor.isClient) {
  Meteor.subscribe('buzzez-from-now')

  // counter starts at 0
  Session.setDefault("counter", 0)

  Template.hello.helpers({
    counter: function () {
      return Session.get("counter")
    }
  })

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set("counter", Session.get("counter") + 1)
      Buzz.insert({ createdAt: Date.now()})
    }
  })

  Meteor.startup(function(){
    Buzz.find({}).observe({
      added:function (doc) {

        console.log('BUZZ', doc)
        $('body').addClass('buzz')
        setTimeout(function () { $('body').removeClass('buzz')}, 500)

        if (Meteor.isCordova){
          navigator.notification.vibrate(500)
        }
      }
    })
  })
}

if (Meteor.isServer) {
  Meteor.publish('buzzez-from-now', function () {
    return Buzz.find({ createdAt: { $gte: Date.now() }})
  })
}