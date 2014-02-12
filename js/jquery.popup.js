(function($, undefined) {
  $.fn.popup = function(command, options) {
    var el = this, doc = $(document);
    if (command === "open") {
      if (options.top !== undefined || options.left !== undefined) {
        var pos = {};
        pos.top = options.top || 0;
        pos.left = options.left || 0;
        this.css(pos);
      }

      function popupClickHandler(e) {
        e.stopPropagation();
      }

      function docClickHandler(e) {
        el.popup("close");
      }

      function docKeydownHandler(e) {
        if (e.which === 27) { // ESC
          el.popup("close");
        }
      }

      el.on("click", popupClickHandler);
      doc.on("click", docClickHandler);
      doc.on("keydown", docKeydownHandler);
      el.data("popup", {
        handlers: {
          popupClick: popupClickHandler,
          docClick: docClickHandler,
          docKeydown: docKeydownHandler
        }
      });
      el.show();
    } else if (command === "close") {
      el.hide();
      var handlers = el.data("popup").handlers;
      el.off("click", handlers.popupClick);
      doc.off("click", handlers.docClick);
      doc.off("keydown", handlers.docKeydown);
    }
  };
}(jQuery));
