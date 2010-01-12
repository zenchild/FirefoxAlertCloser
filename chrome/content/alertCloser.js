// Copyright (c) 2010 Dan Wanek <dwanek@nd.gov>, Jason Huggins, Aaron Boodman
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following
// conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.

var alertCloser = function () {
  // var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
  return {
    init : function () {
      // See: https://developer.mozilla.org/en/nsIWindowWatcher
      var ww = Components.classes["@mozilla.org/embedcomp/window-watcher;1"].getService(Components.interfaces.nsIWindowWatcher);
      var watcher = {
        observe: function(subject, topic, data) {
          if (topic == "domwindowopened") {
            // Make sure the window is loaded, then call alertClose to make sure we are closing
            // a dialog box.  Otherwise we don't want to close the window.
            subject.addEventListener("load", function() { alertCloser.alertClose(subject); }, false);
          }

          // This is mainly a debugging method.  It should be commented out for normal use.
          //subject.addEventListener("load", function() { alertCloser.subinfo(subject); }, false);
        }
      };
      // Register our watcher.  The link to nsIWindowWatcher above will give you more details on
      // what is going on here.
      ww.registerNotification(watcher);
		},

    // This is a debugging method.  It is called from init(), but should not be run in normal
    // circumstances.  If it is run, you should start firefox on the command line so you can see
    // the details dumped to STDOUT/STDERR.
    subinfo: function (subject) {
      dump("SUBJECT typeof: " + typeof(subject) + "\n");
      dump("SUBJECT location: " + subject.location + "\n");
      for (var prop in subject) {
        var inspect_msg = prop + "\n" + subject[prop];
        dump(inspect_msg + "\n");
      }
    }, 

    // This is a convenience method that exists to determine if the window should be closed or not.
    // There could be a lot more logic here, but for now we are just closing any window whose
    // location property is equal to "chrome://global/content/commonDialog.xul", which is what the
    // alert boxes that I have tested use.
    alertClose: function (subject) {
      if(subject.location == "chrome://global/content/commonDialog.xul") {
        window.setTimeout(function() { subject.close(); }, 1000);
      }
    }
  };
}();

window.addEventListener("load", alertCloser.init, false);
