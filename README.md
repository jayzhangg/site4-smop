#smop.
Welcome to the second version of the app (I done fucked up the first one)! Below is some info on what I plan on using:

##Lang/lib:
* html
* css
* js
* node.js
* express (no jade -thanks mai...- see below on how to make a page)
* bootstrap
* jquery
* angular.js --> maybe

##Some Helpful Resources 
* http://justbuildsomething.com/node-js-best-practices/#3

##html/Jade Etiquette (aka how to make a page)
* html and Jade files are located in the views folder
* html files are included in Jade files
* Jade files are processed into client facing files (eg - if I wanted a page called user.html, it would be called user.jade in the views folder and have 2+ lines of code, all of which are includes to html files *see index.jade for example*
* **header.html *must* be included in all Jade files**
* **only html files may be included in Jade files**

##JS Etiquette
* Since express is awesome, we probably don't have to write much node stuff for now
* **no javascripts in html documents,** *they belong in .js documents in the /public/javascripts folder and are to be linked via* \<script src="/public/javascripts/mysource.js">\</script>
