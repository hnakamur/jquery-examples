(function($, undefined) {
  $.fn.japaneseinputidle = function(delay, handler) {
    var el = this,
        oldText = undefined,
        hasUncommittedTextInIME = false,
        timer = undefined;

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

      // When enter key is pressed, IME commits text.
      if (e.which == 13) {
        hasUncommittedTextInIME = false;
      }

      // Set timer only when IME does not have uncommitted text.
      // Firefox fires events with e.which = 224 when IME has uncommitted text.
      if (!hasUncommittedTextInIME && e.which != 224) {
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
      // IE, Chrome and Safari fires events wich e.which = 229 when IME has
      // uncommitted text.
      if (e.which == 229) {
        hasUncommittedTextInIME = true;
      }
    }

    el.focusin(onFocusin).keydown(onKeydown).keyup(onKeyup);
  };
}(jQuery));
