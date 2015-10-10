---
layout: post
title:  "Organize you javascript files for your website!"
date:   2015-10-04 14:50:00
categories: js
---

Hi everyone, 
^
Today we will speak about the organization of your JS assets. I thought for a long time about how I can manage and organize my JS file for a website which is not a SPA.
^
And today, I will cover this point. 

### Prerequisites ###

Imagine a simple case, like the "About" page on this site. We have, some common JS we need to run on all the site like the qTip2 Libraries for the tooltip extension and some specific JS which run just on the "About" page. Three options come to us naturally :
^
- Write all the JS code on a script.js file. 
- Write the specific JS code on the "about" page. 
- Write one JS file for the page and one JS file for the common thing. And add the specific page JS with a `<script>` tag on the "about" page. 
^

I will explain you why the three options are bad options : 
^
- The first one, the worst. If you have 100 page with multiple specific javascript, when you do some modification, it's not really easy. All your code is in one file, it's just a bad thing in terms of organization and ease of maintainability.
- The second one, same as a first, write the JS directly in the page is a common bad practice. And you should avoid it. 
- The third one is better than the two others but not the best. You optimize your organization and the maintainability but you need to add, for each page, specific script tags. But you slow down your website because we don't use the browser's cache. 
^

So I will present you a method, the method I use on all project which is not a SPA. 

### Organization ###
The organization of the JS folder will be the following 
{% highlight vim %}
=> JS 
    => modules
        //place all the module here
    => pages
        //place all the page here
    scripts.js
{% endhighlight %}

I think I don't need to explain how the folder's organization. But if it's not clear for us, don't hesitate to ask. 

### JS File ###

So now, the JS file. I use JQuery on my example because a lot of people use it. But you can adapt the method to whatever. 
^

**Script.js**
{% highlight js %}
(function ($, window, document, undefined) {
  'use strict';
  
  //Run the qtip library on all the website
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
{% endhighlight %}

**modules/_timeline.js (here we use the Module Pattern)**
{% highlight js %}
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
{% endhighlight %}
**pages/_about.js**
{% highlight js %}
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

{% endhighlight %}

### Explanation ###

Script.js is the base js script of the website. In it, you can add all you website **common** js, do some variable global variable initialization, app common initialization. 

After, when you need to define a module (per example, a component or a script you need to run on multiple specific page), use the **Module Pattern** to define it properly (private/public property, private/public function, init method, etc). 

To finish, add a JS script per page with a executor-blocker. In my script it's the verification of the 'data-page="about"' on body tag. Like this, you can restrict your code to run only for this page. And run modules or specific JS.

### Prod / Dev Environment ###
So now, when you are on dev env, you need to include all your dependencies, all your modules, the script.js and all page. **In this order** !! 

But in prod, you can easily minify all the JS and generate only or two files (vendor and specific code) to take advantage of the browser's cache functionality. And you reduce the number of request of the browser. 

### Voila !! ###

I think it's one of the best way to organize your JS code on no SPA application. Please tell me if you are agree with it or not. And why. 