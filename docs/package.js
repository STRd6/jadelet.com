(function(pkg) {
  (function() {
  var annotateSourceURL, cacheFor, circularGuard, defaultEntryPoint, fileSeparator, generateRequireFn, global, isPackage, loadModule, loadPackage, loadPath, normalizePath, publicAPI, rootModule, startsWith,
    __slice = [].slice;

  fileSeparator = '/';

  global = self;

  defaultEntryPoint = "main";

  circularGuard = {};

  rootModule = {
    path: ""
  };

  loadPath = function(parentModule, pkg, path) {
    var cache, localPath, module, normalizedPath;
    if (startsWith(path, '/')) {
      localPath = [];
    } else {
      localPath = parentModule.path.split(fileSeparator);
    }
    normalizedPath = normalizePath(path, localPath);
    cache = cacheFor(pkg);
    if (module = cache[normalizedPath]) {
      if (module === circularGuard) {
        throw "Circular dependency detected when requiring " + normalizedPath;
      }
    } else {
      cache[normalizedPath] = circularGuard;
      try {
        cache[normalizedPath] = module = loadModule(pkg, normalizedPath);
      } finally {
        if (cache[normalizedPath] === circularGuard) {
          delete cache[normalizedPath];
        }
      }
    }
    return module.exports;
  };

  normalizePath = function(path, base) {
    var piece, result;
    if (base == null) {
      base = [];
    }
    base = base.concat(path.split(fileSeparator));
    result = [];
    while (base.length) {
      switch (piece = base.shift()) {
        case "..":
          result.pop();
          break;
        case "":
        case ".":
          break;
        default:
          result.push(piece);
      }
    }
    return result.join(fileSeparator);
  };

  loadPackage = function(pkg) {
    var path;
    path = pkg.entryPoint || defaultEntryPoint;
    return loadPath(rootModule, pkg, path);
  };

  loadModule = function(pkg, path) {
    var args, content, context, dirname, file, module, program, values;
    if (!(file = pkg.distribution[path])) {
      throw "Could not find file at " + path + " in " + pkg.name;
    }
    if ((content = file.content) == null) {
      throw "Malformed package. No content for file at " + path + " in " + pkg.name;
    }
    program = annotateSourceURL(content, pkg, path);
    dirname = path.split(fileSeparator).slice(0, -1).join(fileSeparator);
    module = {
      path: dirname,
      exports: {}
    };
    context = {
      require: generateRequireFn(pkg, module),
      global: global,
      module: module,
      exports: module.exports,
      PACKAGE: pkg,
      __filename: path,
      __dirname: dirname
    };
    args = Object.keys(context);
    values = args.map(function(name) {
      return context[name];
    });
    Function.apply(null, __slice.call(args).concat([program])).apply(module, values);
    return module;
  };

  isPackage = function(path) {
    if (!(startsWith(path, fileSeparator) || startsWith(path, "." + fileSeparator) || startsWith(path, ".." + fileSeparator))) {
      return path.split(fileSeparator)[0];
    } else {
      return false;
    }
  };

  generateRequireFn = function(pkg, module) {
    var fn;
    if (module == null) {
      module = rootModule;
    }
    if (pkg.name == null) {
      pkg.name = "ROOT";
    }
    if (pkg.scopedName == null) {
      pkg.scopedName = "ROOT";
    }
    fn = function(path) {
      var otherPackage;
      if (typeof path === "object") {
        return loadPackage(path);
      } else if (isPackage(path)) {
        if (!(otherPackage = pkg.dependencies[path])) {
          throw "Package: " + path + " not found.";
        }
        if (otherPackage.name == null) {
          otherPackage.name = path;
        }
        if (otherPackage.scopedName == null) {
          otherPackage.scopedName = "" + pkg.scopedName + ":" + path;
        }
        return loadPackage(otherPackage);
      } else {
        return loadPath(module, pkg, path);
      }
    };
    fn.packageWrapper = publicAPI.packageWrapper;
    fn.executePackageWrapper = publicAPI.executePackageWrapper;
    return fn;
  };

  publicAPI = {
    generateFor: generateRequireFn,
    packageWrapper: function(pkg, code) {
      return ";(function(PACKAGE) {\n  var src = " + (JSON.stringify(PACKAGE.distribution.main.content)) + ";\n  var Require = new Function(\"PACKAGE\", \"return \" + src)({distribution: {main: {content: src}}});\n  var require = Require.generateFor(PACKAGE);\n  " + code + ";\n})(" + (JSON.stringify(pkg, null, 2)) + ");";
    },
    executePackageWrapper: function(pkg) {
      return publicAPI.packageWrapper(pkg, "require('./" + pkg.entryPoint + "')");
    },
    loadPackage: loadPackage
  };

  if (typeof exports !== "undefined" && exports !== null) {
    module.exports = publicAPI;
  } else {
    global.Require = publicAPI;
  }

  startsWith = function(string, prefix) {
    return string.lastIndexOf(prefix, 0) === 0;
  };

  cacheFor = function(pkg) {
    if (pkg.cache) {
      return pkg.cache;
    }
    Object.defineProperty(pkg, "cache", {
      value: {}
    });
    return pkg.cache;
  };

  annotateSourceURL = function(program, pkg, path) {
    return "" + program + "\n//# sourceURL=" + pkg.scopedName + "/" + path;
  };

  return publicAPI;

}).call(this);

  window.require = Require.generateFor(pkg);
})({
  "source": {
    "LICENSE": {
      "path": "LICENSE",
      "content": "MIT License\n\nCopyright (c) 2017 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n",
      "mode": "100644",
      "type": "blob"
    },
    "README.md": {
      "path": "README.md",
      "content": "# jadelet.com\nJadelet.com Homepage\n",
      "mode": "100644",
      "type": "blob"
    },
    "lib/mailchimp.coffee": {
      "path": "lib/mailchimp.coffee",
      "content": "module.exports = ->\n  div = document.createElement \"div\"\n\n  div.innerHTML = \"\"\"\n    <div>\n      <form action=\"//coffee.us8.list-manage.com/subscribe/post?u=77480aba6229057bc27e2261e&amp;id=0458220e6c\" method=\"post\" name=\"mc-embedded-subscribe-form\" target=\"_blank\">\n    \t<h2>Subscribe to our mailing list</h2>\n      <div class=\"mc-field-group\">\n      \t<label for=\"mce-EMAIL\">Email Address <span class=\"asterisk\">*</span>\n        </label>\n      \t<input type=\"email\" value=\"\" name=\"EMAIL\" class=\"required email\" id=\"mce-EMAIL\">\n      </div>\n      <div class=\"mc-field-group\">\n      \t<label for=\"mce-FNAME\">First Name </label>\n      \t<input type=\"text\" value=\"\" name=\"FNAME\" class=\"\" id=\"mce-FNAME\">\n      </div>\n      <div class=\"mc-field-group\">\n      \t<label for=\"mce-LNAME\">Last Name </label>\n      \t<input type=\"text\" value=\"\" name=\"LNAME\" class=\"\" id=\"mce-LNAME\">\n      </div>\n      \t<div id=\"mce-responses\" class=\"clear\">\n      \t\t<div class=\"response\" id=\"mce-error-response\" style=\"display:none\"></div>\n      \t\t<div class=\"response\" id=\"mce-success-response\" style=\"display:none\"></div>\n      \t</div>    <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->\n          <div style=\"position: absolute; left: -5000px;\" aria-hidden=\"true\"><input type=\"text\" name=\"b_77480aba6229057bc27e2261e_0458220e6c\" tabindex=\"-1\" value=\"\"></div>\n          <button value=\"Subscribe\" name=\"subscribe\">Subscribe!</button></div>\n      </form>\n    </div>\n  \"\"\"\n\n  return div\n",
      "mode": "100644",
      "type": "blob"
    },
    "main.coffee": {
      "path": "main.coffee",
      "content": "style = document.createElement \"style\"\nstyle.innerHTML = require \"./style\"\ndocument.head.appendChild style\n\nrequire(\"analytics\").init('UA-3464282-17')\n\nTemplate = require \"./templates/main\"\n\ndocument.body.appendChild Template\n  signupForm: require \"./lib/mailchimp\"\n",
      "mode": "100644",
      "type": "blob"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "content": "title: \"Jadelet - Truly Outrageous Clientside Templates!\"\ndescription: \"\"\"\n  Jadelet delivers simple, powerful, and truly outrageous reactive templating. By\n  making use of native DOM APIs Jadelet provides the cleanest and smallest\n  runtime at less than 2.8k gzipped. Check it out. It might just blow your mind.\n\"\"\"\ndependencies:\n  analytics: \"distri/google-analytics:master\"\n",
      "mode": "100644",
      "type": "blob"
    },
    "style.styl": {
      "path": "style.styl",
      "content": "@import url('https://fonts.googleapis.com/css?family=Roboto')\n\n*\n  box-sizing: border-box\n\n/* Palette generated by Material Palette - materialpalette.com/pink/light-blue */\n\nprimary-color =        #4CAF50\nprimary-color-dark =   #43a047\nprimary-color-light =  #66bb6a\nprimary-color-text =   #FFFFFF\naccent-color =         #03A9F4\nprimary-text-color =   #212121\n\nbody\n  font-family: \"Roboto\", \"Helvetica Neue\", Helvetica, sans-serif\n  font-size: 16px\n  color: primary-text-color\n  margin: 0\n\n  > content\n    display: block\n    padding: 0 2em 2em\n\n    > header\n      background-color: primary-color\n      color: primary-color-text\n      margin: 0 -2em\n      padding: 1em 2em\n\n      > h1\n        margin: auto\n        max-width: 640px\n        padding-top: 1em\n\n    > section\n      padding-top: 1em\n\nsection\n  margin: auto\n  max-width: 640px\n\na\n  color: accent-color\n  text-decoration: none\n\nh1, h2\n  font-weight: 300\n  margin: 1rem 0\n\nform\n  max-width: 400px\n\nlabel\n  display: block\n  \n  > .asterisk\n    color: primary-color\n\ninput[type=\"text\"], input[type=\"email\"]\n  display: block\n  font-size: inherit\n  margin-bottom: 1em\n  width: 100%\n\nbutton\n  background-color: primary-color-dark\n  border: none\n  border-radius: 4px\n  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5)\n  color: primary-color-text\n  font-size: inherit\n  font-weight: bold\n  overflow: hidden\n  padding: 1em\n  position: relative\n  transition-property: background-color, color\n  transition-duration: 0.25s\n  width: 100%\n\n  &:hover\n    color: primary-color-text\n    background-color: primary-color\n    cursor: pointer\n\n    &:after\n      animation: shimmer-left 2.5s linear 0.25s 2\n      content: \"\"\n      background: linear-gradient(\n        50deg,\n        rgba(255, 255, 255, 0) 0%,\n        rgba(255, 255, 255, 0) 40%,\n        rgba(255, 255, 255, 0.95) 50%,\n        rgba(255, 255, 255, 0) 75%,\n        rgba(255, 255, 255, 0) 100%\n      )\n      height: 100%\n      position: absolute\n      top: 0\n      left: 100%\n      width: 100%\n\n@keyframes shimmer-left\n  0%\n    left: 100%\n  25%\n    left: 0\n  50%\n    left: -100%\n  100%\n    left: -100%\n",
      "mode": "100644",
      "type": "blob"
    },
    "templates/main.jadelet": {
      "path": "templates/main.jadelet",
      "content": "content\n  header\n    h1 Jadelet\n  section\n    h2 Truly outrageous clientside templates!\n    p Jadelet is the smallest of all the serious clientside templating libraries. With the runtime weighing in at only 2,772 bytes it is far and away the winner. But don't let it's size fool you, it contains tremendous power.\n    p Jadelet also has the simplest and cleanest way to describe your templates. A one-to-one match with DOM structure and no unnecessary clutter makes it a breeze to learn and a joy to work with.\n    p\n      Jadelet is MIT licensed, open source, and production ready.\n    p\n      a(href=\"https://github.com/STRd6/jadelet\") View Jadelet on GitHub\n\n  section\n    = @signupForm\n",
      "mode": "100644",
      "type": "blob"
    },
    "email.md": {
      "path": "email.md",
      "content": "Hamlet.coffee is now Jadelet.com!\n=================================\n\nGreetings friends! It's been a long time, hasn't it? I hope 2017 is treating you\nwell... if this year teaches us anything it's that anything is possible :)\n\nThere's been some changes here too, aside from just the name. Let's take a gander:\n\nWe've dropped the haml style DSL in favor for the cleaner Jade style DSL. There\nwas very little interest in the haml style and removing support for it allows us\nto focus on making a better experience with the style people enjoy.\n\nAdministratively, we've consolidate the parser, compiler, cli, and runtime repos\ninto one place to make it easier to understand the project as a whole. Check it\nout here: https://github.com/STRd6/jadelet\n\nNot all the changes have been boring however! We were able to shrink the runtime\ndown to an impressive 2.8kb along with enhancements to event handling. That's\nonly 2,772 bytes (minified and gzipped) the smallest of any serious clientside\ntemplating library.\n\nOur new site jadelet.com is launching with updated documentation and tuturials:\n\n- 5 min Getting Started\n- Jadelet Basics\n- Example Garden\n\nUntil next time friends... Never stop believing in yourself! Software _can_ be poetry :)\n",
      "mode": "100644"
    }
  },
  "distribution": {
    "lib/mailchimp": {
      "path": "lib/mailchimp",
      "content": "(function() {\n  module.exports = function() {\n    var div;\n    div = document.createElement(\"div\");\n    div.innerHTML = \"<div>\\n  <form action=\\\"//coffee.us8.list-manage.com/subscribe/post?u=77480aba6229057bc27e2261e&amp;id=0458220e6c\\\" method=\\\"post\\\" name=\\\"mc-embedded-subscribe-form\\\" target=\\\"_blank\\\">\\n\t<h2>Subscribe to our mailing list</h2>\\n  <div class=\\\"mc-field-group\\\">\\n  \t<label for=\\\"mce-EMAIL\\\">Email Address <span class=\\\"asterisk\\\">*</span>\\n    </label>\\n  \t<input type=\\\"email\\\" value=\\\"\\\" name=\\\"EMAIL\\\" class=\\\"required email\\\" id=\\\"mce-EMAIL\\\">\\n  </div>\\n  <div class=\\\"mc-field-group\\\">\\n  \t<label for=\\\"mce-FNAME\\\">First Name </label>\\n  \t<input type=\\\"text\\\" value=\\\"\\\" name=\\\"FNAME\\\" class=\\\"\\\" id=\\\"mce-FNAME\\\">\\n  </div>\\n  <div class=\\\"mc-field-group\\\">\\n  \t<label for=\\\"mce-LNAME\\\">Last Name </label>\\n  \t<input type=\\\"text\\\" value=\\\"\\\" name=\\\"LNAME\\\" class=\\\"\\\" id=\\\"mce-LNAME\\\">\\n  </div>\\n  \t<div id=\\\"mce-responses\\\" class=\\\"clear\\\">\\n  \t\t<div class=\\\"response\\\" id=\\\"mce-error-response\\\" style=\\\"display:none\\\"></div>\\n  \t\t<div class=\\\"response\\\" id=\\\"mce-success-response\\\" style=\\\"display:none\\\"></div>\\n  \t</div>    <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->\\n      <div style=\\\"position: absolute; left: -5000px;\\\" aria-hidden=\\\"true\\\"><input type=\\\"text\\\" name=\\\"b_77480aba6229057bc27e2261e_0458220e6c\\\" tabindex=\\\"-1\\\" value=\\\"\\\"></div>\\n      <button value=\\\"Subscribe\\\" name=\\\"subscribe\\\">Subscribe!</button></div>\\n  </form>\\n</div>\";\n    return div;\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "main": {
      "path": "main",
      "content": "(function() {\n  var Template, style;\n\n  style = document.createElement(\"style\");\n\n  style.innerHTML = require(\"./style\");\n\n  document.head.appendChild(style);\n\n  require(\"analytics\").init('UA-3464282-17');\n\n  Template = require(\"./templates/main\");\n\n  document.body.appendChild(Template({\n    signupForm: require(\"./lib/mailchimp\")\n  }));\n\n}).call(this);\n",
      "type": "blob"
    },
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"title\":\"Jadelet - Truly Outrageous Clientside Templates!\",\"description\":\"Jadelet delivers simple, powerful, and truly outrageous reactive templating. By\\nmaking use of native DOM APIs Jadelet provides the cleanest and smallest\\nruntime at less than 2.8k gzipped. Check it out. It might just blow your mind.\",\"dependencies\":{\"analytics\":\"distri/google-analytics:master\"}};",
      "type": "blob"
    },
    "style": {
      "path": "style",
      "content": "module.exports = \"@import url(\\\"https://fonts.googleapis.com/css?family=Roboto\\\");\\n* {\\n  box-sizing: border-box;\\n}\\n/* Palette generated by Material Palette - materialpalette.com/pink/light-blue */\\nbody {\\n  font-family: \\\"Roboto\\\", \\\"Helvetica Neue\\\", Helvetica, sans-serif;\\n  font-size: 16px;\\n  color: #212121;\\n  margin: 0;\\n}\\nbody > content {\\n  display: block;\\n  padding: 0 2em 2em;\\n}\\nbody > content > header {\\n  background-color: #4caf50;\\n  color: #fff;\\n  margin: 0 -2em;\\n  padding: 1em 2em;\\n}\\nbody > content > header > h1 {\\n  margin: auto;\\n  max-width: 640px;\\n  padding-top: 1em;\\n}\\nbody > content > section {\\n  padding-top: 1em;\\n}\\nsection {\\n  margin: auto;\\n  max-width: 640px;\\n}\\na {\\n  color: #03a9f4;\\n  text-decoration: none;\\n}\\nh1,\\nh2 {\\n  font-weight: 300;\\n  margin: 1rem 0;\\n}\\nform {\\n  max-width: 400px;\\n}\\nlabel {\\n  display: block;\\n}\\nlabel > .asterisk {\\n  color: #4caf50;\\n}\\ninput[type=\\\"text\\\"],\\ninput[type=\\\"email\\\"] {\\n  display: block;\\n  font-size: inherit;\\n  margin-bottom: 1em;\\n  width: 100%;\\n}\\nbutton {\\n  background-color: #43a047;\\n  border: none;\\n  border-radius: 4px;\\n  box-shadow: 2px 2px 4px rgba(0,0,0,0.5);\\n  color: #fff;\\n  font-size: inherit;\\n  font-weight: bold;\\n  overflow: hidden;\\n  padding: 1em;\\n  position: relative;\\n  transition-property: background-color, color;\\n  transition-duration: 0.25s;\\n  width: 100%;\\n}\\nbutton:hover {\\n  color: #fff;\\n  background-color: #4caf50;\\n  cursor: pointer;\\n}\\nbutton:hover:after {\\n  animation: shimmer-left 2.5s linear 0.25s 2;\\n  content: \\\"\\\";\\n  background: linear-gradient(50deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0) 75%, rgba(255,255,255,0) 100%);\\n  height: 100%;\\n  position: absolute;\\n  top: 0;\\n  left: 100%;\\n  width: 100%;\\n}\\n@-moz-keyframes shimmer-left {\\n  0% {\\n    left: 100%;\\n  }\\n  25% {\\n    left: 0;\\n  }\\n  50% {\\n    left: -100%;\\n  }\\n  100% {\\n    left: -100%;\\n  }\\n}\\n@-webkit-keyframes shimmer-left {\\n  0% {\\n    left: 100%;\\n  }\\n  25% {\\n    left: 0;\\n  }\\n  50% {\\n    left: -100%;\\n  }\\n  100% {\\n    left: -100%;\\n  }\\n}\\n@-o-keyframes shimmer-left {\\n  0% {\\n    left: 100%;\\n  }\\n  25% {\\n    left: 0;\\n  }\\n  50% {\\n    left: -100%;\\n  }\\n  100% {\\n    left: -100%;\\n  }\\n}\\n@keyframes shimmer-left {\\n  0% {\\n    left: 100%;\\n  }\\n  25% {\\n    left: 0;\\n  }\\n  50% {\\n    left: -100%;\\n  }\\n  100% {\\n    left: -100%;\\n  }\\n}\\n\";",
      "type": "blob"
    },
    "templates/main": {
      "path": "templates/main",
      "content": "module.exports = function(data) {\n  \"use strict\";\n  return (function() {\n    var __root;\n    __root = require(\"/lib/hamlet-runtime\")(this);\n    __root.buffer(__root.element(\"content\", this, {}, function(__root) {\n      __root.buffer(__root.element(\"header\", this, {}, function(__root) {\n        __root.buffer(__root.element(\"h1\", this, {}, function(__root) {\n          __root.buffer(\"Jadelet\\n\");\n        }));\n      }));\n      __root.buffer(__root.element(\"section\", this, {}, function(__root) {\n        __root.buffer(__root.element(\"h2\", this, {}, function(__root) {\n          __root.buffer(\"Truly outrageous clientside templates!\\n\");\n        }));\n        __root.buffer(__root.element(\"p\", this, {}, function(__root) {\n          __root.buffer(\"Jadelet is the smallest of all the serious clientside templating libraries. With the runtime weighing in at only 2,772 bytes it is far and away the winner. But don't let it's size fool you, it contains tremendous power.\\n\");\n        }));\n        __root.buffer(__root.element(\"p\", this, {}, function(__root) {\n          __root.buffer(\"Jadelet also has the simplest and cleanest way to describe your templates. A one-to-one match with DOM structure and no unnecessary clutter makes it a breeze to learn and a joy to work with.\\n\");\n        }));\n        __root.buffer(__root.element(\"p\", this, {}, function(__root) {\n          __root.buffer(__root.element(\"Jadelet\", this, {}, function(__root) {\n            __root.buffer(\"is MIT licensed, open source, and production ready.\\n\");\n          }));\n        }));\n        __root.buffer(__root.element(\"p\", this, {}, function(__root) {\n          __root.buffer(__root.element(\"a\", this, {\n            \"href\": \"https://github.com/STRd6/jadelet\"\n          }, function(__root) {\n            __root.buffer(\"View Jadelet on GitHub\\n\");\n          }));\n        }));\n      }));\n      __root.buffer(__root.element(\"section\", this, {}, function(__root) {\n        __root.buffer(this.signupForm);\n      }));\n    }));\n    return __root.root;\n  }).call(data);\n};\n",
      "type": "blob"
    },
    "lib/hamlet-runtime": {
      "path": "lib/hamlet-runtime",
      "content": "(function(f){if(typeof exports===\"object\"&&typeof module!==\"undefined\"){module.exports=f()}else if(typeof define===\"function\"&&define.amd){define([],f)}else{var g;if(typeof window!==\"undefined\"){g=window}else if(typeof global!==\"undefined\"){g=global}else if(typeof self!==\"undefined\"){g=self}else{g=this}g.HamletRuntime = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require==\"function\"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error(\"Cannot find module '\"+o+\"'\");throw f.code=\"MODULE_NOT_FOUND\",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require==\"function\"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){\n// Generated by CoffeeScript 1.7.1\n(function() {\n  \"use strict\";\n  var Observable, Runtime, bindEvent, bindObservable, bufferTo, classes, createElement, empty, eventNames, get, id, isEvent, isFragment, makeElement, observeAttribute, observeAttributes, observeContent, specialBindings, valueBind, valueIndexOf;\n\n  Observable = require(\"o_0\");\n\n  eventNames = \"abort\\nblur\\nchange\\nclick\\ncontextmenu\\ndblclick\\ndrag\\ndragend\\ndragenter\\ndragexit\\ndragleave\\ndragover\\ndragstart\\ndrop\\nerror\\nfocus\\ninput\\nkeydown\\nkeypress\\nkeyup\\nload\\nmousedown\\nmousemove\\nmouseout\\nmouseover\\nmouseup\\nreset\\nresize\\nscroll\\nselect\\nsubmit\\ntouchcancel\\ntouchend\\ntouchenter\\ntouchleave\\ntouchmove\\ntouchstart\\nunload\".split(\"\\n\");\n\n  isEvent = function(name) {\n    return eventNames.indexOf(name) !== -1;\n  };\n\n  isFragment = function(node) {\n    return (node != null ? node.nodeType : void 0) === 11;\n  };\n\n  valueBind = function(element, value, context) {\n    Observable(function() {\n      var update;\n      value = Observable(value, context);\n      switch (element.nodeName) {\n        case \"SELECT\":\n          element.oninput = element.onchange = function() {\n            var optionValue, _ref, _value;\n            _ref = this.children[this.selectedIndex], optionValue = _ref.value, _value = _ref._value;\n            return value(_value || optionValue);\n          };\n          update = function(newValue) {\n            var options;\n            element._value = newValue;\n            if ((options = element._options)) {\n              if (newValue.value != null) {\n                return element.value = (typeof newValue.value === \"function\" ? newValue.value() : void 0) || newValue.value;\n              } else {\n                return element.selectedIndex = valueIndexOf(options, newValue);\n              }\n            } else {\n              return element.value = newValue;\n            }\n          };\n          return bindObservable(element, value, context, update);\n        default:\n          element.oninput = element.onchange = function() {\n            return value(element.value);\n          };\n          if (typeof element.attachEvent === \"function\") {\n            element.attachEvent(\"onkeydown\", function() {\n              return setTimeout(function() {\n                return value(element.value);\n              }, 0);\n            });\n          }\n          return bindObservable(element, value, context, function(newValue) {\n            if (element.value !== newValue) {\n              return element.value = newValue;\n            }\n          });\n      }\n    });\n  };\n\n  specialBindings = {\n    INPUT: {\n      checked: function(element, value, context) {\n        element.onchange = function() {\n          return typeof value === \"function\" ? value(element.checked) : void 0;\n        };\n        return bindObservable(element, value, context, function(newValue) {\n          return element.checked = newValue;\n        });\n      }\n    },\n    SELECT: {\n      options: function(element, values, context) {\n        var updateValues;\n        values = Observable(values, context);\n        updateValues = function(values) {\n          empty(element);\n          element._options = values;\n          return values.map(function(value, index) {\n            var option, optionName, optionValue;\n            option = createElement(\"option\");\n            option._value = value;\n            if (typeof value === \"object\") {\n              optionValue = (value != null ? value.value : void 0) || index;\n            } else {\n              optionValue = value.toString();\n            }\n            bindObservable(option, optionValue, value, function(newValue) {\n              return option.value = newValue;\n            });\n            optionName = (value != null ? value.name : void 0) || value;\n            bindObservable(option, optionName, value, function(newValue) {\n              return option.textContent = option.innerText = newValue;\n            });\n            element.appendChild(option);\n            if (value === element._value) {\n              element.selectedIndex = index;\n            }\n            return option;\n          });\n        };\n        return bindObservable(element, values, context, updateValues);\n      }\n    }\n  };\n\n  observeAttribute = function(element, context, name, value) {\n    var binding, nodeName, _ref;\n    nodeName = element.nodeName;\n    if (name === \"value\") {\n      valueBind(element, value);\n    } else if (binding = (_ref = specialBindings[nodeName]) != null ? _ref[name] : void 0) {\n      binding(element, value, context);\n    } else if (name.match(/^on/) && isEvent(name.substr(2))) {\n      bindEvent(element, name, value, context);\n    } else if (isEvent(name)) {\n      bindEvent(element, \"on\" + name, value, context);\n    } else {\n      bindObservable(element, value, context, function(newValue) {\n        if ((newValue != null) && newValue !== false) {\n          return element.setAttribute(name, newValue);\n        } else {\n          return element.removeAttribute(name);\n        }\n      });\n    }\n    return element;\n  };\n\n  observeAttributes = function(element, context, attributes) {\n    return Object.keys(attributes).forEach(function(name) {\n      var value;\n      value = attributes[name];\n      return observeAttribute(element, context, name, value);\n    });\n  };\n\n  bindObservable = function(element, value, context, update) {\n    var observable, observe, unobserve;\n    observable = Observable(value, context);\n    observe = function() {\n      observable.observe(update);\n      return update(observable());\n    };\n    unobserve = function() {\n      return observable.stopObserving(update);\n    };\n    observe();\n    return element;\n  };\n\n  bindEvent = function(element, name, fn, context) {\n    return element[name] = function() {\n      return fn.apply(context, arguments);\n    };\n  };\n\n  id = function(element, context, sources) {\n    var lastId, update, value;\n    value = Observable.concat.apply(Observable, sources.map(function(source) {\n      return Observable(source, context);\n    }));\n    update = function(newId) {\n      return element.id = newId;\n    };\n    lastId = function() {\n      return value.last();\n    };\n    return bindObservable(element, lastId, context, update);\n  };\n\n  classes = function(element, context, sources) {\n    var classNames, update, value;\n    value = Observable.concat.apply(Observable, sources.map(function(source) {\n      return Observable(source, context);\n    }));\n    update = function(classNames) {\n      return element.className = classNames;\n    };\n    classNames = function() {\n      return value.join(\" \");\n    };\n    return bindObservable(element, classNames, context, update);\n  };\n\n  createElement = function(name) {\n    return document.createElement(name);\n  };\n\n  observeContent = function(element, context, contentFn) {\n    var append, contents, update;\n    contents = [];\n    contentFn.call(context, {\n      buffer: bufferTo(context, contents),\n      element: makeElement\n    });\n    append = function(item) {\n      if (item == null) {\n\n      } else if (typeof item === \"string\") {\n        return element.appendChild(document.createTextNode(item));\n      } else if (typeof item === \"number\") {\n        return element.appendChild(document.createTextNode(item));\n      } else if (typeof item === \"boolean\") {\n        return element.appendChild(document.createTextNode(item));\n      } else if (typeof item.each === \"function\") {\n        return item.each(append);\n      } else if (typeof item.forEach === \"function\") {\n        return item.forEach(append);\n      } else {\n        return element.appendChild(item);\n      }\n    };\n    update = function(contents) {\n      empty(element);\n      return contents.forEach(append);\n    };\n    return update(contents);\n  };\n\n  bufferTo = function(context, collection) {\n    return function(content) {\n      if (typeof content === 'function') {\n        content = Observable(content, context);\n      }\n      collection.push(content);\n      return content;\n    };\n  };\n\n  makeElement = function(name, context, attributes, fn) {\n    var element;\n    if (attributes == null) {\n      attributes = {};\n    }\n    element = createElement(name);\n    Observable(function() {\n      if (attributes.id != null) {\n        id(element, context, attributes.id);\n        return delete attributes.id;\n      }\n    });\n    Observable(function() {\n      if (attributes[\"class\"] != null) {\n        classes(element, context, attributes[\"class\"]);\n        return delete attributes[\"class\"];\n      }\n    });\n    Observable(function() {\n      return observeAttributes(element, context, attributes);\n    }, context);\n    if (element.nodeName !== \"SELECT\") {\n      Observable(function() {\n        return observeContent(element, context, fn);\n      }, context);\n    }\n    return element;\n  };\n\n  Runtime = function(context) {\n    var self;\n    self = {\n      buffer: function(content) {\n        if (self.root) {\n          throw \"Cannot have multiple root elements\";\n        }\n        return self.root = content;\n      },\n      element: makeElement,\n      filter: function(name, content) {}\n    };\n    return self;\n  };\n\n  Runtime.VERSION = require(\"../package.json\").version;\n\n  Runtime.Observable = Observable;\n\n  module.exports = Runtime;\n\n  empty = function(node) {\n    var child, _results;\n    _results = [];\n    while (child = node.firstChild) {\n      _results.push(node.removeChild(child));\n    }\n    return _results;\n  };\n\n  valueIndexOf = function(options, value) {\n    if (typeof value === \"object\") {\n      return options.indexOf(value);\n    } else {\n      return options.map(function(option) {\n        return option.toString();\n      }).indexOf(value.toString());\n    }\n  };\n\n  get = function(x) {\n    if (typeof x === 'function') {\n      return x();\n    } else {\n      return x;\n    }\n  };\n\n}).call(this);\n\n},{\"../package.json\":3,\"o_0\":2}],2:[function(require,module,exports){\n(function (global){\n// Generated by CoffeeScript 1.8.0\n(function() {\n  var Observable, PROXY_LENGTH, computeDependencies, copy, extend, flatten, get, last, magicDependency, remove, splat, tryCallWithFinallyPop,\n    __slice = [].slice;\n\n  module.exports = Observable = function(value, context) {\n    var changed, fn, listeners, notify, notifyReturning, self;\n    if (typeof (value != null ? value.observe : void 0) === \"function\") {\n      return value;\n    }\n    listeners = [];\n    notify = function(newValue) {\n      return copy(listeners).forEach(function(listener) {\n        return listener(newValue);\n      });\n    };\n    if (typeof value === 'function') {\n      fn = value;\n      self = function() {\n        magicDependency(self);\n        return value;\n      };\n      changed = function() {\n        value = computeDependencies(self, fn, changed, context);\n        return notify(value);\n      };\n      changed();\n    } else {\n      self = function(newValue) {\n        if (arguments.length > 0) {\n          if (value !== newValue) {\n            value = newValue;\n            notify(newValue);\n          }\n        } else {\n          magicDependency(self);\n        }\n        return value;\n      };\n    }\n    self.each = function(callback) {\n      magicDependency(self);\n      if (value != null) {\n        [value].forEach(function(item) {\n          return callback.call(item, item);\n        });\n      }\n      return self;\n    };\n    if (Array.isArray(value)) {\n      [\"concat\", \"every\", \"filter\", \"forEach\", \"indexOf\", \"join\", \"lastIndexOf\", \"map\", \"reduce\", \"reduceRight\", \"slice\", \"some\"].forEach(function(method) {\n        return self[method] = function() {\n          var args;\n          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n          magicDependency(self);\n          return value[method].apply(value, args);\n        };\n      });\n      [\"pop\", \"push\", \"reverse\", \"shift\", \"splice\", \"sort\", \"unshift\"].forEach(function(method) {\n        return self[method] = function() {\n          var args;\n          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n          return notifyReturning(value[method].apply(value, args));\n        };\n      });\n      if (PROXY_LENGTH) {\n        Object.defineProperty(self, 'length', {\n          get: function() {\n            magicDependency(self);\n            return value.length;\n          },\n          set: function(length) {\n            value.length = length;\n            return notifyReturning(value.length);\n          }\n        });\n      }\n      notifyReturning = function(returnValue) {\n        notify(value);\n        return returnValue;\n      };\n      extend(self, {\n        each: function(callback) {\n          self.forEach(function(item, index) {\n            return callback.call(item, item, index, self);\n          });\n          return self;\n        },\n        remove: function(object) {\n          var index;\n          index = value.indexOf(object);\n          if (index >= 0) {\n            return notifyReturning(value.splice(index, 1)[0]);\n          }\n        },\n        get: function(index) {\n          magicDependency(self);\n          return value[index];\n        },\n        first: function() {\n          magicDependency(self);\n          return value[0];\n        },\n        last: function() {\n          magicDependency(self);\n          return value[value.length - 1];\n        },\n        size: function() {\n          magicDependency(self);\n          return value.length;\n        }\n      });\n    }\n    extend(self, {\n      listeners: listeners,\n      observe: function(listener) {\n        return listeners.push(listener);\n      },\n      stopObserving: function(fn) {\n        return remove(listeners, fn);\n      },\n      toggle: function() {\n        return self(!value);\n      },\n      increment: function(n) {\n        return self(value + n);\n      },\n      decrement: function(n) {\n        return self(value - n);\n      },\n      toString: function() {\n        return \"Observable(\" + value + \")\";\n      }\n    });\n    return self;\n  };\n\n  Observable.concat = function() {\n    var arg, args, collection, i, o, _i, _len;\n    args = new Array(arguments.length);\n    for (i = _i = 0, _len = arguments.length; _i < _len; i = ++_i) {\n      arg = arguments[i];\n      args[i] = arguments[i];\n    }\n    collection = Observable(args);\n    o = Observable(function() {\n      return flatten(collection.map(splat));\n    });\n    o.push = collection.push;\n    return o;\n  };\n\n  extend = function(target) {\n    var i, name, source, _i, _len;\n    for (i = _i = 0, _len = arguments.length; _i < _len; i = ++_i) {\n      source = arguments[i];\n      if (i > 0) {\n        for (name in source) {\n          target[name] = source[name];\n        }\n      }\n    }\n    return target;\n  };\n\n  global.OBSERVABLE_ROOT_HACK = [];\n\n  magicDependency = function(self) {\n    var observerSet;\n    observerSet = last(global.OBSERVABLE_ROOT_HACK);\n    if (observerSet) {\n      return observerSet.add(self);\n    }\n  };\n\n  tryCallWithFinallyPop = function(fn, context) {\n    try {\n      return fn.call(context);\n    } finally {\n      global.OBSERVABLE_ROOT_HACK.pop();\n    }\n  };\n\n  computeDependencies = function(self, fn, update, context) {\n    var deps, value, _ref;\n    deps = new Set;\n    global.OBSERVABLE_ROOT_HACK.push(deps);\n    value = tryCallWithFinallyPop(fn, context);\n    if ((_ref = self._deps) != null) {\n      _ref.forEach(function(observable) {\n        return observable.stopObserving(update);\n      });\n    }\n    self._deps = deps;\n    deps.forEach(function(observable) {\n      return observable.observe(update);\n    });\n    return value;\n  };\n\n  try {\n    Object.defineProperty((function() {}), 'length', {\n      get: function() {},\n      set: function() {}\n    });\n    PROXY_LENGTH = true;\n  } catch (_error) {\n    PROXY_LENGTH = false;\n  }\n\n  remove = function(array, value) {\n    var index;\n    index = array.indexOf(value);\n    if (index >= 0) {\n      return array.splice(index, 1)[0];\n    }\n  };\n\n  copy = function(array) {\n    return array.concat([]);\n  };\n\n  get = function(arg) {\n    if (typeof arg === \"function\") {\n      return arg();\n    } else {\n      return arg;\n    }\n  };\n\n  splat = function(item) {\n    var result, results;\n    results = [];\n    if (item == null) {\n      return results;\n    }\n    if (typeof item.forEach === \"function\") {\n      item.forEach(function(i) {\n        return results.push(i);\n      });\n    } else {\n      result = get(item);\n      if (result != null) {\n        results.push(result);\n      }\n    }\n    return results;\n  };\n\n  last = function(array) {\n    return array[array.length - 1];\n  };\n\n  flatten = function(array) {\n    return array.reduce(function(a, b) {\n      return a.concat(b);\n    }, []);\n  };\n\n}).call(this);\n\n}).call(this,typeof global !== \"undefined\" ? global : typeof self !== \"undefined\" ? self : typeof window !== \"undefined\" ? window : {})\n},{}],3:[function(require,module,exports){\nmodule.exports={\n  \"name\": \"hamlet.coffee\",\n  \"version\": \"0.7.6\",\n  \"description\": \"Truly amazing templating!\",\n  \"devDependencies\": {\n    \"browserify\": \"^12.0.1\",\n    \"coffee-script\": \"~1.7.1\",\n    \"jsdom\": \"^7.2.0\",\n    \"mocha\": \"^2.3.3\"\n  },\n  \"dependencies\": {\n    \"hamlet-compiler\": \"0.7.0\",\n    \"o_0\": \"0.3.8\"\n  },\n  \"homepage\": \"hamlet.coffee\",\n  \"repository\": {\n    \"type\": \"git\",\n    \"url\": \"https://github.com/dr-coffee-labs/hamlet.git\"\n  },\n  \"scripts\": {\n    \"prepublish\": \"script/prepublish\",\n    \"test\": \"script/test\"\n  },\n  \"files\": [\n    \"dist/\"\n  ],\n  \"main\": \"dist/runtime.js\"\n}\n\n},{}]},{},[1])(1)\n});",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "https://danielx.net/editor/"
  },
  "config": {
    "title": "Jadelet - Truly Outrageous Clientside Templates!",
    "description": "Jadelet delivers simple, powerful, and truly outrageous reactive templating. By\nmaking use of native DOM APIs Jadelet provides the cleanest and smallest\nruntime at less than 2.8k gzipped. Check it out. It might just blow your mind.",
    "dependencies": {
      "analytics": "distri/google-analytics:master"
    }
  },
  "entryPoint": "main",
  "repository": {
    "branch": "master",
    "default_branch": "master",
    "full_name": "STRd6/jadelet.com",
    "homepage": null,
    "description": "Jadelet.com Homepage",
    "html_url": "https://github.com/STRd6/jadelet.com",
    "url": "https://api.github.com/repos/STRd6/jadelet.com",
    "publishBranch": "gh-pages"
  },
  "dependencies": {
    "analytics": {
      "source": {
        "LICENSE": {
          "path": "LICENSE",
          "content": "The MIT License (MIT)\n\nCopyright (c) 2014 \n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.",
          "mode": "100644",
          "type": "blob"
        },
        "README.md": {
          "path": "README.md",
          "content": "google-analytics\n================\n\nGoogle analytics for distri apps\n",
          "mode": "100644",
          "type": "blob"
        },
        "lib/analytics.js": {
          "path": "lib/analytics.js",
          "content": "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){\n(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),\nm=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)\n})(window,document,'script','//www.google-analytics.com/analytics.js','ga');\n",
          "mode": "100644",
          "type": "blob"
        },
        "main.coffee": {
          "path": "main.coffee",
          "content": "module.exports =\n  init: (id) ->\n    require \"./lib/analytics\"\n\n    global.ga('create', id, 'auto')\n    global.ga('send', 'pageview')\n",
          "mode": "100644",
          "type": "blob"
        },
        "pixie.cson": {
          "path": "pixie.cson",
          "content": "version: \"0.1.2\"\n",
          "mode": "100644",
          "type": "blob"
        },
        "test/main.coffee": {
          "path": "test/main.coffee",
          "content": "mocha.globals(\"ga\")\n\ndescribe \"analytics\", ->\n  it \"should put analytics on the page\", ->\n    GA = require \"../main\"\n\n    GA.init(\"UA-XXXX-Y\")\n\n  it \"should be a chill bro\", ->\n    ga(\"send\", \"duder\")\n",
          "mode": "100644",
          "type": "blob"
        }
      },
      "distribution": {
        "lib/analytics": {
          "path": "lib/analytics",
          "content": "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){\n(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),\nm=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)\n})(window,document,'script','//www.google-analytics.com/analytics.js','ga');\n",
          "type": "blob"
        },
        "main": {
          "path": "main",
          "content": "(function() {\n  module.exports = {\n    init: function(id) {\n      require(\"./lib/analytics\");\n      global.ga('create', id, 'auto');\n      return global.ga('send', 'pageview');\n    }\n  };\n\n}).call(this);\n",
          "type": "blob"
        },
        "pixie": {
          "path": "pixie",
          "content": "module.exports = {\"version\":\"0.1.2\"};",
          "type": "blob"
        },
        "test/main": {
          "path": "test/main",
          "content": "(function() {\n  mocha.globals(\"ga\");\n\n  describe(\"analytics\", function() {\n    it(\"should put analytics on the page\", function() {\n      var GA;\n      GA = require(\"../main\");\n      return GA.init(\"UA-XXXX-Y\");\n    });\n    return it(\"should be a chill bro\", function() {\n      return ga(\"send\", \"duder\");\n    });\n  });\n\n}).call(this);\n",
          "type": "blob"
        }
      },
      "progenitor": {
        "url": "https://danielx.net/editor/"
      },
      "version": "0.1.2",
      "entryPoint": "main",
      "repository": {
        "branch": "master",
        "default_branch": "master",
        "full_name": "distri/google-analytics",
        "homepage": null,
        "description": "Google analytics for distri apps",
        "html_url": "https://github.com/distri/google-analytics",
        "url": "https://api.github.com/repos/distri/google-analytics",
        "publishBranch": "gh-pages"
      },
      "dependencies": {}
    }
  }
});