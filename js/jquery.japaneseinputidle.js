(function($, undefined) {
  $.fn.japaneseinputidle = function(delay, handler) {
    var el = this,
        oldText = undefined,
        readyToSetTimer = true,
        timer = undefined,
        isFirefox = navigator.userAgent.indexOf('Firefox') != -1;

    function onFocusin(e) {
      oldText = el.val();
    }

    function resetTimer() {
      if (timer !== undefined) {
        clearTimeout(timer);
        timer = undefined;
      }
    }

    function onKeyup(e) {
      var text;

      resetTimer();

      // When Enter is pressed, IME commits text.
      if (e.which == 13) {
        readyToSetTimer = true;
      }

      // Set timer only when IME does not have uncommitted text.
      if (readyToSetTimer) {
        var context = this;
        timer = setTimeout(function() {
          text = el.val();
          if (text != oldText) {
            oldText = text;
            handler.call(context, e);
          }
        }, delay);
      }
    }

    // IE, Chrome and Safari fires events with e.which = 229 for
    // every keydown during IME has uncommitted text.
    //
    // Note:
    // For IE, Chrome and Safari, I cannot detect the moment when
    // you delete all uncommitted text with pressing ESC or Backspace
    // appropriate times, so readyToSetTimer remains false at the moment.
    //
    // However, it is not a problem. Because the text becomes same
    // to oldText at the moment, we does not invoke handler anyway.
    //
    // Next time key is pressed and if it causes text to change,
    // keydown with e.which != 229 occurs, readyToSetTimer becomes
    // true and handler will be invoked.
    function onKeydown(e) {
      readyToSetTimer = (e.which != 229);
    }

    el.focusin(onFocusin).keyup(onKeyup);

    // We do not need to watch keydown events for Firefox
    // It fires keydown for the first key, does not fire
    // keydown nor keyup event during IME has uncommitted text, 
    // fires keyup when IME commits or deletes all uncommitted text.
    //
    // We need to watch keydown events for other browsers 
    if (!isFirefox) {
      el.keydown(onKeydown);
    }
  };
}(jQuery));
