(function($, undefined) {
  $.fn.japaneseinputidle = function(delay, handler) {
    var el = this,
        oldText = undefined,
        hasUncommittedTextInIME = false,
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

      // When Enter or ESC is pressed, IME does not have uncommitted text.
      // When Backspace is pressed:
      // - Firefox triggers keyup e.which == 8 only when all uncommitted text
      //   are deleted. And firefox never triggers an event with
      //   e.which == 229, so (e.which == 8 && lastKeydownWhich != 229)
      //   is true at this moment.
      // - Chrome triggers keydown e.which == 229 and keyup e.which == 8
      //   everytime backspace is pressed.
      //   In the code below hasUncommittedTextInIME remains true just
      //   when all uncommitted text are deleted. However at this moment,
      //   the text is same as oldText, so it's OK that handler is not called.
      //   The next keydown event changes lastKeydownWhich to some value
      //   different from 229 and hasUncommittedTextInIME becomes false.
      if (e.which == 13 || e.which == 27 ||
          (e.which == 8 && lastKeydownWhich != 229)) {
        hasUncommittedTextInIME = false;
      }

      // Set timer only when IME does not have uncommitted text.
      if (!hasUncommittedTextInIME) {
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
      lastKeydownWhich = e.which;

      // IE, Chrome and Safari fires events wich e.which = 229 when IME has
      // uncommitted text.
      if (lastKeydownWhich == 229) {
        hasUncommittedTextInIME = true;
      }

    }

    el.focusin(onFocusin).keydown(onKeydown).keyup(onKeyup);
  };
}(jQuery));
