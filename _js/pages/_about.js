/*
    About page JS module
 */
(function ($, window, document, undefined) {
    'use strict';

    $(document).ready(function () {
        if($('body').data('page') == 'about') {
            Timeline.init();
        }
    });

})(jQuery, this, document);
