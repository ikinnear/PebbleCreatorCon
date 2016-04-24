var UI = require('ui');
var encoded_auth = "cDA0bmQ5eHQ5cg==";
var user_name='';
var master_instance_url = "https://empikinnear.service-now.com/pebblenow_master.do";
var instance = "";
var base64 = require('');
//var error = require('error');
var debug = false;
var Settings = require('settings');
var myWork = require('myWork');
var myGroupsUnassignedWork = require('myGroupsUnassignedWork');


var timeline = require('timeline');
//
//// Push a pin when the app starts
//Pebble.addEventListener('ready', function() {
//  // An hour ahead
//  var date = new Date();
//  date.setHours(date.getHours() + 1);
//
//  // Create the pin
//  var pin = {
//    "id": "example-pin-0",
//    "time": date.toISOString(),
//    "layout": {
//      "type": "genericPin",
//      "title": "Example Pin",
//      "tinyIcon": "system://images/SCHEDULED_EVENT"
//    }
//  };
//
//  console.log('Inserting pin in the future: ' + JSON.stringify(pin));
//
//  // Push the pin
//  timeline.insertUserPin(pin, function(responseText) {
//    console.log('Result: ' + responseText);
//  });
//});

var mainMenu = new UI.Menu({
  sections: [{
    title: 'K16 Hackzone Menu',
    items: [{
      title: 'My Work'
    }, {
      title: 'Unassigned Work'
    }]
  }]
});

// Set a configurable with the open callback
Settings.config(
  { url: master_instance_url },
  function(e) {
    if(debug)
      console.log('DEBUG opening configurable');
    // Reset instance to blank before opening the webview
    Settings.option('instance', '');
    Settings.option('encoded_auth', '');
    Settings.option('user_name', '');
  },
  function(e) {
    if(debug)
      console.log('DEBUG closed configurable');
    // Show the parsed response
    if(debug)
      console.log("DEBUG Settings Response: " + JSON.stringify(e.options));

    // Show the raw response if parsing failed
    if (e.failed && debug) {
      console.log('DEBUG ' + e.response);
    }
    else{
      Settings.option('instance', e.options.pebble_instance);
      Settings.option('encoded_auth', base64.encode(e.options.uid + ':' + e.options.pwd));
      Settings.option('user_name', e.options.my_user_name);
      if(debug){
        console.log("DEBUG Set option 'instance': " + e.options.pebble_instance);
        console.log("DEBUG Set option 'encoded_auth': " + base64.encode(e.options.uid + ':' + e.options.pwd));
        console.log("DEBUG Set option 'user_name': " + e.options.my_user_name);
      }
      mainMenu.show();
    }
  }
);

mainMenu.show();

mainMenu.on('select', function(e) {
  if(debug){
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
  }
  
  if(e.itemIndex===0){
    myWork.show(instance,encoded_auth,user_name);
  }
  if(e.itemIndex===1){
    myGroupsUnassignedWork.show(instance,encoded_auth,user_name);
  }
  
});