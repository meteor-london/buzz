# Meteor Buzz

**A Meteor / Cordova livecoding experiment for Meteor London**

The Meteor History.md file is awash with gems. New features bubble into
existence like real-time quantum soup, and this file provides a terse run down
of all the latest goodies as they appear:

https://github.com/meteor/meteor/blob/devel/History.md

A quick peruse show that with the 0.9.1 release a collection of new commandline
incantations are available to turn your web apps into fully-fledged,
handset-bothering android & iOS native apps, via the magic of cordova.

Following the link to the Cordova integration wiki page
https://github.com/meteor/meteor/wiki/Meteor-Cordova-Phonegap-integration

we find a pretty through getting started guide, so let's try it out.

Let's build and app. Something simple, but real-time and doing something that's
only possible for native apps, beyond the reach of current web-apis.

How about a curious trust experiment in remote vibration?

I can't make a web browser vibrate just yet, but phones seem to do it all the time.

How about a button that anyone in the world can press that'll make my phone
vibrate. Let's build a button that no one should ever press.

Command lines at the ready? Then let's begin:

Scaffold out an new meteor app
```
 meteor create buzz
```

Add android support
```
 meteor add-platform android
```

Wowzers. That downloads half the internet, but it's the half that makes native
app developement possible, and metoer configures it all for you so, it's a good
thing. There's also the butt ugly download logging and license agreement, but I
reckon that'll get better. It gets the job done and its a order of magnitude
easier than setting it all up yourself.


Update the app code to include a global collection called `Buzz` that will store
a record of each button press.

```javascript
Buzz = new Mongo.Collection('buzz')

Template.hello.events({
  'click button': function () {
    Session.set("counter", Session.get("counter") + 1);

    // Record the click as an object in the Buzz collection.
    Buzz.insert({ createdAt: Date.now()})
  }
});
```

Now we want to `observe` that collection and whenever a new buzz record is added
it should make my phone vibrate...

```javascript
if (Meteor.isCordova){

  Meteor.startup(function () {

    Buzz.find({}).observe({
      added:function (doc) {
        // How to do a vibrate?
      }
    })

  })
}
```

So as a web developer, vibrating a handset is an alien concept to me. It's not a
case of using css animation to float the div left then right as fast as you can
re-paint all the things, so I've got no frame of reference here.

**DONT PANIC**

That's what cordova is for. It translates all those weird device specific apis
into something familar and javascripty.

_Great news, but the MDN docs for vibrate don't work_

Yep, while we wait for Mozilla's sterling work in the field of creating web-apis
for all the things we have to live with with the beautiful transitonal stop gap
of cordova plugins. The process of adding native features to your web app is:

1. Go to: http://plugins.cordova.io
2. Find a cordova plugin that does what you want.
3. There is no step 3.

So if we search for `vibration` on the cordova plugin registry, we find:

```
org.apache.cordova.vibration
This plugin provides a way to vibrate the device.
```

Step 3. is a lie. We need this new api to be available yo ourt


....FINISH ME




Add speed ups via the Android SDK Manager
```
meteor configure-android
open ~/.meteor/android_bundle/android-sdk/extras/intel/Hardware_Accelerated_Execution_Manager/IntelHAXM_1.0.8.dmg
```
run the Intel HAXM installer (Hardware Accelerated Execution Manager)
...which installs an unidentified kernal module (mmkay)

> HAX is working and emulator runs in fast virt mode




Add cordova vibration plugin
Vibration plugin: http://plugins.cordova.io/#/package/org.apache.cordova.vibration
```
 meteor add cordova:org.apache.cordova.vibration@0.3.10
```

Run in emulator (NEVER WORKS FOR ME)
```
 meteor run android
```

Run on device. Much better!
```
 meteor run android-device --mobile-port <LAN IP>:<port>
```
