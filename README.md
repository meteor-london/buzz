# Meteor Buzz

**A Meteor / Cordova livecoding experiment for Meteor London**

The Meteor [History.md][1] file is awash with gems. New features bubble into
existence like real-time quantum soup, and this file provides a terse run down
of all the latest goodies as they appear:

https://github.com/meteor/meteor/blob/devel/History.md

A perusal shows that with the [0.9.2 release](https://github.com/meteor/meteor/blob/devel/History.md#v092)
a collection of new command line incantations are available to turn your web
apps into fully-fledged, handset-bothering, android & iOS native apps, via the
magic of [Cordova][2].

Following the link to the [Meteor / Cordova integration wiki page][3] we find a
pretty thorough getting started guide, so let's try it out.

**Let's build an app.** Something simple, but real-time and doing something
that's only possible for native apps, beyond the reach of current web-apis.

How about a curious trust experiment in remote vibration?

I can't make a web browser vibrate just yet, but phones seem to do it all the
time. How about a button that anyone in the world can press that'll make my phone
vibrate? **Let's build a button that no one should ever press.**

Command lines at the ready? Then let's begin:

Scaffold out a new meteor app:
```
 meteor create buzz
```

Add android support:
```
 meteor add-platform android
```

Wowzers. That downloads half the internet, but it's the half that makes native
app development possible, and meteor configures it all for you, so it's a good
thing. There's also the butt ugly download logging and license agreement, but I
reckon that'll get better. It gets the job done and its an order of magnitude
easier than setting it all up yourself.

Update the app code to include a global collection called `Buzz` that will store
a record of each button press.

```javascript
Buzz = new Mongo.Collection('buzz')

Template.hello.events({
  'click button': function () {
    Session.set("counter", Session.get("counter") + 1);

    // Record the time the button was pressed
    Buzz.insert({ createdAt: Date.now() })
  }
});
```

Now we can `observe` that collection and whenever a new buzz record is added
it should make my phone vibrate...

```javascript
if (Meteor.isCordova) {

  Meteor.startup(function () {

    Buzz.find({}).observe({
      added: function (doc) {
        // How to do a vibrate?
      }
    })

  })
}
```

So as a web developer, vibrating a handset is an alien concept to me. It's not a
case of using css animation to float the div left and right as fast as you can
re-paint all the things; I've got no frame of reference here.

**DONT PANIC**

That's what [Cordova][2] is for. It translates all those weird device specific
apis into something familiar and javascripty. While we wait for Mozilla's
sterling work in the field of creating web-apis for all the things we have to
live with the beautiful [transitional stop gap][5] of Cordova plugins. So the
process of adding native features to your web app is:

1. Go to: http://plugins.cordova.io
2. Find a Cordova plugin that does what you want.
3. There is no step 3.

Searching for `vibration` on the Cordova plugin registry, we find:

```
org.apache.cordova.vibration
This plugin provides a way to vibrate the device.
```
http://plugins.cordova.io/#/package/org.apache.cordova.vibration

Boom! That's what we want.

Step 3 was a lie. We still need to instruct meteor to make this new plugin
available in our app, but that's a simple case of prefixing the
plugin id with `cordova:` and doing the usual:

```
 meteor add cordova:org.apache.cordova.vibration@0.3.10
```

Now we can go finish the app!

```javascript
if (Meteor.isCordova) { // if we're running as a native mobile app...

  Meteor.startup(function () {

    Buzz.find({}).observe({
      added: function (doc) { // ...whenever a buzz is added

        // ..do a vibrate
        navigator.notification.vibrate(500)
      }
    })
  })
}
```

Referring back to the docs for the vibration plugin we can see that
`navigator.notification.vibrate(500)` tells a handset to vibrate for 500ms. It's
worth noting that the docs also point out that there are iOS quirks, so the usual
web-dev caveats still apply here.

More interestingly, that's it! Our app is now perfect. We have a button, and
whenever anyone presses it, it'll cause the mobile app to do a vibrate.

**Now we just need to deploy this tele-wobbling MVP.**

First up let's push it up to meteor, as it's a nice'n'simple solution for
getting your idea onto the internets fast:

```
 meteor deploy buzz
```

...and we're done, our app is now deployed at http://buzz.meteor.com/
If you try this yourself you likely to run into 2 issues,

1. You need to signup for a [meteor developer account](6) before you can deploy. It's free and painless, so go for it.
2. I already claimed `buzz.meteor.com` so you'll need to choose a different subdomain.

Back to the task at hand, let's finish this. Stop all this talk, I want a native
mobile app on my phone, right now:

Enable developer mode on your android device, plug in a usb cable and run:

```
 meteor run android-device --mobile-port buzz.meteor.com:80
```

It takes a little while to run, but it'll bundle up the front end of your meteor
app, grab the Cordova plugins, install it on your device and fire it up.

Providing the `--mobile-port buzz.meteor.com:80` argument tells meteor that I
want this mobile app to point to the server running on http://buzz.meteor.com

And that's it. You can see it live on http://buzz.meteor.com
There is a button there you should never press.

## Credits

Vibrate icon designed by <a href="http://www.thenounproject.com/Jetro">Jetro Cabau Quirós</a> from the <a href="http://www.thenounproject.com">Noun Project</a>

All the code on github: https://github.com/meteor-london/buzz

Presented at [Meteor London][7], 18th Sept 2014

by [@olizilla][8] & [@_alanshaw][9]

[(╯°□°）╯︵ TABLEFLIP](http://tableflip.io/)

[1]: https://github.com/meteor/meteor/blob/devel/History.md
[2]: http://cordova.apache.org/
[3]: https://github.com/meteor/meteor/wiki/Meteor-Cordova-Phonegap-integration
[5]: http://phonegap.com/2012/05/09/phonegap-beliefs-goals-and-philosophy/ "The ultimate purpose of PhoneGap is to cease to exist."
[6]: https://www.meteor.com/blog/2014/02/25/meteor-developer-accounts
[7]: http://www.meetup.com/Meteor-London/
[8]: https://twitter.com/olizilla
[9]: https://twitter.com/_alanshaw
