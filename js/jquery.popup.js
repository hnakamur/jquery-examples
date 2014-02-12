(function($, undefined) {
  $.fn.popup = function(options) {
    if (options === "open") {
      options = this.data("options");
      this.show();
    } else if (options === "close") {
      this.hide();
    } else {
      this.data("options", options);
      if (options.top !== undefined || options.left !== undefined) {
        var pos = {};
        if (options.top !== undefined)
          pos.top = options.top;
        if (options.left !== undefined)
          pos.left = options.left;
        this.css(pos);
      }

      this.click(function(e) {
        e.stopPropagation();
      });

      var el = this;
      $(document).click(function(e) {
        el.popup("close");
      });

      $(document).keydown(function(e) {
        if (e.which === 27) { // ESC
          el.popup("close");
        }
      });
    }
  };
}(jQuery));
