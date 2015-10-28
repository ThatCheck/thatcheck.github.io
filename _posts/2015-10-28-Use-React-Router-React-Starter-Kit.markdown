---
layout: post
title:  "How to use React-Router with the react start kit !"
date:   2015-10-28 13:50
categories: react
description : See how to use react-router with the react-starter-kit. 
---

Today we will see how to use [react-router](https://github.com/rackt/react-router) with the [react-starter-kit](https://github.com/kriasoft/react-starter-kit). The routing tool in the react-starter-kit doesn't fit my needs, so I decided to install the react-router. 

I just write a little tutorial to help you if you have some problems with the installation too. 

##Installation##
First of all, we need to download the react-router

{% highlight bash %}

npm install --save react-router

{% endhighlight %}

After, go to the src/app.js and use replace the `run` function with this :

{% highlight javascript %}
 /**
  * Add the specialized context to the router (useful to inject some High order Element)
  * @param Component
  * @param props
  * @returns {XML}
  */
 function createElement(Component, props) {
   props.params.specializedContext = context;
   return <Component {...props}/>;
 }
 
 /**
  * Main entry point for the react client app
  */
 function run() {
   FastClick.attach(document.body)
 
   ReactDOM.render(
     <Router routes={routes} history={history} createElement={createElement} />,
     document.getElementById('app')
   );
 }
 {% endhighlight %}
 
 
Replace the src/routes.js with :
 
{% highlight javascript %}
 import React from 'react';
 import App from './components/App';
 import Home from './components/Homepage/Homepage.js';
 
 import {Route } from 'react-router';
 
 export default (
   <Route component={App}>
     <Route path="/" component={Home}/>
   </Route>
 );
{% endhighlight %}
  
Replace in src/server.js : 
{% highlight javascript %}

    await Router.dispatch({ path: req.path, context }, (state, component) => {
      data.body = ReactDOM.renderToString(component);
      data.css = css.join('');
    });

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(statusCode).send('<!doctype html>\n' + html);
    
{% endhighlight %}

with : 

{% highlight javascript %}
/**
     * Use the react-router match function and add specific context data !
     * TO-DO : Test error code and clear the code
     */
    match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
      if (error) {
        console.log(error);
        res.send(500, error.message);
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        renderProps.params.specializedContext = context;
        data.body = renderToString(<RoutingContext {...renderProps}/>);
        data.css = css.join('');
        const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
        res.status(statusCode).send('<!doctype html>\n' + html);
      } else {
        console.log('Not found');
        res.send(404, 'Not found');
      }
    });
{% endhighlight %}
   
And finally, the decorator/WithContext.js : 

{% highlight js %}
/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React, { PropTypes, Component } from 'react'; // eslint-disable-line no-unused-vars
import emptyFunction from 'fbjs/lib/emptyFunction';

function withContext(ComposedComponent) {
  return class WithContext extends Component {

    static propTypes = {
      context: PropTypes.shape({
        onInsertCss: PropTypes.func,
        onSetTitle: PropTypes.func,
        onSetMeta: PropTypes.func,
        onPageNotFound: PropTypes.func,
      }),
    };

    static childContextTypes = {
      onInsertCss: PropTypes.func.isRequired,
      onSetTitle: PropTypes.func.isRequired,
      onSetMeta: PropTypes.func.isRequired,
      onPageNotFound: PropTypes.func.isRequired,
    };

    getChildContext() {
      const context = this.props.params.specializedContext || this.props.context;
      return {
        onInsertCss: context.onInsertCss || emptyFunction,
        onSetTitle: context.onSetTitle || emptyFunction,
        onSetMeta: context.onSetMeta || emptyFunction,
        onPageNotFound: context.onPageNotFound || emptyFunction,
      };
    }

    render() {
      const { context, ...other } = this.props; // eslint-disable-line no-unused-vars
      return <ComposedComponent {...other} />;
    }

  };
}

export default withContext;

{% endhighlight %}