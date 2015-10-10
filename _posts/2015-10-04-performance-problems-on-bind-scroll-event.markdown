---
layout: post
title:  "Performance problems on scroll bind event !"
date:   2015-10-04 14:50:00
categories: js
---

Bind the scroll event is a common practice when you need to develop a timeline or other scroll specific position components. But when you bind this event, you must take into account the performance problems that can result. Many website that is slow when you scroll, and, it's very annoying when you have this jerk' impression. 

So today I will try to help you with the performance problems on the scroll event and show you how can you resolve it.
 
### Why do you have a jerk impression ? ###

The jerk impression doesn't appear systematically. It's the result of two things : 

- The bind of the scroll event.
- And a intensive task to paint the website. 

The Google Chrome Developer can help you to detect this on the timeline module. 

### How I can resolve this ? ###

You have three principal way to do this : 
- Repaint only what you need.
- Use a debounce function.
- Use a specific library like ScrollMagic. 

I will cover the last two point because, the first really depends of your situation. 

### Use a debounce function ###

*What is a debounce function ?* 

: A debounce function is a function which limit the rate at which a function can fire.

So, with your example, you bind the scroll event with a debounce function which run every 200ms. What's happening ?

+ The scroll event is fired, the function run once. 
+ The scroll is re-fired directly after => The function is not fired. 
+ The timeout of 200ms is over, the scroll event is fired, the function is run. 

I think you see the benefits of the debounce function. 

I always use the underscore.js debounce function. A example : 

{% highlight js %}
function calculateLayout()
{
    //some resize function
}
var lazyLayout = _.debounce(calculateLayout, 300);
$(window).resize(lazyLayout);

{% endhighlight %}

### Use the ScrollMagic library ###

From [ScrollMagic website](http://scrollmagic.io/) : 

*ScrollMagic helps you to easily react to the user's current scroll position.*

{% highlight js %}
var Timeline = (function($,_,window) {
    var element = // your element;
    var controller = new ScrollMagic.Controller();
    var scene = new ScrollMagic.Scene({triggerElement: element, triggerHook: "onEnter" })
                .on('enter',function(event){
                    var element = $(event.target.triggerElement());
                    //Do something when the scroll actiavte the element
                })
                .addTo(controller);
    
{% endhighlight %}

The ScrollMagic library reduces dramatically the performances problems and wrap a provides a lot of built-in function to simplify the detection of the scrollbar position (Here, you just need to define a Controller and a Scene object, and scrollmagic launch the "OnEnter" callback automatically when the scrollbar is near the element).
  
### Voilà ! ### 

So now when you bind a event which is call a lot of times (like resize or scroll), think primarily about the performance problems that this can cause and use tweak like **debounce function** or use library (like ScrollMagic for the scroll event). 