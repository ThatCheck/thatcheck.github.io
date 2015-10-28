---
layout: post
title:  "How to use Jekyll, Gulp, Sass, Travis and Github to your blog!"
date:   2015-10-16 14:50:00
categories: js
description : See how to use Jekyll, Gulp, Sass, Travis and Github in your blog. 
---

Today, we will see how to use a lot of useful dev-tools to put your static blog (build with Jekyll) online with GitHub.  

First of all, we need to create the organization, projects or user page on GitHub. You can find a tutorial in the official GitHub Website [here](https://help.github.com/articles/user-organization-and-project-pages/). 

### Install Jekyll ###
First of all, we need to install Jekyll

{% highlight ruby %}
#Install the gem
gem install jekyll
#Create a build
jekyll new myblog
{% endhighlight %}

### Use Gulp to build our Jekyll Website ###
Because of the need of Sass, bower and live-reload, we need to serve our Jekyll build with Gulp. The code I personally use on this website : 

{% highlight javascript %}
/**
 * @type {[type]}
 */
var gulp = require('gulp'),
    path = require('path'),
    debug = require('gulp-debug'),
// CSS
    sass = require('gulp-ruby-sass'),
    minifyCSS = require('gulp-minify-css'),

// JS BUILD
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),

// HTML
    htmlmin = require('gulp-htmlmin'),

// Browser sync
    browserSync = require('browser-sync'),

// Import files
    pkg = require('./package.json'),

// Images files
    imagemin = require('gulp-imagemin'),

// Utils
    utils = require('gulp-util'),
    options = require("minimist")(process.argv.slice(2)),
    addsrc = require('gulp-add-src'),
    spawn = require('child_process').spawn
    ;


var dist              = '_site/'
    , dirPublic       = '/'
    , distAssets      = './assets/'
    , distStylesheets = distAssets + 'css/'
    , distJavascripts = distAssets + 'js/'
    , distImages      = distAssets + 'img/'
    , distFont = distAssets + 'fonts/'
    , deploy          = '_site/'

    , src = './'
    , srcStylesheets = src + '_sass/'
    , srcJavascripts = src + '_js/'
    , srcInclude = src + '_includes/'
    , srcLayout = src + '_layouts/'
    , srcImg = src + '_img/'
    , srcPost = src + '_posts/'
    , srcTemplates   = src + 'templates/'
    , bowerDir = src + 'bower_components/'
    ;

// -->
// Compass & SASS
// <--
gulp.task('compass', function() {
    return sass(srcStylesheets + '*.scss', {
            style: 'compressed',
            loadPath: [
                bowerDir + 'fontawesome/scss',
                bowerDir + 'bourbon/app/assets/stylesheets'
            ]
        })
        .on('error', sass.logError)
        .pipe(addsrc(bowerDir + 'qTip2/dist/jquery.qtip.min.css'))
        .pipe(debug())
        .pipe(options.production ? minifyCSS({keepBreaks: false, keepSpecialComments:true}) : utils.noop())
        .pipe(concat('style.css'))
        .pipe(gulp.dest(distStylesheets));
});

// -->
// HTML
// <--
gulp.task('html', ['jekyll'], function() {
    // --> Minhtml
    return gulp.src([
        path.join(deploy, '*.html'),
        path.join(deploy, '*/*/*.html'),
        path.join(deploy, '*/*/*/*.html')
    ])
        .pipe(options.production ? htmlmin({collapseWhitespace: true}) : utils.noop())
        .pipe(gulp.dest(deploy))
        .pipe( options.production ? utils.noop() : browserSync.reload({stream:true, once: true}) );
});

// -->
// Browser Sync
// <--
gulp.task('browser-sync', function() {
    return browserSync.init(null, {
        server: {
            baseDir: "./" + deploy
        }
    });
});
// Reload all Browsers
gulp.task('bs-reload', function () {
    return browserSync.reload();
});

// -->
// js
// Concatenate & JS build
// <--

gulp.task('js-modernizr',function(){
    return gulp.src([bowerDir + 'modernizr/dist/modernizr-build.js'])
        .pipe(concat('modernizr.js'))
        .pipe(gulp.dest(distJavascripts))
        .pipe(rename('modernizr.min.js'))
        .pipe(options.production ? uglify() : utils.noop())
        .pipe(gulp.dest(distJavascripts));
});

gulp.task('js',['js-modernizr'],function () {
    return gulp.src([
        bowerDir + 'jquery/dist/jquery.min.js',
        bowerDir + 'underscore/underscore-min.js',
        bowerDir + 'scrollmagic/scrollmagic/minified/ScrollMagic.min.js',
        bowerDir + 'qTip2/dist/jquery.qtip.min.js',
        srcJavascripts + 'modules/*.js',
        srcJavascripts + 'pages/*.js',
        srcJavascripts + 'scripts.js'])
        .pipe(concat(pkg.name + '.js'))
        .pipe(gulp.dest(distJavascripts))
        .pipe(rename(pkg.name + '.min.js'))
        .pipe(options.production ? uglify() : utils.noop())
        .pipe(gulp.dest(distJavascripts));
});

// -->
// JEKYLL task
// <--
gulp.task('jekyll', ['images', 'js', 'compass'], function (gulpCallBack){
    var jekyll = process.platform === "win32" ? "jekyll.bat" : "jekyll";
    // After build: cleanup HTML
    var jekyll = spawn(jekyll, ['build'], {stdio: 'inherit'});

    jekyll.on('exit', function(code) {
        gulpCallBack(code === 0 ? null : 'ERROR: Jekyll process exited with code: '+code);
    });
});

// -->
// Icons task
// <--
gulp.task('icons', function() {
    return gulp.src(bowerDir + 'fontawesome/fonts/**.*')
        .pipe(gulp.dest(distFont));
});

// -->
// Icons task
// <--
gulp.task('images', function() {
    return gulp.src(srcImg + '**')
        .pipe(options.production ? imagemin({
            progressive: true,
            optimizationLevel : 3
        }) : utils.noop())
        .pipe(gulp.dest(distImages));
});

gulp.task('generate',['compass', 'js', 'icons', 'images', 'html']);

// -->
// Default task
// <--
gulp.task('default', ['compass', 'js', 'icons', 'images', 'html', 'browser-sync'], function (event) {
    // --> CSS
    gulp.watch(srcStylesheets+"**", ['html']);
    gulp.watch([
        srcInclude + '*.html',
        srcLayout + '*.html',
        srcPost + '**',
        src + '*.{md,html}'
    ], ['html']);
    // --> Ruby
    gulp.watch(path.join(dist, '*/*.rb'), ['html']);
    // --> JS
    gulp.watch([srcJavascripts+"**/*.js"], ['html']);
});
{% endhighlight %}

Here, an explanation of the list of task :
^
- **Compass** : Build the css
- **browser-sync** : Launch browser-sync
- **bs-reload** : Reload the browser
- **js-modernizr** : Build the modernizr.js in a specific file
- **js** : Build the js in another specific file
- **jekyll** : Detect platform and launch jekyll build
- **icon** : Build the font-awesome lib
- **images**: Optimize and build image
- **generate** : Do all the file to generate the static website
- **default** : The default task which watch all the modification

The assets are export to /_site/assets, as it, there are available to the website. 

I use Sass to build my sass files, imagemin to optimize my image, htmlmin to minify my html. And because GitHub doesn't allow a special push process on her platform, we need to 'hack' it. 

### Use Travis to build our Jekyll Build ###
By default, GitHub rendering the master branch as a website. So, we will create a develop branch where you will push our code, put a listener with Travis CI on this branch a build the master branch. We need with this configuration : 

- A deploy script
- A travis script

**Deploy script**
{% highlight bash %}
#!/bin/bash
set -e # exit with nonzero exit code if anything fails

# clear and re-create the out directory
rm -rf _site || exit 0;
mkdir _site;

# run our compile script, discussed above
npm run build
gulp generate --production

# go to the out directory and create a *new* Git repo
cd _site
cp ../CNAME ./CNAME
git init

# inside this git repo we'll pretend to be a new user
git config user.name "Cabirol Florian"
git config user.email "cabirol.florian.pro@gmail.com"

# The first and only commit to this new Git repo contains all the
# files present with the commit message "Deploy to GitHub Pages".
git add .
git commit -m "Deploy to GitHub Pages"

git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:master > /dev/null 2>&1
{% endhighlight %}

**Trais CI Script**
{% highlight bash %}
language: node_js

node_js:
  - '0.12'

before_script:
  - npm install -g gulp
  - npm install -g grunt-cli
  - npm install -g bower
  - gem install sass
  - gem install jekyll

branches:
  only:
    - develop

script: bash ./deploy.sh

env:
  global:
  - GH_REF: github.com/ThatCheck/thatcheck.github.io.git
  - secure: <Your secure key>
{%endhighlight %}

The secure key is your GitHub api key generate with the travis CI command line tools (You can find a tutorial [here](http://docs.travis-ci.com/user/encryption-keys/))

### Voilà ! ### 

Now you just need to push on the develop branch and Travis CI build your website and push it on the master branch of your repo.