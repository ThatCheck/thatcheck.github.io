(function ($, window, document, undefined) {
  'use strict';
  $('[title!=""]').qtip({
    style: {
      classes: 'qtip-tipsy'
    },
    position: {
      my: 'bottom center',  // Position my top left...
      at: 'top center',
    }
  });
})(jQuery, this, document);
