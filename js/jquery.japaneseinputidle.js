(function($, undefined) {
  $.fn.japaneseinputidle = function(delay, handler) {
    var el = this,
        oldText = undefined,
        maybeHaveUncommittedTextInIME = false,
        timer = undefined,
        lastvKeydownWhich;

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
        maybeHaveUncommittedTextInIME = false;
      }

      // Set timer only when IME does not have uncommitted text.
      if (!maybeHaveUncommittedTextInIME) {
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

    function onKeydown(e) {
      // Firefox fires keydown for the first key, does not fire
      // keydown nor keyup event during IME has uncommitted text, 
      // fires keyup when IME commits or deletes all uncommitted text.
      //
      // IE, Chrome and Safari fires events with e.which = 229 for
      // every keydown during IME has uncommitted text.
      //
      // Note:
      // For IE, Chrome and Safari, I cannot detect the moment when
      // you delete all uncommitted text with pressing ESC or Backspace
      // appropriate times, so maybeHaveUncommittedTextInIME remains true
      // at the moment.
      //
      // However, it is not a problem. Because the text becomes same
      // to oldText at the moment, we does not invoke handler anyway.
      //
      // Next time key is pressed and if it causes text to change,
      // keydown with e.which != 229 occurs, maybeHaveUncommittedTextInIME
      // becomes false and handler will be invoked.
      maybeHaveUncommittedTextInIME = (e.which == 229);
    }

    el.focusin(onFocusin).keydown(onKeydown).keyup(onKeyup);
  };
}(jQuery));
