var Timeline = (function($,_,window) {
    var timelineBlocks = $('.cd-timeline-block'),
        offset = 0.8;

    var controller = new ScrollMagic.Controller();
    var scene = [];

    //hide timeline blocks which are outside the viewport
    var init = function () {
        hideBlocks(timelineBlocks, offset);
        listen();
    };

    function listen()
    {
        timelineBlocks.each(function(index,element)
        {
            var tempoScene = new ScrollMagic.Scene({triggerElement: element, triggerHook: "onEnter" })
                .on('enter',function(event){
                    var element = $(event.target.triggerElement());
                    if(element.find('.cd-timeline-img').hasClass('is-hidden')) {
                        element.find('.cd-timeline-img, .cd-timeline-content').removeClass('is-hidden').addClass('bounce-in')
                    }
                })
                .addTo(controller);
            scene.push(tempoScene);
        });


        //$(window).on('scroll', _.debounce(launchAnimation,200))
    }

    function hideBlocks(blocks, offset) {
        blocks.each(function(){
            if( $(this).offset().top > $(window).scrollTop() + $(window).height()*offset ) {
                $(this).find('.cd-timeline-img, .cd-timeline-content').addClass('is-hidden');
            }
        });
    }
    return {
        init : init
    }
})(jQuery,_,window);