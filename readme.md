#Quick start for simple web projects
My personal boilerplate for web development based partially on Google's [Web Starter Kit](https://developers.google.com/web/starter-kit) 


## Getting started
1. `npm install` to install the node dependencies
2. `bower install` to install the front-end dependencies
3. `gulp serve` to preview


### Distribution build
* `gulp` to create the distribution build
* `gulp serve:dist` to preview the distribution build


### Features
| Feature                  | Summary                                                                                                                         |
|--------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| Sass compilation         | Automagically compile Sass with libsass. Supports `.scss` but default is `.sass `                                               |
| Code linting             | Uses JSHint for linting                                                                                                         |
| Live browser reloading   | Web server to preview locally; automatic refreshing when files change                                                           |
| Separated dist build     | Working development files (./app) are separated from the final distribution build (./dist)                                      |
| Performance optimization | Minify and concatenates JavaScript, CSS; Minifies HTML; Optimizes images using [imagemin](https://github.com/imagemin/imagemin) |