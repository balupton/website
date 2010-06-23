/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Bespin.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Bespin Team (bespin@mozilla.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

if (typeof(bespin) === 'undefined') {
    bespin = {};
}

if (typeof(document) !== 'undefined') {
    var link = document.getElementById("bespin_base");
    if (link) {
        var href = link.href;
        bespin.base = href.substring(href.length - 1) !== "/" ? href + "/" : href;
    } else {
        bespin.base = "";
    }
}


(function() {
/*! @license
==========================================================================
Tiki 1.0 - CommonJS Runtime
copyright 2009-2010, Apple Inc., Sprout Systems Inc., and contributors.

Permission is hereby granted, free of charge, to any person obtaining a 
copy of this software and associated documentation files (the "Software"), 
to deal in the Software without restriction, including without limitation 
the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the 
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in 
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
DEALINGS IN THE SOFTWARE.

Tiki is part of the SproutCore project.

SproutCore and the SproutCore logo are trademarks of Sprout Systems, Inc.

For more information visit http://www.sproutcore.com/tiki

==========================================================================
@license */

/*globals tiki ENV ARGV ARGS */

"use modules false";
"use loader false";

/**
  Implements a very simple handler for the loader registration API so that
  additional scripts can load without throwing exceptions.  This loader can
  also return module instances for modules registered with an actual factory
  function.
  
  Note that this stub loader cannot be used on its own.  You must load the 
  regular tiki package as well, which will replace this loader as soon as it
  is fetched.
*/
if ("undefined" === typeof tiki) { var tiki = function() {
  
  var T_UNDEFINED = 'undefined',
      queue = [];
        
  // save a registration method in a queue to be replayed later once the 
  // real loader is available.
  function _record(method, args) {
    queue.push({ m: method, a: args });
  }
  
  var tiki = {
    
    // used to detect when real loader should replace this one
    isBootstrap: true,
    
    // log of actions to be replayed later
    queue: queue, 
    
    // helpers just record into queue
    register: function(packageId, opts) { 
      
      // this hack will make unit tests work for tiki by adding core_test to
      // the list of dependencies.
      if (packageId.match(/^tiki/) && this.ENV) {
        if ((this.ENV.app === 'tiki') && (this.ENV.mode === 'test')) {
          if (!opts.dependencies) opts.dependencies = {};
          opts.dependencies['core_test'] = '~';
        }
      }
      
      _record('register', arguments);
       return this;  
    },
    
    // Keep these around just in case we need them in the end...
    // script:   function() { 
    //   _record('script', arguments); 
    //   return this; 
    // },
    // 
    // stylesheet: function() { 
    //   _record('stylesheet', arguments); 
    //   return this; 
    // },

    // modules actually get saved as well a recorded so you can use them.
    module: function(moduleId, factory) {
      if (moduleId.match(/\:tiki$/)) this.tikiFactory = factory;
      _record('module', arguments);
      return this ;
    },

    // load the tikiFactory 
    start: function() {
      var exp = {}, ret;
      this.tikiFactory(null, exp, null); // no require or module!
      ret = exp.Browser.start(this.ENV, this.ARGS, queue);
      queue = null;
      return ret ;
    }
    
  };
  
  if (T_UNDEFINED !== typeof ENV) tiki.ENV = ENV;
  if (T_UNDEFINED !== typeof ARGV) tiki.ARGS = ARGV; // for older versions
  if (T_UNDEFINED !== typeof ARGS) tiki.ARGS = ARGS;
  
  return tiki;
  
}(); }


tiki.register('::tiki/1.0.0', {
"name": "tiki",
"version": "1.0.0"
});

tiki.module('::tiki/1.0.0:tiki', function(require, exports, module) {
// ==========================================================================
// Project:   Tiki - CommonJS Runtime
// Copyright: ©2009-2010 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see __preamble__.js)
// ==========================================================================
/*jslint evil:true */

/**
  @file 
  
  This file implements the core building blocks needed to implement the 
  tiki runtime in an environment.  If you can require this one module, you can
  setup a runtime that will load additional packages.
  
  It is important that this module NOT require() any other modules since a
  functioning require() statement may not be available.  The module can 
  populate, but not replace, the exports object.

  To configure a Tiki runtime, you need to create a Sandbox and Loader 
  instance from this API with one or more loader Sources.  The BrowserSource
  object implements the basic source you need to work in the browser.  The
  Repository object implemented in the server-side only 'file' API can be 
  used to load from a local repository of packages.
*/

// used for type checking.  This allows the type strings to be minified.
var T_FUNCTION = 'function',
    T_STRING   = 'string',
    T_UNDEFINED = 'undefined';
    
    
var IS_CANONICAL = /^::/; // must begin with ::
var isCanonicalId = function(id) {
  return !!IS_CANONICAL.exec(id);
};  

var DEBUG = function() {
  exports.debug.apply(this, arguments);
};

exports.debug = function() {
  var msg = Array.prototype.join.call(arguments, '');
  require('sys').debug(msg);
};

// ..........................................................
// CORE UTILITIES
// 

var TMP_ARY = [];

/**
  Tests whether the passed object is an array or not.
*/
var isArray;

if (Array.isArray) {
  isArray = Array.isArray;
} else {
  isArray = function(obj) {
    if ('object' !== typeof obj) return false;
    if (obj instanceof Array) return true;
    return obj.constructor && (obj.constructor.name==='Array');
  };
}
exports.isArray = isArray;

/**
  Create a new object with the passed object as the prototype.
*/
var createObject;
if (Object.create) {
  createObject = Object.create;
} else {
  var K = function() {},
      Kproto = K.prototype;
  createObject = function(obj) {
    if (!obj) obj = Object.prototype;
    K.prototype = obj;
    
    var ret = new K();
    ret.prototype = obj;
    K.prototype = Kproto;
    
    return ret ;
  };
}
exports.createObject = createObject;

var _constructor, _extend, extend;

// returns a new constructor function with clean closure...
_constructor = function() {
  return function() {
    if (this.init) return this.init.apply(this, arguments);
    else return this;
  };
};

_extend = function() {
  return extend(this);
};

/**
  Creates a "subclass" of the passed constructor.  The default constructor
  will call look for a local "init" method and call it.
  
  If you don't pass an initial constructor, this will create a new based 
  object.
*/
extend = function(Constructor) {
  var Ret = _constructor();
  Ret.prototype = createObject(Constructor.prototype);
  Ret.prototype.constructor = Ret;
  Ret.super_ = Constructor;
  Ret.extend = _extend;
  return Ret;
};
exports.extend = extend;

/**
  Invokes the passed fn on each item in the array in parallel.  Invokes
  done when finished.
  
  # Example
  
      parallel([1,2,3], function(item, done) {
        // do something with item
        done();
      })(function(err) {
        // invoked when done, err if there was an error
      });
      
  @param {Array} array 
    items to iterate
    
  @param {Function} fn
    callback to invoke
    
  @returns {void}
*/
var parallel = function(array, fn) {
  if (fn && !fn.displayName) fn.displayName = 'parallel#fn';
  
  return function(done) {
    if (array.length === 0) return done(null, []);
    
    var len = array.length,
        cnt = len,
        cancelled = false,
        idx;

    var tail = function(err) {
      if (cancelled) return; // nothing to do

      if (err) {
        cancelled = true;
        return done(err);
      }

      if (--cnt <= 0) done(); 
    };
    tail.displayName = 'parallel#tail';

    for(idx=0;idx<len;idx++) fn(array[idx], tail);
  };
};
parallel.displayName = 'parallel';

/**
  @private
  
  Implements the sync map() on all platforms
*/
var map;
if (Array.prototype.map) {
  map = function(array, fn) {
    return array.map(fn);
  };

} else {
  map = function(array, fn) {
    var idx, len = array.length, ret = [];
    for(idx=0;idx<len;idx++) {
      ret[idx] = fn(array[idx], idx);
    }
    return ret ;
  };
}
map.displayName = 'map';


var PENDING = 'pending',
    READY   = 'ready',
    RUNNING = 'running';
    
/**
  Returns a function that will execute the continuable exactly once and 
  then cache the result.  Invoking the same return function more than once
  will simply return the old result. 
  
  This is a good replacement for promises in many cases.
  
  h3. Example
  
  {{{
    // load a file only once
    var loadit = Co.once(Co.fs.loadFile(pathToFile));

    loadit(function(content) { 
      // loads the file
    });
    
    loadit(function(content) {
      // if already loaded, just invokes with past content
    });
    
  }}}
  
  @param {Function} cont
    Continuable to invoke 
    
  @returns {Function} 
    A new continuable that will only execute once then returns the cached
    result.
*/
var once = function(action, context) {
  var state = PENDING,
      queue = [],
      makePending = false,
      args  = null;

  var ret = function(callback) {
    if (!context) context = this;
    
    // cont has already finished, just invoke callback based on result
    switch(state) {
      
      // already resolved, invoke callback immediately
      case READY:
        callback.apply(null, args);
        break;

      // action has started running but hasn't finished yet
      case RUNNING:
        queue.push(callback);
        break;
        
      // action has not started yet
      case PENDING:
        queue.push(callback);
        state = RUNNING;

        action.call(context, function(err) {
          args  = Array.prototype.slice.call(arguments);
          
          var oldQueue = queue, oldArgs = args;

          if (makePending) {
            state = PENDING;
            queue = [];
            args  = null; 
            makePending = false;

          } else {
            state = READY;
            queue = null;
          }
          
          if (oldQueue) {
            oldQueue.forEach(function(q) { q.apply(null, oldArgs); });
          }
        });
        break;
    }
    return this;
  };
  ret.displayName = 'once#handler';

  // allow the action to be reset so it is called again
  ret.reset = function() {
    switch(state) {
      
      // already run, need to reset
      case READY: 
        state = PENDING;
        queue = [];
        args  = null;
        break;
        
      // in process - set makePending so that resolving will reset to pending
      case RUNNING:
        makePending = true;
        break;
        
      // otherwise ignore pending since there is nothing to reset
    }
  };
  ret.reset.displayName = 'once#handler.reset';
  
  return ret ;
};
exports.once = once;


/**
  Iterate over a property, setting display names on functions as needed.
  Call this on your own exports to setup display names for debugging.
*/
var displayNames = function(obj, root) {
  var k,v;
  for(k in obj) {
    if (!obj.hasOwnProperty(k)) continue ;
    v = obj[k];
    if ('function' === typeof v) {
      if (!v.displayName) {
        v.displayName = root ? (root+'.'+k) : k;
        displayNames(v.prototype, v.displayName);
      }
      
    }
  }
  return obj;
};

// ..........................................................
// ERRORS
// 

var NotFound = extend(Error);
NotFound.prototype.init = function(canonicalId, pkgId) {
  var msg = canonicalId+' not found';
  if (pkgId) {
    if (T_STRING === typeof pkgId) msg = msg+' '+pkgId;
    else msg = msg+' in package '+(pkgId.id || '(unknown)');
  }
  this.message = msg;
  return this;
};
exports.NotFound = NotFound;

var InvalidPackageDef = extend(Error);
InvalidPackageDef.prototype.init = function(def, reason) {
  if ('undefined' !== typeof JSON) def = JSON.stringify(def);
  this.message = "Invalid package definition. "+reason+" "+def;
};
exports.InvalidPackageDef = InvalidPackageDef;

// ..........................................................
// semver
// 

// ..........................................................
// NATCOMPARE
// 
// Used with thanks to Kristof Coomans 
// Find online at http://sourcefrog.net/projects/natsort/natcompare.js
// Cleaned up JSLint errors

/*
natcompare.js -- Perform 'natural order' comparisons of strings in JavaScript.
Copyright (C) 2005 by SCK-CEN (Belgian Nucleair Research Centre)
Written by Kristof Coomans <kristof[dot]coomans[at]sckcen[dot]be>

Based on the Java version by Pierre-Luc Paour, of which this is more or less a straight conversion.
Copyright (C) 2003 by Pierre-Luc Paour <natorder@paour.com>

The Java version was based on the C version by Martin Pool.
Copyright (C) 2000 by Martin Pool <mbp@humbug.org.au>

This software is provided 'as-is', without any express or implied
warranty.  In no event will the authors be held liable for any damages
arising from the use of this software.

Permission is granted to anyone to use this software for any purpose,
including commercial applications, and to alter it and redistribute it
freely, subject to the following restrictions:

1. The origin of this software must not be misrepresented; you must not
claim that you wrote the original software. If you use this software
in a product, an acknowledgment in the product documentation would be
appreciated but is not required.
2. Altered source versions must be plainly marked as such, and must not be
misrepresented as being the original software.
3. This notice may not be removed or altered from any source distribution.
*/
var natcompare = function() {
  
  var isWhitespaceChar = function(a) {
    var charCode = a.charCodeAt(0);
    return charCode <= 32;
  };

  var isDigitChar = function(a) {
    var charCode = a.charCodeAt(0);
    return ( charCode >= 48  && charCode <= 57 );
  };

  var compareRight = function(a,b) {
    var bias = 0,
        ia   = 0,
        ib   = 0,
        ca, cb;

    // The longest run of digits wins.  That aside, the greatest
    // value wins, but we can't know that it will until we've scanned
    // both numbers to know that they have the same magnitude, so we
    // remember it in BIAS.
    for (;; ia++, ib++) {
      ca = a.charAt(ia);
      cb = b.charAt(ib);

      if (!isDigitChar(ca) && !isDigitChar(cb)) return bias;
      else if (!isDigitChar(ca)) return -1;
      else if (!isDigitChar(cb)) return +1;
      else if (ca < cb) if (bias === 0) bias = -1;
      else if (ca > cb) if (bias === 0) bias = +1;
      else if (ca === 0 && cb === 0) return bias;
    }
  };

  var natcompare = function(a,b) {

    var ia  = 0, 
    ib  = 0,
    nza = 0, 
    nzb = 0,
    ca, cb, result;

    while (true) {
      // only count the number of zeroes leading the last number compared
      nza = nzb = 0;

      ca = a.charAt(ia);
      cb = b.charAt(ib);

      // skip over leading spaces or zeros
      while ( isWhitespaceChar( ca ) || ca =='0' ) {
        if (ca == '0') nza++;
        else nza = 0; // only count consecutive zeroes
        ca = a.charAt(++ia);
      }

      while ( isWhitespaceChar( cb ) || cb == '0') {
        if (cb == '0') nzb++;
        else nzb = 0; // only count consecutive zeroes
        cb = b.charAt(++ib);
      }

      // process run of digits
      if (isDigitChar(ca) && isDigitChar(cb)) {
        if ((result = compareRight(a.substring(ia), b.substring(ib))) !== 0) {
          return result;
        }
      }

      // The strings compare the same.  Perhaps the caller
      // will want to call strcmp to break the tie.
      if (ca === 0 && cb === 0) return nza - nzb;

      if (ca < cb) return -1;
      else if (ca > cb) return +1;

      ++ia; ++ib;
    }
  };

  return natcompare;
}();
exports.natcompare = natcompare;

// ..........................................................
// PUBLIC API
// 

// Support Methods
var invalidVers = function(vers) {
  return new Error('' + vers + ' is an invalid version string');
};
invalidVers.displayName = 'invalidVers';

var compareNum = function(vers1, vers2, num1, num2) {
  num1 = Number(num1);
  num2 = Number(num2);
  if (isNaN(num1)) throw invalidVers(vers1);
  if (isNaN(num2)) throw invalidVers(vers2);
  return num1 - num2 ;
};
compareNum.displayName = 'compareNum';


var vparse;
var semver = {
  
  /**
    Parse the version number into its components.  Returns result of a regex.
  */
  parse: function(vers) {
    var ret = vers.match(/^(=|~)?([\d]+?)(\.([\d]+?)(\.(.+))?)?$/);
    if (!ret) return null; // no match
    return [ret, ret[2], ret[4] || '0', ret[6] || '0', ret[1]];
  },


  /**
    Returns the major version number of a version string. 

    @param {String} vers
      version string

    @returns {Number} version number or null if could not be parsed
  */
  major: function(vers) {
    return Number(vparse(vers)[1]);
  },

  /**
    Returns the minor version number of a version string


    @param {String} vers
      version string

    @returns {Number} version number or null if could not be parsed
  */
  minor: function(vers) {
    return Number(vparse(vers)[2]);
  },

  /**
    Returns the patch of a version string.  The patch value is always a string
    not a number
  */
  patch: function(vers) {
    var ret = vparse(vers)[3];
    return isNaN(Number(ret)) ? ret : Number(ret);
  },

  STRICT: 'strict',
  NORMAL: 'normal',

  /**
    Returns the comparison mode.  Will be one of NORMAL or STRICT
  */
  mode: function(vers) {
    var ret = vparse(vers)[4];
    return ret === '=' ? semver.STRICT : semver.NORMAL;
  },

  /**
    Compares two patch strings using the proper matching formula defined by
    semver.org.  Returns:
    
    @param {String} patch1 first patch to compare
    @param {String} patch2 second patch to compare
    @returns {Number} -1 if patch1 < patch2, 1 if patch1 > patch2, 0 if equal 
  */
  comparePatch: function(patch1, patch2) {
    var num1, num2;

    if (patch1 === patch2) return 0; // equal

    num1   = Number(patch1);
    num2   = Number(patch2);

    if (isNaN(num1)) {
      if (isNaN(num2)) {
        // do lexigraphic comparison
        return natcompare(patch1, patch2);

      } else return -1; // num2 is a number therefore num1 < num2

    // num1 is a number but num2 is not so num1 > num2
    } else if (isNaN(num2)) {
      return 1 ;
    } else {
      return num1<num2 ? -1 : (num1>num2 ? 1 : 0) ;
    }
  },

  /**
    Compares two version strings, using natural sorting for the patch.
  */
  compare: function(vers1, vers2) {
    var ret ;

    if (vers1 === vers2) return 0;
    if (vers1) vers1 = vparse(vers1);
    if (vers2) vers2 = vparse(vers2);

    if (!vers1 && !vers2) return 0;
    if (!vers1) return -1; 
    if (!vers2) return 1; 


    ret = compareNum(vers1[0], vers2[0], vers1[1], vers2[1]);
    if (ret === 0) {
      ret = compareNum(vers1[0], vers2[0], vers1[2], vers2[2]);
      if (ret === 0) ret = semver.comparePatch(vers1[3], vers2[3]);
    }

    return (ret < 0) ? -1 : (ret>0 ? 1 : 0);
  },

  /**
    Returns true if the second version string represents a version compatible 
    with the first version.  In general this means the second version must be
    greater than or equal to the first version but its major version must not 
    be different.
  */
  compatible: function(reqVers, curVers) {
    if (!reqVers) return true; // always compatible with no version
    if (reqVers === curVers) return true; // fast path

    // make sure these parse - or else treat them like null
    if (reqVers && !vparse(reqVers)) reqVers = null;
    if (curVers && !vparse(curVers)) curVers = null;

    // try fast paths again in case they changed state
    if (!reqVers) return true; // always compatible with no version
    if (reqVers === curVers) return true; // fast path
    
    // strict mode, must be an exact (semantic) match
    if (semver.mode(reqVers) === semver.STRICT) {
      return curVers && (semver.compare(reqVers, curVers)===0);

    } else {
      if (!curVers) return true; // if no vers, always assume compat

      // major vers
      if (semver.major(reqVers) !== semver.major(curVers)) return false; 
      return semver.compare(reqVers, curVers) <= 0;
    }
  },

  /**
    Normalizes version numbers so that semantically equivalent will be treated 
    the same.
  */
  normalize: function(vers) {
    var patch;

    if (!vers || vers.length===0) return null;
    vers = semver.parse(vers);
    if (!vers) return null;

    patch = Number(vers[3]);
    if (isNaN(patch)) patch = vers[3];

    return [Number(vers[1]), Number(vers[2]), patch].join('.');
  }
  
};
exports.semver = semver;
vparse = semver.parse;


// ..........................................................
// FACTORY
// 

/**
  @constructor
  
  A factory knows how to instantiate a new module for a sandbox, including 
  generating the require() method used by the module itself.  You can return
  custom factories when you install a plugin.  Your module should export
  loadFactory().
  
  The default factory here actually expects to receive a module descriptor
  as generated by the build tools.
*/
var Factory = exports.extend(Object);
exports.Factory = Factory;

Factory.prototype.init = function(moduleId, pkg, factory) {
  this.id  = moduleId;
  this.pkg = pkg;
  this.factory = factory;
};

/**
  Actually generates a new set of exports for the named sandbox.  The sandbox
  must return a module object that can be used to generate the factory.
  
  If the current value of the local factory is a string, then we will actually
  eval/compile the factory as well.
  
  @param sandbox {Sandbox}
    The sandbox the will own the module instance
    
  @param module {Module}
    The module object the exports will belong to
    
  @returns {Hash} exports from instantiated module
*/
Factory.prototype.call = function(sandbox, module) {

  // get the factory function, evaluate if needed
  var func = this.factory,
      filename = this.__filename,
      dirname  = this.__dirname;
      
  if (T_STRING === typeof(func)) {
    func = this.factory = Factory.compile(func, this.pkg.id+':'+this.id);
  }

  // generate a nested require for this puppy
  var req = sandbox.createRequire(module),
      exp = module.exports;
  func.call(exp, req, exp, module, filename, dirname);
  return module.exports;
};


// standard wrapper around a module.  replace item[1] with a string and join.
var MODULE_WRAPPER = [
  '(function(require, exports, module) {',
  null,
  '\n});\n//@ sourceURL=',
  null,
  '\n'];

/**
  Evaluates the passed string.  Returns a function.
  
  @param moduleText {String}
    The module text to compile
    
  @param moduleId {String}
    Optional moduleId.  If provided will be used for debug
    
  @returns {Function} compiled factory
*/
Factory.compile = function(moduleText, moduleId) {
  var ret;
  
  MODULE_WRAPPER[1] = moduleText;
  MODULE_WRAPPER[3] = moduleId || '(unknown module)';
  
  ret = MODULE_WRAPPER.join('');
  ret = eval(ret);
  
  MODULE_WRAPPER[1] = MODULE_WRAPPER[3] = null;
  return ret;
};

exports.Factory = Factory;

// ..........................................................
// MODULE
// 

/**
  A Module describes a single module, including its id, ownerPackage, and
  the actual module exports once the module has been instantiated.  It also
  implements the resource() method which can lookup a resource on the module's
  package.
*/
var Module = exports.extend(Object);
exports.Module = Module;

Module.prototype.init = function(id, ownerPackage, sandbox) {
  this.id           = id;
  this.ownerPackage = ownerPackage;
  this.exports      = {};
  var module        = this;
  
  /**
    Lookup a resource on the module's ownerPackage.  Returns a URL or path 
    for the discovered resource.  The method used to detect the module or 
    package is implemented in the package.
    
    Note that this method is generated for each module we create because some
    code will try to pluck this method off of the module and call it in a
    different context.
    
    @param resourceId {String}
      Full or partial name of resource to retrieve
      
    @param done {Function}
      Optional.  Makes the resource discovery asyncronous
      
    @returns {String} url or path if not called async
  */
  this.resource = function(id) {
    return sandbox.resource(id, module.id, ownerPackage);
  };
};

// ..........................................................
// PACKAGE
// 

/**
  Package expects you to register the package with a config having the 
  following keys:
  
    {
      "name": "name-of-package" (vs canonical id)
      "version": current version of package (if known)
      
      // these are dependencies you require to run.  If the package is 
      // async loaded, these will be the ones loaded
      "dependencies": {
         "package-name": "version"
      },
      
      // these map a specific package-name/version to a canonicalId that must
      // be registered for the package to be loaded.  You may include 
      // additional packages here that may be referenced but are not required
      // to run (for example - lazy loaded packages)
      //
      // This also forms the universe of packages this particular package can
      // reference.
      //
      "tiki:packages": {
        "package-name": [
          { "version": "1.0.0", "id": "canonicalId", "url": "url" }
        ]
      },

      // ids mapped to urls.  all of these scripts must be loaded for this 
      // package to be considered ready 
      "tiki:scripts": {
        "id": "url"
      },
      
      // stylesheets that must be loaded for this package to be considered
      // ready.  The id is used so that the URL can load from a relative path
      // that may move around and still be accurate.
      "tiki:stylesheets": {
        "id": "url",
        "id": "url"
      },
      
      // maps asset paths for non-JS and non-CSS assets to URLs.  Used to 
      // progrmatically load images, etc.
      "tiki:resources": {
        "asset/path": "url",
        "asset/path": "url"
      }
    }

  This registration ensures that the package and it's related assets are 
  loaded.
*/
     
var Package = exports.extend(Object);
exports.Package = Package;

Package.prototype.init = function(id, config) {
  if (!isCanonicalId(id)) id = '::'+id; // normalize
  this.id = id;
  this.config = config;
  this.isReady = true;
};

// ..........................................................
// Package Configs
// 

/**
  Retrieves the named config property.  This method can be overidden by 
  subclasses to perform more advanced processing on the key data
  
  @param {String} key
    The key to retrieve
    
  @returns {Object} the key value or undefined
*/
Package.prototype.get = function(key) {
  return this.config ? this.config[key] : undefined;
};

/**
  Updates the named config property.

  @param {String} key
    The key to update
    
  @param {Object} value
    The object value to change
    
  @returns {Package} receiver
*/
Package.prototype.set = function(key, value) {
  if (!this.config) this.config = {};
  this.config[key] = value;
  return this;
};

/**
  Determines the required version of the named packageId, if any, specified
  in this package.
  
  @param {String} packageId
    The packageId to lookup
    
  @returns {String} The required version or null (meaning any)
*/
Package.prototype.requiredVersion = function(packageId) { 
  var deps = this.get('dependencies');
  return deps ? deps[packageId] : null;
};

// ..........................................................
// Nested Packages
// 

/**
  Attempts to match the passed packageId and version to the receiver or a 
  nested package inside the receiver.  If a match is found, returns the 
  packages canonicalId.  Otherwise returns null.  
  
  This does not search remote sources for the package.  It only looks at 
  what packages are available locally.
  
  This method is called after a package version has been checked for 
  compatibility with the package dependencies.  It is not necessary to 
  validate the requested version against any dependencies.
  
  @param {String} packageId
    The package id to look up

  @param {String} vers
    The expected version.  If null, then return the newest version for the 
    package.
    
  @param {String} Canonical packageId or null
*/
Package.prototype.canonicalPackageId = function(packageId, vers) {
  if ((packageId === this.get('name')) && 
      semver.compatible(vers, this.get('version'))) {
      return this.id;
  }
  return null;
};

/**
  Returns the receiver or an instance of a nested package if it matches the
  canonicalId passed here.  This method will only be called with a canonicalId
  returned from a previous call to Package#canonicalPackageId.
  
  If the package identified by the canonicalId is not available locally for
  some reason, return null.
  
  @param {String} canonicalId 
    The canonical packageId.
    
  @returns {Package} a package instance or null
*/
Package.prototype.packageFor = function(canonicalId) {
  if (canonicalId === this.id) return this;
  return null;
};

/**
  Verifies that the package identified by the passed canonical id is available
  locally and ready for use.  If it is not available, this method should 
  attempt to download the package from a remote source.
  
  Invokes the `done` callback when complete.
  
  If for some reason you cannot download and install the package you should
  invoke the callback with an error object describing the reason.  There are
  a number of standard errors defined on Package such as NotFound.
  
  @param {String} canonicalId
    The canonical packageId
    
  @param {Function} done
    Callback to invoke with result.  Pass an error object if the package 
    could not be loaded for some reason.  Otherwise invoke with no params
    
  @returns {void}
*/
Package.prototype.ensurePackage = function(canonicalId, done) {
  if (canonicalId === this.id) return done();
  else return done(new NotFound(canonicalId, this));
};

/**
  Returns all packages in the package including the package itself and any 
  nested packages.  Default just returns self.
*/
Package.prototype.catalogPackages = function() {
  return [this];
};

// ..........................................................
// Package Module Loading
// 

/**
  Detects whether the moduleId exists in the current package.
  
  @param {String} moduleId
    The moduleId to check
    
  @returns {Boolean} true if the module exists
*/
Package.prototype.exists = function(moduleId) {
  return !!(this.factories && this.factories[moduleId]);
};

/**
  Returns a Factory object for the passed moduleId or null if no matching
  factory could be found.
  
  @param {String} moduleId
    The moduleId to check
    
  @returns {Factory} factory object
*/
Package.prototype.load = function(moduleId) {
  return this.factories ? this.factories[moduleId] : null;
};

// ..........................................................
// LOADER
// 

// potentially optimize to avoid memory churn.
var joinPackageId = function joinPackageId(packageId, moduleId) {
  return packageId+':'+moduleId;
};

/**
  A loader is responsible for finding and loading factory functions.  The 
  primary purpose of the loader is to find packages and modules in those 
  packages.  The loader typically relies on one or more sources to actually
  find a particular package.
*/
var Loader = exports.extend(Object);
exports.Loader = Loader;

Loader.prototype.init = function(sources) {
  this.sources = sources || [];
  this.clear();
};

/**
  Clear caches in the loader causing future requests to go back to the 
  sources.
*/
Loader.prototype.clear = function() {
  this.factories = {};
  this.canonicalIds = {};
  this.packages ={};
  this.packageSources = {};
  this.canonicalPackageIds = {};
};

/**
  The default package.  This can be replaced but normally it is empty, meaning
  it will never match a module.
  
  @property {Package}
*/
Loader.prototype.defaultPackage = new Package('default', { 
  name: "default" 
});

/**
  The anonymous package.  This can be used when loading files outside of a 
  package.
  
  @property {Package}
*/
Loader.prototype.anonymousPackage = new Package('(anonymous)', { 
  name: "(anonymous)"
});


/**

  Discovers the canonical id for a module.  A canonicalId is a valid URN that
  can be used to uniquely identify a module.
  that looks like:
  
    ::packageId:moduleId
    
  For example:
  
    ::sproutcore-runtime/1.2.0:mixins/enumerable
  
  Canonical Ids are discovered according to the following algorithm:
  
  1.  If you pass in an already canonicalId, return it
  2.  If you pass in a relative moduleId, it will be expanded and attached
      to the workingPackage.
  3.  If you pass in a moduleId with a packageId embedded, lookup the latest
      version of the package that is compatible with the passed workingPackage
  4.  If you pass a moduleId with no packageId embedded, then first look
      for the module on the workingPackage.  
  5.  If not found there, look for a packageId with the same name.  If that is 
      found, return either packageId:index or packageId:packageId as module.  
  6.  Otherwise, assume it is part of the default package. 

  @param {String} moduleId
    The moduleId to lookup.  May be a canonicalId, packageId:moduleId, 
    absolute moduleId or relative moduleId
    
  @param {String} curModuleId
    Optional.  moduleId of the module requesting the lookup.  Only needed if
    the moduleId param might be relative.
    
  @param {Package} workingPackage
    The working package making the request.  When searching for a package,
    only use packages that are compatible with the workingPackage.
    
    This parameter is also optional, though if you omit it, this method 
    assumes the anonymousPackage.
    
  @returns {void}
*/
Loader.prototype.canonical = function(moduleId, curModuleId, workingPackage) {
  
  var cache, cacheId, idx, packageId, canonicalId, pkg, ret; 
  
  // NORMALIZE PARAMS
  // normalize params - curModuleId can be omitted (though relative ids won't)
  // work
  if (curModuleId && (T_STRING !== typeof curModuleId)) {
    workingPackage = curModuleId;
    curModuleId = null;
  }
  
  // return immediately if already canonical
  if (isCanonicalId(moduleId)) return moduleId;
  
  // if no workingPackage, assume anonymous
  if (!workingPackage) workingPackage = this.anonymousPackage;
  
  // Resolve moduleId - may return canonical
  moduleId = this._resolve(moduleId, curModuleId, workingPackage);
  if (isCanonicalId(moduleId)) return moduleId;
  
  // then lookup in cache
  cacheId = workingPackage ? workingPackage.id : '(null)';
  cache = this.canonicalIds;
  if (!cache) cache = this.canonicalIds = {};
  if (!cache[cacheId]) cache[cacheId] = {};
  cache = cache[cacheId];
  if (cache[moduleId]) return cache[moduleId];
  cacheId = moduleId; // save for later

  // Not Found in Cache.  Do a lookup
  idx = moduleId.indexOf(':');
  if (idx>=0) {
    packageId = moduleId.slice(0,idx);
    moduleId  = moduleId.slice(idx+1);
    if (moduleId[0]==='/') {
      throw new Error('Absolute path not allowed with packageId');
    }
  }

  // if packageId is provided, just resolve packageId to a canonicalId
  ret = null;
  if (packageId && (packageId.length>0)) {
    canonicalId = this._canonicalPackageId(packageId, null, workingPackage);
    if (canonicalId) ret = joinPackageId(canonicalId, moduleId);

  // no packageId is provided, we'll need to do a little more searching
  } else {

    // first look in workingPackage for match...
    if (workingPackage && workingPackage.exists(moduleId)) {
      ret = joinPackageId(workingPackage.id, moduleId);
      
    // not in working package, look for packageId:index or
    // packageId:packageId
    } else {
      canonicalId = this._canonicalPackageId(moduleId, null, workingPackage);
      if (canonicalId) pkg = this._packageFor(canonicalId, workingPackage);
      if (pkg) {
        if (pkg.exists('index')) ret = joinPackageId(pkg.id, 'index');
        else if (pkg.exists(moduleId)) ret = joinPackageId(pkg.id,moduleId);
      }
    }
    
    // not in working package and isn't a package itself, assume default
    // package.  If there is no defaultPackage, return with the working
    // package.  This will fail but at least the error will be more 
    // helpful
    if (!ret) {
      if (this.defaultPackage) packageId = this.defaultPackage.id;
      else if (this.workingPackage) packageId = this.workingPackage.id;
      else if (this.anonymousPackage) packageId = this.anonymousPackage.id;
      else return packageId = null;
      
      if (packageId) ret = joinPackageId(packageId, moduleId);
    }
  }

  // save to cache and return
  cache[cacheId] = ret;
  return ret ;
};
  
/**

  Loads a factory for the named canonical module Id.  If you did not obtain
  the canonical module id through the loader's canonical() method, then you
  must also pass a workingPackage property so that the loader can locate the
  package that owns the module.
  
  The returns factory function can be used to actually generate a module.
  
  @param {String} canonicalId
    A canonical module id
    
  @param {Package} workingPackage
    Optional working package.  Only required if you pass in a canonical id
    that you did not obtain from the loader's canonical() method.
    
  @returns {void}
  
*/
Loader.prototype.load = function(canonicalId, workingPackage, sandbox) {

  var cache, ret, idx, packageId, moduleId, pkg;
  
  if (!workingPackage) workingPackage = this.anonymousPackage;
  
  cache = this.factories;
  if (!cache) cache = this.factories = {};
  if (cache[canonicalId]) return cache[canonicalId];

  // not in cache - load from package
  idx       = canonicalId.indexOf(':',2);
  packageId = canonicalId.slice(0,idx);
  moduleId  = canonicalId.slice(idx+1);

  pkg = this._packageFor(packageId, workingPackage);
  
//@if(debug)
  if (!pkg) DEBUG('Loader#load - '+packageId+' not found for '+moduleId);
//@endif

  if (!pkg) return null; // not found
  
  ret = pkg.load(moduleId, sandbox);
  cache[canonicalId] = ret;
  return ret ;
};

/**
  Returns a catalog of all known packages visible to the workingPackage.
  The catalog is simply an array of package objects in no particular order
*/
Loader.prototype.catalogPackages = function(workingPackage) {
  if (!workingPackage) workingPackage = this.anonymousPackage;
  var catalog = [], sources, idx, len, seen = {};
  if (this.defaultPackage) catalog.push(this.defaultPackage);
  
  // anonymous package is never visible unless it is working..
  //if (this.anonymousPackage) ret.push(this.anonymousPackage);

  // append any packages with versions that haven't been seen already
  var append = function(packages) {
    var idx, len, check, cur;
    
    if (!packages) return; // nothing to do
    len = packages.length;
    for(idx=0;idx<len;idx++) {
      cur = packages[idx];
      check = seen[cur.get('name')];
      if (!check) check = seen[cur.get('name')] = {};      
      if (!check[cur.get('version')]) {
        catalog.push(cur);
        check[cur.get('version')] = cur;
      }
    }
  };
  
  if (workingPackage) append(workingPackage.catalogPackages());

  sources = this.sources;
  len = sources.length;
  for(idx=0;idx<len;idx++) append(sources[idx].catalogPackages());
  
  seen = null; // no longer needed.
  return catalog;
};

/**
  Discovers the canonical id for a package.  A cnaonicalID is a URN that can
  be used to uniquely identify a package.  It looks like: 
  
    ::packageId
  
  for example:
  
    ::sproutcore-datastore/1.2.0/1ef3ab23ce23ff938

  If you need to perform some low-level operation on a package, this method
  is the best way to identify the package you want to work with specifically.
  
  ## Examples
  
  Find a compatible package named 'foo' in the current owner module:
  
      loader.canonicalPackage('foo', ownerPackage, function(err, pkg) {
        // process response
      });
      
  Find the package named 'foo', exactly version '1.0.0'.  This may return a
  packes nested in the ownerPackage:
  
      loader.canonicalPackage('foo', '=1.0.0', ownerPackage, function(err, pkg) {
        // process response
      });
  
  Find the latest version of 'foo' installed in the system - not specific to 
  any particular package
  
      loader.canonicalPackage('foo', loader.anonymousPackage, function(err, pkg) {
        // process result
      });
      
  @param {String|Package} packageId
    The packageId to load.  If you pass a package, the package itself will
    be returned.
    
  @param {String} vers 
    The required version.  Pass null or omit this parameter to use the latest
    version (compatible with the workingPackage).
    
  @param {Package} workingPackage
    The working package.  This method will search in this package first for
    nested packages.  It will also consult the workingPackage to determine 
    the required version if you don't name a version explicitly.
    
    You may pass null or omit this parameter, in which case the anonymous
    package will be used for context.
    
  @param {Function} done 
    Callback.  Invoked with an error and the loaded package.  If no matching
    package can be found, invoked with null for the package.

  @returns {void}
*/
Loader.prototype.canonicalPackageId = function(packageId, vers, workingPackage) {

  var idx;

  // fast path in case you pass in a package already
  if (packageId instanceof Package) return packageId.id;

  // fast path packageId is already canonical - slice of moduleId first
  if (isCanonicalId(packageId)) {
    idx = packageId.indexOf(':', 2);
    if (idx>=0) packageId = packageId.slice(0,idx);
    return packageId;
  }
  
  // normalize the params.  vers may be omitted
  if (vers && (T_STRING !== typeof vers)) {
    workingPackage = vers;
    vers = null;
  }  

  // must always have a package
  if (!workingPackage) workingPackage = this.anonymousPackage;
  
  // if packageId includes a moduleId, slice it off
  idx = packageId.indexOf(':');
  if (idx>=0) packageId = packageId.slice(0, idx);
  
  // now we can just pass onto internal primitive
  return this._canonicalPackageId(packageId, vers, workingPackage);
};


/**
  Primitive returns the package instance for the named canonicalId.  You can
  pass in a canonicalId for a package only or a package and module.  In either
  case, this method will only return the package instance itself.
  
  Note that to load a canonicalId that was not resolved through the 
  canonicalPackageId() or canonical() method, you will need to also pass in
  a workingPackage so the loader can find the package.
  
  @param {String} canonicalId
    The canonicalId to load a package for.  May contain only the packageId or
    a moduleId as well.
    
  @param {Package} workingPackage
    Optional workingPackage used to locate the package.  This is only needed
    if you request a canonicalId that you did not obtain through the 
    canonical*() methods on the loader.

  @returns {void}
*/
Loader.prototype.packageFor = function(canonicalId, workingPackage){

  if (!workingPackage) workingPackage = this.anonymousPackage;
  
  // remove moduleId
  var idx = canonicalId.indexOf(':', 2);
  if (idx>=0) canonicalId = canonicalId.slice(0, idx);

  return this._packageFor(canonicalId, workingPackage);
};

/**
  Verifies that the named canonicalId is ready for use, including any of its
  dependencies.  You can pass in either a canonical packageId only or a 
  moduleId.   In either case, this method will actually only check the package
  properties for dependency resolution since dependencies are not tracked for
  individual modules.
  
  @param {String} canonicalId
    The canonicalId to use for lookup
    
  @param 
*/
Loader.prototype.ready = function(canonicalId, workingPackage) {

  if (!workingPackage) workingPackage = this.anonymousPackage;
  
  // strip out moduleId
  var idx = canonicalId.indexOf(':', 2), 
      moduleId, pkg;
  
  if (idx >= 0) {
    moduleId    = canonicalId.slice(idx+1);
    canonicalId = canonicalId.slice(0, idx);
  }
  
  if (this._packageReady(canonicalId, workingPackage, {})) {
    pkg = this._packageFor(canonicalId, workingPackage);
    if (!pkg) return false;
    return !!pkg.exists(moduleId);
  } else return false;
  
};

/**
  Ensures the package that maps to the passed packageId/vers combo and all
  of its known dependencies are loaded and ready for use.  If anything is not
  loaded, it will load them also.  
  
  Invokes the passed callback when loading is complete.
  
  This method ends up calling ensurePackage() on one or more of its sources
  to get the actual packages to load.
  
  @param {String} packageId
    The packageID to load.  May be a packageId name or a canonical packageId
    
  @param {String} vers
    Optional version used to constrain the compatible package
    
  @param {Package} workingPackage
    Optional working package used to match the packageId.  If the package 
    might be nested you should always pass a workingPackage.  Default assumes
    anonymousPackage.
    
  @param {Function} done
    Callback invoked when package is loaded.  Passes an error if there was an
    error.  Otherwise no params.
    
  @returns {void}
*/
Loader.prototype.ensurePackage = function(packageId, vers, workingPackage, done) {

  // normalize params
  if (vers && (T_STRING !== typeof vers)) {
    done = workingPackage ;
    workingPackage = vers;
    vers = null;
  }

  if (workingPackage && (T_FUNCTION === typeof workingPackage)) {
    done = workingPackage;
    workingPackage = null;
  }
  
  if (!workingPackage) workingPackage = this.anonymousPackage;

  this._ensurePackage(packageId, vers, workingPackage, {}, done);
};

/**
  @private
  
  Primitive for ensurePackage().  Does no param normalization.  Called 
  recursively for dependencies.
*/
Loader.prototype._ensurePackage = function(packageId, vers, workingPackage, seen, done) {

  var loader = this, canonicalId, source;
  
  // find the canonicalId and source to ask to ensure...
  canonicalId = this._canonicalPackageId(packageId, vers, workingPackage);
  if (!canonicalId) {
    return done(new NotFound(packageId, workingPackage));
  }

  if (seen[canonicalId]) return done(); // success
  seen[canonicalId] = true;

  source = this._sourceForCanonicalPackageId(canonicalId, workingPackage);
  if (!source) {
    return done(new NotFound(canonicalId, workingPackage));
  }

  source.ensurePackage(canonicalId, function(err) {
    var pkg, deps, packageId, packageIds;

    if (err) return done(err);
    pkg = loader.packageFor(canonicalId, workingPackage);
    if (!pkg) {
      return done(new NotFound(canonicalId, workingPackage));
    }

    deps = pkg.get('dependencies');
    if (!deps) return done(); // nothing to do
    
    // map deps to array to we can process in parallel
    packageIds = [];
    for(packageId in deps) {
      if (!deps.hasOwnProperty(packageId)) continue;
      packageIds.push({ packageId: packageId, vers: deps[packageId] });
    }
    
    parallel(packageIds, function(info, done) {
      loader._ensurePackage(info.packageId, info.vers, pkg, seen, done);
    })(done);

  });
  
};

/**
  @private
  
  Discovers the canonical packageId for the named packageId, version and 
  working package.  This will also store in cache the source where you can
  locare and load the associated package, if needed.
  
  This primitive is used by all other package methods to resolve a package
  into a canonicalId that can be used to reference a specific package instance
  
  It does not perform any error checking on passed in parameters which is why
  it should never be called directly outside of the Loader itself.
  
  @param {String|Package} packageId
    The packageId to load.  If you pass a package, the package itself will
    be returned.
    
  @param {String} vers 
    The required version.  Pass null or omit this parameter to use the latest
    version (compatible with the workingPackage).
    
  @param {Package} workingPackage
    The working package.  This method will search in this package first for
    nested packages.  It will also consult the workingPackage to determine 
    the required version if you don't name a version explicitly.
    
  @returns {String}
*/
Loader.prototype._canonicalPackageId = function(packageId, vers, workingPackage) {

  // fast paths
  if (packageId instanceof Package) return packageId.id;
  if (isCanonicalId(packageId)) return packageId;
  if ((packageId === 'default') && this.defaultPackage) {
    return this.defaultPackage.id;
  }
  
  var cache = this.canonicalPackageIds,
      cacheId, sources, ret, idx, len, source;

  // use anonymousPackage if no workingPackage is provided
  if (!workingPackage) workingPackage = this.anonymousPackage;
  if (!workingPackage) throw new Error('working package is required');

  // if packageId is already canonical, vers must be null, otherwise lookup
  // vers in working package
  if (!vers) vers = workingPackage.requiredVersion(packageId);
  
  // look in cache...
  cacheId = workingPackage.id;
  if (!cache) cache = this.canonicalPackageIds = {};
  if (!cache[cacheId]) cache[cacheId] = {};
  cache = cache[cacheId];
  if (!cache[packageId]) cache[packageId] = {};
  cache = cache[packageId];
  if (cache[vers]) return cache[vers];

  sources = this.sources;

  // first, ask the workingPackage  
  ret = workingPackage.canonicalPackageId(packageId, vers);
  source = workingPackage;
  

  // not found - make sure there isn't another incompatible version in 
  // workingPackage.  nested packages superceed all other packages so if there
  // is an incompatible nested version we need to throw an error.
  if (!ret) {
    ret = workingPackage.canonicalPackageId(packageId, null);
    if (ret) {
      throw new Error(
        workingPackage.get('name')+" contains an incompatible nested"+
        " package "+packageId+" (expected: "+vers+")");
    }
  }
  
    
  // next, if not found in the workingPackage, then ask each of our 
  // sources in turn until a match is found.  When found, return
  if (!ret && sources) {
    len = sources.length;
    for(idx=0;!ret && (idx<len);idx++) {
      source = sources[idx];
      ret = source.canonicalPackageId(packageId, vers);
    }
  }
  
  if (ret) this._cachePackageSource(ret, workingPackage, source);
  cache[vers] = ret;
  return ret ;
};

// add a function to the cache that will immediately return the source
Loader.prototype._cachePackageSource = function(id, workingPackage, source) {
  var scache = this.packageSources, pkgId = workingPackage.id;
  
  if (!scache) scache = this.packageSources = {};
  if (!scache[pkgId]) scache[pkgId] = {};
  scache = scache[pkgId];
  scache[id] = source;
};

/**
  Looks up the source for the named canonicalId in the cache.  Returns null
  if no match is found.
*/
Loader.prototype._sourceForCanonicalPackageId = function(canonicalId, workingPackage) {
  var scache = this.packageSources, 
      wpackageId = workingPackage.id, 
      pkg, sources, len, idx, ret;

  if (!scache) scache = this.packageSources = {};
  if (!scache[wpackageId]) scache[wpackageId] = {};
  scache = scache[wpackageId];
  if (scache[canonicalId]) return scache[canonicalId];
  
  sources = this.sources;
    
  // first, ask the workingPackage to find any matching package (since it 
  // can only have one version).  Then check the returned version against 
  // the expected version.  
  if (workingPackage) {
    pkg = workingPackage.packageFor(canonicalId);
    if (pkg) ret = workingPackage; 
  }
  
  if (!ret && sources) {
    len = sources.length;
    for(idx=0;!ret && (idx<len); idx++) {
      ret = sources[idx];
      if (!ret.packageFor(canonicalId)) ret = null;
    }
  }
  
  scache[canonicalId] = ret;
  return ret ;
};

/**
  Primitive actually loads a package from a canonicalId.  Throws an exception
  if source for package is not already in cache.  Also caches loaded package.
*/
Loader.prototype._packageFor = function(canonicalId, workingPackage) {
  var cache, source, ret;

  // special case - if default packageId just get the default package.
  if (this.defaultPackage && (canonicalId === this.defaultPackage.id)) {
    return this.defaultPackage;
  }
  
  // try to resolve out of cache
  cache = this.packages;
  if (!cache) cache = this.packages = {};
  if (cache[canonicalId]) return cache[canonicalId];

  source = this._sourceForCanonicalPackageId(canonicalId, workingPackage);
  if (source) ret = source.packageFor(canonicalId);
  cache[canonicalId] = ret;
  return ret ;
};

/**
  Primitive simply checks to see if the named canonicalId is ready or not
  along with any dependencies
*/
Loader.prototype._packageReady = function(canonicalId, workingPackage, seen) {
  var cache = this.packages, pkg, deps, packageId, vers;

  // if we've already seen this package, exit immediately
  if (seen[canonicalId]) return true;
  seen[canonicalId] = true;
  
  // first try to find the package for the receiver
  pkg = this._packageFor(canonicalId, workingPackage);
  if (!pkg) return false; // nothing to do.

  // look at dependencies. make sure they are also loaded
  deps = pkg.get('dependencies');
  for(packageId in deps) {
    if (!deps.hasOwnProperty(packageId)) continue;
    vers = deps[packageId];
    canonicalId = this._canonicalPackageId(packageId, vers, pkg);
    if (!canonicalId) return false;
    return this._packageReady(canonicalId, pkg, seen);
  }
  
  return true;
};

/**
  Take a relative or fully qualified module name as well as an optional
  base module Id name and returns a fully qualified module name.  If you 
  pass a relative module name and no baseId, throws an exception.

  Any embedded package name will remain in-tact.

  resolve('foo', 'bar', 'my_package') => 'foo'
  resolve('./foo', 'bar/baz', 'my_package') => 'my_package:bar/foo'
  resolve('/foo/bar/baz', 'bar/baz', 'my_package') => 'default:/foo/bar/baz'
  resolve('foo/../bar', 'baz', 'my_package') => 'foo/bar'
  resolve('your_package:foo', 'baz', 'my_package') => 'your_package:foo'

  If the returned id does not include a packageId then the canonical() 
  method will attempt to resolve the ID by searching the default package, 
  then the current package, then looking for a package by the same name.

  @param {String} moduleId relative or fully qualified module id
  @param {String} baseId fully qualified base id
  @returns {String} fully qualified name
*/
Loader.prototype._resolve = function(moduleId, curModuleId, pkg){
  var path, len, idx, part, parts, packageId, err;

  // if id does not contain a packageId and it starts with a / then 
  // return with anonymous package id.
  if (moduleId[0]==='/' && moduleId.indexOf(':')<0) {
    return this.anonymousPackage.id + ':' + moduleId;
  }

  // contains relative components?
  if (moduleId.match(/(^\.\.?\/)|(\/\.\.?\/)|(\/\.\.?\/?$)/)) {

    // if we have a packageId embedded, get that first
    if ((idx=moduleId.indexOf(':'))>=0) {
      packageId = moduleId.slice(0,idx);
      moduleId  = moduleId.slice(idx+1);
      path      = []; // path must always be absolute.

    // if no package ID, then use baseId if first component is . or ..
    } else if (moduleId.match(/^\.\.?\//)) {
      if (!curModuleId) {
        throw new Error("id required to resolve relative id: "+moduleId);
      }

      // if base moduleId contains a packageId return an error
      if (curModuleId.indexOf(':')>=0) {
        throw new Error("current moduleId cannot contain packageId");
      }
        
      // use the pkg.id (which will be canonical)
      if (pkg) packageId = pkg.id;

      // work from current moduleId as base.  Ignore current module name
      path = curModuleId.split('/');
      path.pop(); 

    } else path = [];

    // iterate through path components and update path
    parts = moduleId.split('/');
    len   = parts.length;
    for(idx=0;idx<len;idx++) {
      part = parts[idx];
      if (part === '..') {
        if (path.length<1) throw new Error("invalid path: "+moduleId);
        path.pop();

      } else if (part !== '.') path.push(part);
    }

    moduleId = path.join('/');
    if (packageId) moduleId = joinPackageId(packageId, moduleId);
  }

  return moduleId ;
};


// ..........................................................
// SANDBOX
// 

/**
  A Sandbox maintains a cache of instantiated modules.  Whenever a modules 
  is instantiated, it will always be owned by a single sandbox.  This way
  when you required the same module more than once, you will always get the
  same module.
  
  Each sandbox is owned by a single loader, which is responsible for providing
  the sandbox with Factory objects to instantiate new modules.
  
  A sandbox can also have a 'main' module which can be used as a primary
  entry point for finding other related modules.
  
*/
var Sandbox = exports.extend(Object);
exports.Sandbox = Sandbox;

Sandbox.prototype.init = function(loader, env, args, mainModuleId) {
  this.loader = loader;
  this.env    = env;
  this.args   = args;
  if (mainModuleId) this.main(mainModuleId);

  this.clear();
};

Sandbox.prototype.catalogPackages = function(workingPackage) {
  return this.loader.catalogPackages(workingPackage);
};

Sandbox.prototype.createRequire = function(module) {
  
  var sandbox = this,
      curId   = module.id,
      curPkg  = module.ownerPackage,
      reqd;
      
  // basic synchronous require
  var req = function(moduleId, packageId) {
    if (packageId && moduleId.indexOf(':')<0) {
      if (packageId.isPackage) packageId = packageId.id;
      moduleId = packageId+':'+moduleId;
    }
    return sandbox.require(moduleId, curId, curPkg);
  };
  reqd = req.displayName = (curId||'(unknown)')+'#require';

  // expose any native require.  Mostly used by seed
  req.nativeRequire = sandbox.nativeRequire;
  
  // async version - packageId is optional
  req.ensure = function(moduleIds, done) {
    // always normalize moduleId to an array
    if (!isArray(moduleIds)) {
      moduleIds = Array.prototype.slice.call(arguments);
      done = moduleIds.pop();
    }

    // ensure each module is loaded 
    parallel(moduleIds, function(moduleId, done) {
      sandbox.ensure(moduleId, curId, curPkg, done);

    })(function(err) { 
      if (err) return done(err);
      if (done.length<=1) return done(); // don't lookup modules themselves
      
      done(null, map(moduleIds, function(moduleId) {
        return sandbox.require(moduleId, curId, curPkg);
      }));
    });
  };
  req.ensure.displayName = reqd+'.ensure';
  
  // return true if the passed module or modules are ready for use right now
  // this is like calling ensure() but it won't load anything that isn't 
  // actually ready
  req.ready = function(moduleIds) {
    var idx, len ;
    
    // always normalize moduleId to an array
    if (!isArray(moduleIds)) {
      moduleIds = Array.prototype.slice.call(arguments);
    }

    len = moduleIds.length;
    for(idx=0;idx<len;idx++) {
      if (!sandbox.ready(moduleIds[idx], curId, curPkg)) return false;
    }
    return true;
  };
  req.ready.displayName = reqd+'.ready';

  /**
    Returns the package for the named packageId and optional version from
    the perspective of the current package.  This invokes a similar method 
    on the sandbox, which will pass it along to the loader, though a secure
    sandbox may actually wrap the responses as well.
    
    This method only acts on packages available locally.  To get possibly
    remote packages, you must first call require.ensurePackage() to ensure
    the package and its dependencies have been loaded.
    
    @param {String} packageId
      The packageId to load
      
    @param {String} vers
      Optional version
      
    @returns {Package} the package or null
  */
  req.packageFor = function(packageId, vers) {
    return sandbox.packageFor(packageId, vers, curPkg);
  };
  req.packageFor.displayName = reqd+'.packageFor';
  
  /**
    Asynchronously loads the named package and any dependencies if needed.
    This is only required if you suspect your package may not be available 
    locally.  If your callback accepts only one parameter, then the packages
    will be loaded but not instantiated. The first parameter is always an 
    error object or null.
    
    If your callback accepts more than one parameter, then the packages will
    be instantiated and passed to your callback as well.
  
    If a package cannot be loaded for some reason, your callback will be 
    invoked with an error of type NotFound.
    
    @param {String} packageId
      The packageId to load
    
    @param {String} vers
      Optional version

    @param {Function} done
      Callback invoked once packages have loaded.
    
    @returns {Package} the package or null
  */
  req.ensurePackage = function(packageId, vers, done) {
    sandbox.ensurePackage(packageId, vers, curPkg, function(err) {
      if (err) return done(err);
      if (done.length <= 1) return done();
      done(null, sandbox.packageFor(packageId, vers, curPkg));
    });
  };
  req.ensurePackage.displayName = reqd+'.ensurePackage.displayName';
  
  /**
    Returns a catalog of all packages visible to the current module without
    any additional loading.  This may be an expensive operation; you should
    only use it when necessary to detect plugins, etc.
  */
  req.catalogPackages = function() {
    return sandbox.catalogPackages(curPkg);
  };
  
  // mark main module in sandbox
  req.main = sandbox.main();
  req.env  = sandbox.env;
  req.args = sandbox.args;
  req.sandbox = sandbox;
  req.loader  = sandbox.loader;
  
  req.isTiki = true; // walk like a duck
  
  return req;
};

// ..........................................................
// RESOLVING MODULE IDS
// 

Sandbox.prototype.Module = Module;

/**
  Retrieves a module object for the passed moduleId.  You can also pass 
  optional package information, including an optional curModuleId and a
  workingPackage.  You MUST pass at least a workingPackage.
  
  The returned module object represents the module but the module exports may
  not yet be instantiated.  Use require() to retrieve the module exports.
  
  @param {String} moduleId
    The module id to lookup.  Should include a nested packageId
    
  @param {String} curModuleId
    Optional current module id to resolve relative modules.
    
  @param {Package} workingPackage
    The working package making the request
    
  @returns {void}
*/
Sandbox.prototype.module = function(moduleId, curModuleId, workingPackage) {

  var ret, canonicalId, cache, packageId, idx, pkg;
  
  // assume canonicalId will normalize params
  canonicalId = this.loader.canonical(moduleId, curModuleId, workingPackage);
  if (!canonicalId) throw(new NotFound(moduleId, workingPackage));

  // get out of cache first
  cache = this.modules;
  if (!cache) cache = this.modules = {};
  if (ret = cache[canonicalId]) return ret;
  
  // not in cache...add it
  idx       = canonicalId.indexOf(':', 2);
  moduleId  = canonicalId.slice(idx+1);
  packageId = canonicalId.slice(0, idx);
  pkg = this.loader.packageFor(packageId, workingPackage);
  if (!pkg) throw(new NotFound(packageId, workingPackage));
  ret = cache[canonicalId] = new this.Module(moduleId, pkg, this);
  
  return ret ;
};

/**
  Returns the main module for the sandbox.  This should only be called 
  from the factory when it is setting main on itself.  Otherwise the main
  module may not exist yet.
  
  Note that the mainModule will be resolved using the anonymousPackage so
  the named module must be visible from there.
*/
Sandbox.prototype.main = function(newMainModuleId, workingPackage) {
  if (newMainModuleId !== undefined) {
    this._mainModule = null;
    this._mainModuleId = newMainModuleId;
    this._mainModuleWorkingPackage = workingPackage;
    return this;
    
  } else {
    if (!this._mainModule && this._mainModuleId) {
      workingPackage = this._mainModuleWorkingPackage;
      this._mainModule = this.module(this._mainModuleId, workingPackage);
    }
    return this._mainModule;
  }
};

/**
  Returns the exports for the named module.

  @param {String} moduleId
    The module id to lookup.  Should include a nested packageId
  
  @param {String} curModuleId
    Optional current module id to resolve relative modules.
  
  @param {Package} workingPackage
    The working package making the request
  
  @param {Function} done
    Callback to invoke when the module has been retrieved.
  
  @returns {void}
*/
Sandbox.prototype.require = function(moduleId, curModuleId, workingPackage) {

  var ret, canonicalId, cache, used, factory, module, exp;
  
  // assume canonical() will normalize params
  canonicalId = this.loader.canonical(moduleId, curModuleId, workingPackage);
  if (!canonicalId) throw new NotFound(moduleId, workingPackage);

  // return out of cache
  cache = this.exports; used  = this.usedExports;
  if (!cache) cache = this.exports = {};
  if (!used)  used  = this.usedExports = {};
  if (ret = cache[canonicalId]) {
    ret = ret.exports;
    if (!used[canonicalId]) used[canonicalId] = ret;
    return ret;
  }

  // not in cache, get factory, module, and run function...
  factory = this.loader.load(canonicalId, workingPackage, this);
  if (!factory) throw(new NotFound(canonicalId, workingPackage));

  module  = this.module(canonicalId, workingPackage);
  cache[canonicalId] = module;

  exp = factory.call(this, module);
  module.exports = exp;
  
  // check for cyclical refs
  if (used[canonicalId] && (used[canonicalId] !== exp)) {
    throw new Error("cyclical requires() in "+canonicalId);
  }

  return exp;
};

/**
  Returns true if the given module is ready. This checks the local cache 
  first then hands this off to the loader.
*/
Sandbox.prototype.ready = function(moduleId, curModuleId, workingPackage) {
  // assume canonicalPackageId() will normalize params
  var id = this.loader.canonical(moduleId, curModuleId, workingPackage);
  return id ? this.loader.ready(id) : false;
};

/**
  Ensures the passed moduleId and all of its dependencies are available in
  the local domain.  If any dependencies are not available locally, attempts
  to retrieve them from a remote server.
  
  You don't usually call this method directly.  Instead you should call the 
  require.ensure() method defined on a module's local require() method.
  
*/
Sandbox.prototype.ensure = function(moduleId, curModuleId, workingPackage, done) {

  var id, loader, packageId, idx;
  
  // normalize params so that done is in right place
  if (curModuleId && (T_STRING !== typeof curModuleId)) {
    done = workingPackage;
    workingPackage = curModuleId;
    curModuleId = null;
  }
  
  if (workingPackage && (T_FUNCTION === typeof workingPackage)) {
    done = workingPackage ;
    workingPackage = null;
  }
  
  id = this.loader.canonical(moduleId, curModuleId, workingPackage);
  if (!id) return done(new NotFound(moduleId, workingPackage));
  
  idx       = id.indexOf(':', 2);
  moduleId  = id.slice(idx+1);
  packageId = id.slice(0, idx);
  loader    = this.loader;

  loader.ensurePackage(packageId, workingPackage, function(err) {
    if (err) return done(err);
    var pkg = loader.packageFor(packageId, workingPackage);
    if (!pkg.exists(moduleId)) done(new NotFound(moduleId, pkg));
    else done(); // all clear
  });
};

/**
  TODO: document
*/
Sandbox.prototype.packageFor = function(packageId, vers, workingPackage) {

  // assume canonicalPackageId() will normalize params
  var id = this.loader.canonicalPackageId(packageId, vers, workingPackage);
  if (!id) return null;
  return this.loader.packageFor(id);
};

/** 
  TODO: document
*/
Sandbox.prototype.ensurePackage = function(packageId, vers, workingPackage, done) {

  // normalize params so that done is in right place
  if (vers && (T_STRING !== typeof vers)) {
    done = workingPackage;
    workingPackage = vers;
    vers = null;
  }
  
  if (workingPackage && (T_FUNCTION === typeof workingPackage)) {
    done = workingPackage ;
    workingPackage = null;
  }
  
  var id = this.loader.canonicalPackageId(packageId, vers, workingPackage);
  if (!id) return done(new NotFound(packageId, workingPackage));
  this.loader.ensurePackage(id, done);
};


/**
  Returns the path or URL to a resource in the named package. 
*/
Sandbox.prototype.resource = function(resourceId, moduleId, ownerPackage) {
  if (!ownerPackage.resource) return null;
  return ownerPackage.resource(resourceId, moduleId);
};

/**
  Clears the sandbox.  requiring modules will cause them to be reinstantied
*/
Sandbox.prototype.clear = function() {
  this.exports = {};
  this.modules = {};
  this.usedExports = {};
  return this;
};

// ..........................................................
// BROWSER
// 

// Implements a default loader source for use in the browser.  This object
// should also be set as the "require" global on the browser to allow for
// module registrations

var Browser = exports.extend(Object);
exports.Browser = Browser;

Browser.prototype.init = function() {
  this._ready  = {};
  this._unload = {};
  
  this.clear();
};

/**
  Reset the browser caches.  This would require all packages and modules 
  to register themselves.  You should also clear the associated loader and
  sandbox if you use this.
*/
Browser.prototype.clear = function() {
  this.packageInfoByName = {}; // stores package info sorted by name/version
  this.packageInfoById   = {}; // stores package info sorted by id
  this.packages    = {}; // instantiated packages
  this.factories   = {}; // registered module factories by id

  this.stylesheetActions = {}; // resolvable stylesheet load actions
  this.scriptActions     = {}; // resolvable script actions
  this.ensureActions     = {}; // resolvable package actions
};

/**
  Configures a basic sandbox environment based on the browser.  Now you can
  register and require from it.
  
  @returns {Browser} new instance
*/
Browser.start = function(env, args, queue) {
  // build new chain of objects and setup require.
  var browser, len, idx, action;
  
  browser         = new Browser();
  browser.loader  = new Loader([browser]);
  browser.sandbox = new Sandbox(browser.loader, env, args);
  browser.queue   = queue;

  var mod = { 
    id: 'index', 
    ownerPackage: browser.loader.anonymousPackage 
  };

  browser.require = browser.sandbox.createRequire(mod);
  // TODO: amend standard CommonJS methods for loading modules when they
  // are standardized
  
  return browser;
};

Browser.prototype.replay = function() {
  var queue = this.queue,
      len   = queue ? queue.length : 0,
      idx, action;
      
  this.queue = null;
  for(idx=0;idx<len;idx++) {
    action = queue[idx];
    this[action.m].apply(this, action.a);
  }
  
  return this;
};

// safe - in place of preamble start()
Browser.prototype.start = function() {
  return this;
};

/**
  Makes all dependencies of the passed canonical packageId global.  Used
  for backwards compatibility with non-CommonJS libraries.
*/
Browser.prototype.global = function(canonicalId) {
  if (!domAvailable && !xhrAvailable) return this;  // don't work out of brsr
  var GLOBAL = (function() { return this; })();
  
  var globals, pkg, deps, packageId, exports, keys, key, idx, len;
  
  globals = this.globals;
  if (!globals) globals = this.globals = {};

  pkg = this.packageFor(canonicalId);
  if (!pkg) throw new Error(canonicalId+' package not found');
  
  deps = pkg.get('dependencies');
  if (!deps) return this; // nothing to do
  
  for(packageId in deps) {
    if (!deps.hasOwnProperty(packageId)) continue;
    canonicalId  = this.loader.canonical(packageId, pkg);
    if (globals[canonicalId]) continue;
    globals[canonicalId] = true;
    
    // some cases a dependency refers to a package that is itself not 
    // using modules.  In this case just ignore
    if (!this.sandbox.ready(packageId, pkg)) continue;
    
    exports = this.sandbox.require(packageId, pkg);
    if (keys = exports.__globals__) {
      len = keys.length;
      for(idx=0;idx<len;idx++) {
        key = keys[idx];
        GLOBAL[key] = exports[key];
      }

    // no __globals__ key is defined so just iterate through any exported
    // properties. this should actually be the more common case
    } else {
      for(key in exports) {
        if (!exports.hasOwnProperty(key)) continue;
        GLOBAL[key] = exports[key];
      }
    }
    
  }

  return this;
};

// ..........................................................
// Ready & Unload Handlers
// 

var buildInvocation = function(args) {
  var context, method;
  
  if (args.length === 1) {
    context = null;
    method  = args[0];
    args = Array.prototype.slice.call(args, 1);
  } else {
    context = args[0];
    method  = args[1];
    args    = Array.prototype.slice.call(args, 2);
  }

  return { target: context, method: method, args: args };
};

var queueListener = function(base, queueName, args) {
  if (!base[queueName]) base[queueName] = [];
  base[queueName].push(buildInvocation(args));
};

/**
  Invoke the passed callback when the document is ready.  You can pass 
  either an object/function or a moduleId and property name plus additional
  arguments.
*/
Browser.prototype.addReadyListener = function(context, method) {
  if (this._ready && this._ready.isReady) {
    this._invoke(buildInvocation(arguments));
  } else {
    this._setupReadyListener();
    queueListener(this._ready, 'queue', arguments);
  }
};

/**
  Invoke the passed callback just after any ready listeners have fired but
  just before the main moduleId is required.  This is primarily provided as 
  a way for legacy environments to hook in their own main function.
*/
Browser.prototype.addMainListener = function(context, method) {
  if (this._ready && this._ready.isReady) {
    this._invoke(buildInvocation(arguments));
  } else {
    this._setupReadyListener();
    queueListener(this._ready, 'mqueue', arguments);
  }
};

/**
  Invoke the passed callback when the browser is about to unload.
*/
Browser.prototype.addUnloadListener = function(context, method) {
  if (this._unload && this._unload.isUnloading) {
    this._invoke(buildInvocation(arguments));
  } else {
    this._setupUnloadListener();
    queueListener(this._unload, 'queue', arguments);
  }
};


Browser.prototype._invoke = function(inv) {
  var target = inv.target, method = inv.method;
  if (T_STRING === typeof target) target = this.require(target);
  if (T_STRING === typeof method) method = target[method];
  if (method) method.apply(target, inv.args);
  inv.target = inv.method = inv.args = null;
};

Browser.prototype._setupReadyListener = function() {
  if (this._ready.setup) return this;
  this._ready.setup =true;
  
  var ready = this._ready, source = this, fire;
  
  fire = function() {
    if (ready.isReady) return;
    ready.isReady = true;
    
    // first cleanup any listeners so they don't fire again
    if (ready.cleanup) ready.cleanup();
    ready.cleanup = null;
    
    var q, len, idx;
    
    q = ready.queue;
    len = q ? q.length : 0;
    ready.queue = null;
    for(idx=0;idx<len;idx++) source._invoke(q[idx]);
    
    q = ready.mqueue;
    len = q ? q.length : 0 ;
    ready.mqueue = null;
    for(idx=0;idx<len;idx++) source._invoke(q[idx]);

    source._runMain(); // get main module.
  };
      
  // always listen for onready event - detect based on platform
  // those code is derived from jquery 1.3.1
  // server-side JS
  if (T_UNDEFINED === typeof document) {
    // TODO: handler server-side JS cases here

  // Mozilla, Opera, webkit nightlies
  } else if (document.addEventListener) {

    // cleanup handler to be called whenever any registered listener fires
    // should prevent additional listeners from firing
    ready.cleanup = function() {
      document.removeEventListener('DOMContentLoaded', fire, false);
      document.removeEventListener('load', fire, false);
    };

    // register listeners
    document.addEventListener('DOMContentLoaded', fire, false);
    document.addEventListener('load', fire, false);

  // IE
  } else if (document.attachEvent) {

    // cleanup handler - should cleanup all registered listeners
    ready.cleanup = function() {
      document.detachEvent('onreadystatechange', fire);
      document.detachEvent('onload', fire);
      ready.ieHandler = null; // will stop the ieHandler from firing again
    };

    // listen for readystate and load events
    document.attachEvent('onreadystatechange', fire);
    document.attachEvent('onload', fire);

    // also if IE and no an iframe, continually check to see if the document 
    // is ready
    // NOTE: DO NOT CHANGE TO ===, FAILS IN IE.
    if ( document.documentElement.doScroll && window == window.top ) {
      ready.ieHandler = function() {

        // If IE is used, use the trick by Diego Perini
        // http://javascript.nwbox.com/IEContentLoaded/
        if (ready.ieHandler && !ready.isReady) {
          try {
            document.documentElement.doScroll("left");
          } catch( error ) {
            setTimeout( ready.ieHandler, 0 );
            return;
          }
        }

        // and execute any waiting functions
        fire();
      };

      ready.ieHandler();
    }

  }  
};

Browser._scheduleUnloadListener = function() {
  if (this._unload.setup) return this;
  this._unload.setup =true;
  
  var unload = this._unload, source = this, fire;

  unload.isUnloading = false;
  fire = function() { 
    if (unload.isUnloading) return;
    unload.isUnloading = true;
    
    if (unload.cleanup) unload.cleanup();
    unload.cleanup = null;
    
    var q = unload.queue,
        len = q ? q.length : 0,
        idx, inv;
        
    unload.queue = null;
    for(idx=0;idx<len;idx++) source._invoke(q[idx]);
  };

  if (T_UNDEFINED === typeof document) {
    // TODO: Handle server-side JS mode
    
  } else if (document.addEventListener) {
    unload.cleanup = function() {
      document.removeEventListener('unload', fire);
    };
    document.addEventListener('unload', fire, false);
    
  } else if (document.attachEvent) {
    unload.cleanup = function() {
      document.detachEvent('onunload', fire);
    };
    document.attachEvent('unload', fire);
  }
  
};

// ..........................................................
// Registration API
// 

/**
  Sets the main moduleId on the sandbox.  This module will be automatically
  required after all other ready and main handlers have run when the document
  is ready.
  
  @param {String} moduleId
    A moduleId with packageId included ideally.  Can be canonicalId.
    
  @returns {void}
*/
Browser.prototype.main = function(moduleId, method) {
  if (this.sandbox) this.sandbox.main(moduleId);
  this._setupReadyListener(); // make sure we listen for ready event
  this._main = { id: moduleId, method: method };
};

Browser.prototype._runMain = function() {
  if (!this._main) return ;
  
  var moduleId = this._main.id,
      method   = this._main.method,
      req      = this.require;
  
  if (!moduleId || !req) return ;
  this._main = null;

  // async load any main module dependencies if needed then require
  req.ensure(moduleId, function(err) {
    if (err) throw err;
    var exp = req(moduleId);
    if (T_STRING === typeof method) method = exp[method];
    if (method) method.call(exp);
  });
};


// creates a new action that will invoke the passed value then setup the
// resolve() method to wait on response
Browser.prototype._action  = function(action) {
  var ret;
  
  ret = once(function(done) {
    ret.resolve = function(err, val) {
      ret.resolve = null; // no more...
      done(err, val);
    };
    action(); 
  });
  return ret;
  
};

Browser.prototype._resolve = function(dict, key, value) {
  
  // for pushed content, just create the action function
  if (!dict[key]) dict[key] = function(done) { done(null, value); };
  
  // if a value already exists, call resolve if still valid
  else if (dict[key].resolve) dict[key].resolve(null, value);
  return this;
};

Browser.prototype._fail = function(dict, key, err) {
  if (dict[key].resolve) dict[key].resolve(err);
};

var T_SCRIPT     = 'script',
    T_STYLESHEET = 'stylesheet',
    T_RESOURCE   = 'resource';
    
/**
  Normalizes package info, expanding some compacted items out to full 
  info needed.
*/
Browser.prototype._normalize = function(def, packageId) {
  if (!isCanonicalId(packageId)) packageId = '::'+packageId;
  def.id = packageId;
  def.version = semver.normalize(def.version);
  def['tiki:external'] = !!def['tiki:external']; 
  def['tiki:private']  = !!def['tiki:private'];  // ditto

  // expand list of resources
  var base = def['tiki:base']; 
  if (def['tiki:resources']) {

    def['tiki:resources'] = map(def['tiki:resources'], function(item) {
      
      // expand a simple string into a default entry
      if (T_STRING === typeof item) {
        item = { 
          id: packageId+':'+item,
          name: item 
        };
      }

      // must have an item name or you can't lookup the resource
      if (!item.name) {
        throw new InvalidPackageDef(def, 'resources must have a name');
      }

      if (!item.id) {
        item.id = packageId+':'+item.name;
      }
      if (!isCanonicalId(item.id)) item.id = '::'+item.id;
      
      // assume type from ext if one is provided
      if (!item.type) {
        if (item.name.match(/\.js$/)) item.type = T_SCRIPT;
        else if (item.name.match(/\.css$/)) item.type = T_STYLESHEET;
        else item.type = T_RESOURCE;
      }
      
      if (!item.url) {
        if (base) item.url = base+'/'+item.name;
        else item.url = item.id+item.name;
      }
      
      return item;
    });
  }
   
  // always have a nested and dependencies hash, even if it is empty
  if (!def.dependencies) def.dependencies = {};

  var nested = def['tiki:nested'], key;
  if (nested) {
    for(key in nested) {
      if (!nested.hasOwnProperty(key)) continue;
      if (!isCanonicalId(nested[key])) nested[key] = '::'+nested[key];
    }
    
  } else def['tiki:nested'] = {};
  
  return def;
};

/**
  Register new package information.
*/
Browser.prototype.register = function(packageId, def) {
  var reg, replace, name, vers, idx = -1;
  
  // normalize some basics...
  def = this._normalize(def, packageId);
  packageId = def.id; // make sure to get normalized packageId

  // see if a pkg with same id is registered.  if so, replace it only if 
  // the new one is not external and the old one is
  reg = this.packageInfoById;
  if (!reg) reg = this.packageInfoById = {};
  if (reg[packageId]) {
    if (!reg[packageId]['tiki:external']) return this;
    replace = reg[packageId];
  }
  reg[packageId] = def;
  
  if (def.name) {
    name = def.name;
    vers = def.version;
    
    reg = this.packageInfoByName;
    if (!reg) reg = this.packageInfoByName = {};
    if (!reg[name]) reg[name] = {};
    reg = reg[name];
    
    // update list of packageIds matching version...
    if (!reg[vers] || (reg[vers].length<=1)) {
      reg[vers] = [def];
    } else {
      if (replace) idx = reg[vers].indexOf(replace);
      if (idx>=0) {
        reg[vers] = reg[vers].slice(0, idx).concat(reg[vers].slice(idx+1));
      }
      reg[vers].push(def);
    }
    
  }
  
  return this;
};

/**
  Main registration API for all modules.  Simply registers a module for later
  use by a package.
*/
Browser.prototype.module = function(key, def) {
  if (!isCanonicalId(key)) key = '::'+key;
  this.factories[key] = def;
  return this; 
};

/**
  Register a script that has loaded
*/
Browser.prototype.script = function(scriptId) {
  if (!isCanonicalId(scriptId)) scriptId = '::'+scriptId;
  this._resolve(this.scriptActions, scriptId, true);
};

/**
  Register a stylesheet that has loaded.
*/
Browser.prototype.stylesheet = function(stylesheetId) {
  if (!isCanonicalId(stylesheetId)) stylesheetId = '::'+stylesheetId;
  this._resolve(this.stylesheetActions, stylesheetId, true);
};

// ..........................................................
// Called by Loader
//

var domAvailable = T_UNDEFINED !== typeof document && document.createElement;
var xhrAvailable = T_UNDEFINED !== typeof XMLHttpRequest;

/**
  Whether to use XHR by default. If true, XHR is tried first to fetch script
  resources; script tag injection is only used as a fallback if XHR fails. If
  false (the default if the DOM is available), script tag injection is tried
  first, and XHR is used as the fallback.
*/
Browser.prototype.xhr = !domAvailable;

/**
  Whether to automatically wrap the fetched JavaScript in tiki.module() and
  tiki.script() calls. With this on, CommonJS modules will "just work" without
  preprocessing. Setting this to true requires, and implies, that XHR will be
  used to fetch the files.
*/
Browser.prototype.autowrap = false;

var findPublicPackageInfo = function(infos) {
  if (!infos) return null;
  
  var loc = infos.length;
  while(--loc>=0) {
    if (!infos[loc]['tiki:private']) return infos[loc];
  }
  return null;
};

/**
  Find the canonical package ID for the passed package ID and optional 
  version.  This will look through all the registered package infos, only
  searching those that are not private, but including external references.
*/
Browser.prototype.canonicalPackageId = function(packageId, vers) {
  var info = this.packageInfoByName[packageId],
      ret, cur, cvers, rvers;
  
  if (vers) vers = semver.normalize(vers);
  if (!info) return null; // not found
  
  // see if we have caught a lucky break
  if (info[vers] && (info[vers].length===1)) return info[vers][0].id;

  // need to search...
  for(cvers in info) {
    if (!info.hasOwnProperty(cvers)) continue;
    if (!semver.compatible(vers, cvers)) continue;
    if (!ret || (semver.compare(rvers, cvers)<0)) {
      ret = findPublicPackageInfo(info[cvers]);
      if (ret) rvers = cvers; 
    }
  }
  
  return ret ? ret.id : null;
};

// get package for canonicalId, instantiate if needed
Browser.prototype.packageFor = function(canonicalId) {
  var ret = this.packages[canonicalId];
  if (ret) return ret ;

  // instantiate if needed
  ret = this.packageInfoById[canonicalId];
  if (ret && !ret['tiki:external']) { // external refs can't be instantiated
    ret = new this.Package(canonicalId, ret, this);
    this.packages[canonicalId] = ret;
    return ret ;
  }

  return null ; // not found
};

/**
  Ensures the named canonical packageId and all of its dependent scripts are
  loaded.
*/
Browser.prototype.ensurePackage = function(canonicalId, done) {
  var action = this.ensureActions[canonicalId];
  if (action) return action(done); // add another listener
  
  // no action get - get the package info and start one.
  var info = this.packageInfoById[canonicalId];
  if (!info) {
    return done(new NotFound(canonicalId, 'browser package info'));
  }
  
  var source = this;
  
  action = once(function(done) {
    var cnt = 1, ready = false, cancelled;
    
    // invoked when an action finishes.  Will resolve this action
    // when all of them finish.
    var cleanup = function(err) {
      if (cancelled) return;
      if (err) {
        cancelled = true;
        return done(err);
      }
      
      cnt = cnt-1;
      if (cnt<=0 && ready) return done(null, info);
    };

    // proactively kick off any known packages.  If a dependent package
    // is not known here just skip it for now.  This is just an optimization
    // anyway.  The Loader will take care of ensuring all dependencies are
    // really met.
    var dependencies = info.dependencies,
        nested       = info['tiki:nested'],
        packageId, vers, depInfo, curId;

    for(packageId in dependencies) {
      if (!dependencies.hasOwnProperty(packageId)) continue;
      curId = nested[packageId];
      if (!curId) {
        vers = dependencies[packageId];
        curId = source.canonicalPackageId(packageId, vers);
      }
      
      if (curId && source.packageInfoById[canonicalId]) {
        cnt++;
        source.ensurePackage(curId, cleanup);
      }
    }
    
    // step through resources and kick off each script and stylesheet
    var resources = info['tiki:resources'], 
        lim = resources ? resources.length : 0,
        loc, rsrc;
    for(loc=0;loc<lim;loc++) {
      rsrc = resources[loc];
      if (rsrc.type === T_RESOURCE) continue;
      if (rsrc.type === T_SCRIPT) {
        cnt++;
        source.ensureScript(rsrc.id, rsrc.url, cleanup);
      } else if (rsrc.type === T_STYLESHEET) {
        cnt++;
        source.ensureStylesheet(rsrc.id, rsrc.url, cleanup);
      }
    }
      
    // done, set ready to true so that the final handler can fire
    ready = true;
    cleanup(); 
    
  });
  
  this.ensureActions[canonicalId] = action;
  action(done); // kick off
};

Browser.prototype.ensureScript = function(id, url, done) {
  var action = this.scriptActions[id];
  if (action) return action(done);
  
  var source = this;
  action = this._action(function() {
    source._loadScript(id, url);
  });
  
  this.scriptActions[id] = action;
  return action(done);
};

Browser.prototype.ensureStylesheet = function(id, url, done) {
  var action = this.stylesheetActions[id];
  if (action) return action(done);
  
  var source = this;
  action = this._action(function() {
    source._loadStylesheet(id, url);
  });

  this.stylesheetActions[id] = action;
  return action(done);
};

Browser.prototype._injectScript = function(id, url) {
  var body, el;

  body = document.body;
  el = document.createElement('script');
  el.src = url;
  body.appendChild(el);
  body = el = null;
};

Browser.prototype._xhrScript = function(id, url) {
  var autowrap = this.autowrap;

  var req = new XMLHttpRequest();
  req.open('GET', url, true);
  req.onreadystatechange = function(evt) {
    // Accept 200 or 0 for local file requests.
    if (req.readyState !== 4 || (req.status !== 200 && req.status !== 0)) {
      return;
    }

    var src = req.responseText;
    if (autowrap) {
      src = "tiki.module('" + id + "', function(require, exports, module) {" +
        src + "});" + "tiki.script('" + id + "');";
    }

    // Add a Firebug-style sourceURL parameter to help debugging.
    eval(src + "\n//@ sourceURL=" + url);

    // Immediately return after the eval. The script may have stomped all over
    // our local state.
  };

  req.send(null);
};

Browser.prototype._loadScript = function(id, url) {
    if (this.autowrap) {
        this.xhr = true;
        if (!xhrAvailable) {
            DEBUG('Autowrap is on but XHR is not available. Danger ahead.');
        }
    }

    if (xhrAvailable && domAvailable) {
        if (this.xhr) {
            try {
                return this._xhrScript(id, url);
            } catch (e) {
                return this._injectScript(id, url);
            }
        } else {
            try {
                return this._injectScript(id, url);
            } catch (e) {
                return this._xhrScript(id, url);
            }
        }
    } else if (xhrAvailable) {
        return this._xhrScript(id, url);
    } else if (domAvailable) {
        return this._injectScript(id, url);
    }

    DEBUG('Browser#_loadScript() not supported on this platform.');
    this.script(id);
};

if (domAvailable) {
  // actually loads the stylesheet.  separated out to ease unit testing
  Browser.prototype._loadStylesheet = function(id, url) {
    var body, el;
    
    body = document.getElementsByTagName('head')[0] || document.body;
    el   = document.createElement('link');
    el.rel = 'stylesheet';
    el.href = url;
    el.type = 'text/css';
    body.appendChild(el);
    el = body = null;

    this.stylesheet(id); // no onload support - just notify now.
  };
} else {
  // actually loads the stylesheet.  separated out to ease unit testing
  Browser.prototype._loadStylesheet = function(id, url) {
    DEBUG('Browser#_loadStylesheet() not supported on this platform.');
    this.stylesheet(id);
  };
}



// ..........................................................
// BROWSER PACKAGE
// 

/**
  Special edition of Package designed to work with the Browser source.  This
  kind of package knows how to get its data out of the Browser source on 
  demand.
*/
var BrowserPackage = Package.extend();
Browser.prototype.Package = BrowserPackage;

BrowserPackage.prototype.init = function(id, config, source) {
  Package.prototype.init.call(this, id, config);
  this.source = source;
};

// if not self, look for nested packages
BrowserPackage.prototype.canonicalPackageId = function(packageId, vers) {
  var ret, nested, info;
  
  ret = Package.prototype.canonicalPackageId.call(this, packageId, vers);
  if (ret) return ret ;
  
  nested = this.get('tiki:nested') || {}; 
  ret = nested[packageId];
  if (!ret) return null;

  info = this.source.packageInfoById[ret];
  return info && semver.compatible(vers,info.version) ? ret : null;
};

BrowserPackage.prototype.packageFor = function(canonicalId) {
  var ret = Package.prototype.packageFor.call(this, canonicalId);
  return ret ? ret : this.source.packageFor(canonicalId);
};

BrowserPackage.prototype.ensurePackage = function(canonicalId, done) {
  if (canonicalId === this.id) return done(); 
  this.source.ensurePackage(canonicalId, done);
};

BrowserPackage.prototype.catalogPackages = function() {
  var ret = [this], nested, key;

  nested = this.get('tiki:nested') || {};
  for(key in nested) {
    if (!nested.hasOwnProperty(key)) continue;
    ret.push(this.source.packageFor(nested[key]));
  }
  
  return ret ;
};

BrowserPackage.prototype.exists = function(moduleId) {
  var canonicalId = this.id+':'+moduleId;
  return !!this.source.factories[canonicalId];
};

BrowserPackage.prototype.load = function(moduleId) {
  var canonicalId, factory;
  
  canonicalId = this.id+':'+moduleId;
  factory  = this.source.factories[canonicalId];
  return factory ? new this.Factory(moduleId, this, factory) : null;
};

BrowserPackage.prototype.Factory = Factory;


displayNames(exports, 'tiki');

});
// ==========================================================================
// Project:   Tiki - CommonJS Runtime
// Copyright: ©2009-2010 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see __preamble__.js)
// ==========================================================================
/*globals tiki ENV ARGS */

// This postamble runs when the loader and supporting modules are all 
// registered, allowing the real loader to replace the bootstrap version.
// it is not wrapped as a module so that it can run immediately.
"use modules false";
"use loader false";

// note that the loader.start method is safe so that calling this more than
// once will only setup the default loader once.
tiki = tiki.start();
tiki.replay(); // replay queue

bespin.tiki = tiki;
})();

;bespin.tiki.register("::jquery", {
    name: "jquery",
    dependencies: {  }
});
bespin.tiki.module("jquery:index",function(require,exports,module) {
"define metadata";
({});
"end";

/*!
 * jQuery JavaScript Library v1.4.2
 * http://jquery.com/
 *
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2010, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Sat Feb 13 22:33:48 2010 -0500
 */

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// (both of which we optimize for)
	quickExpr = /^[^<]*(<[\w\W]+>)[^>]*$|^#([\w-]+)$/,

	// Is it a simple selector
	isSimple = /^.[^:#\[\.,]*$/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	rtrim = /^(\s|\u00A0)+|(\s|\u00A0)+$/g,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,
	
	// Has the ready events already been bound?
	readyBound = false,
	
	// The functions to execute on DOM ready
	readyList = [],

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwnProperty = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	indexOf = Array.prototype.indexOf;

jQuery.fn = jQuery.prototype = {
	init: function( selector, context ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}
		
		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context ) {
			this.context = document;
			this[0] = document.body;
			this.selector = "body";
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			match = quickExpr.exec( selector );

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					doc = (context ? context.ownerDocument || context : document);

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = buildFragment( [ match[1] ], [ doc ] );
						selector = (ret.cacheable ? ret.fragment.cloneNode(true) : ret.fragment).childNodes;
					}
					
					return jQuery.merge( this, selector );
					
				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					if ( elem ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $("TAG")
			} else if ( !context && /^\w+$/.test( selector ) ) {
				this.selector = selector;
				this.context = document;
				selector = document.getElementsByTagName( selector );
				return jQuery.merge( this, selector );

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return (context || rootjQuery).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return jQuery( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if (selector.selector !== undefined) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.4.2",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this.slice(num)[ 0 ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = jQuery();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );
		
		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + (this.selector ? " " : "") + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},
	
	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// If the DOM is already ready
		if ( jQuery.isReady ) {
			// Execute the function immediately
			fn.call( document, jQuery );

		// Otherwise, remember the function for later
		} else if ( readyList ) {
			// Add the function to the wait list
			readyList.push( fn );
		}

		return this;
	},
	
	eq: function( i ) {
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, +i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},
	
	end: function() {
		return this.prevObject || jQuery(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	// copy reference to target object
	var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options, name, src, copy;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging object literal values or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || jQuery.isArray(copy) ) ) {
					var clone = src && ( jQuery.isPlainObject(src) || jQuery.isArray(src) ) ? src
						: jQuery.isArray(copy) ? [] : {};

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		window.$ = _$;

		if ( deep ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},
	
	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,
	
	// Handle when the DOM is ready
	ready: function() {
		// Make sure that the DOM is not already loaded
		if ( !jQuery.isReady ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 13 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If there are functions bound, to execute
			if ( readyList ) {
				// Execute all of them
				var fn, i = 0;
				while ( (fn = readyList[ i++ ]) ) {
					fn.call( document, jQuery );
				}

				// Reset the list of functions
				readyList = null;
			}

			// Trigger any bound ready events
			if ( jQuery.fn.triggerHandler ) {
				jQuery( document ).triggerHandler( "ready" );
			}
		}
	},
	
	bindReady: function() {
		if ( readyBound ) {
			return;
		}

		readyBound = true;

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			return jQuery.ready();
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
			
			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent("onreadystatechange", DOMContentLoaded);
			
			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return toString.call(obj) === "[object Function]";
	},

	isArray: function( obj ) {
		return toString.call(obj) === "[object Array]";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || toString.call(obj) !== "[object Object]" || obj.nodeType || obj.setInterval ) {
			return false;
		}
		
		// Not own constructor property must be Object
		if ( obj.constructor
			&& !hasOwnProperty.call(obj, "constructor")
			&& !hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf") ) {
			return false;
		}
		
		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
	
		var key;
		for ( key in obj ) {}
		
		return key === undefined || hasOwnProperty.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},
	
	error: function( msg ) {
		throw msg;
	},
	
	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );
		
		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( /^[\],:{}\s]*$/.test(data.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
			.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
			.replace(/(?:^|:|,)(?:\s*\[)+/g, "")) ) {

			// Try to use the native JSON parser first
			return window.JSON && window.JSON.parse ?
				window.JSON.parse( data ) :
				(new Function("return " + data))();

		} else {
			jQuery.error( "Invalid JSON: " + data );
		}
	},

	noop: function() {},

	// Evalulates a script in a global context
	globalEval: function( data ) {
		if ( data && rnotwhite.test(data) ) {
			// Inspired by code by Andrea Giammarchi
			// http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
			var head = document.getElementsByTagName("head")[0] || document.documentElement,
				script = document.createElement("script");

			script.type = "text/javascript";

			if ( jQuery.support.scriptEval ) {
				script.appendChild( document.createTextNode( data ) );
			} else {
				script.text = data;
			}

			// Use insertBefore instead of appendChild to circumvent an IE6 bug.
			// This arises when a base node is used (#2709).
			head.insertBefore( script, head.firstChild );
			head.removeChild( script );
		}
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction(object);

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( var value = object[0];
					i < length && callback.call( value, i, value ) !== false; value = object[++i] ) {}
			}
		}

		return object;
	},

	trim: function( text ) {
		return (text || "").replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// The extra typeof function check is to prevent crashes
			// in Safari 2 (See: #3039)
			if ( array.length == null || typeof array === "string" || jQuery.isFunction(array) || (typeof array !== "function" && array.setInterval) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array ) {
		if ( array.indexOf ) {
			return array.indexOf( elem );
		}

		for ( var i = 0, length = array.length; i < length; i++ ) {
			if ( array[ i ] === elem ) {
				return i;
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length, j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [];

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			if ( !inv !== !callback( elems[ i ], i ) ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var ret = [], value;

		// Go through the array, translating each of the items to their
		// new value (or values).
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			value = callback( elems[ i ], i, arg );

			if ( value != null ) {
				ret[ ret.length ] = value;
			}
		}

		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	proxy: function( fn, proxy, thisObject ) {
		if ( arguments.length === 2 ) {
			if ( typeof proxy === "string" ) {
				thisObject = fn;
				fn = thisObject[ proxy ];
				proxy = undefined;

			} else if ( proxy && !jQuery.isFunction( proxy ) ) {
				thisObject = proxy;
				proxy = undefined;
			}
		}

		if ( !proxy && fn ) {
			proxy = function() {
				return fn.apply( thisObject || this, arguments );
			};
		}

		// Set the guid of unique handler to the same of original handler, so it can be removed
		if ( fn ) {
			proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;
		}

		// So proxy can be declared as an argument
		return proxy;
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
			/(opera)(?:.*version)?[ \/]([\w.]+)/.exec( ua ) ||
			/(msie) ([\w.]+)/.exec( ua ) ||
			!/compatible/.test( ua ) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec( ua ) ||
		  	[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	browser: {}
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

if ( indexOf ) {
	jQuery.inArray = function( elem, array ) {
		return indexOf.call( array, elem );
	};
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch( error ) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

function evalScript( i, elem ) {
	if ( elem.src ) {
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});
	} else {
		jQuery.globalEval( elem.text || elem.textContent || elem.innerHTML || "" );
	}

	if ( elem.parentNode ) {
		elem.parentNode.removeChild( elem );
	}
}

// Mutifunctional method to get and set values to a collection
// The value/s can be optionally by executed if its a function
function access( elems, key, value, exec, fn, pass ) {
	var length = elems.length;
	
	// Setting many attributes
	if ( typeof key === "object" ) {
		for ( var k in key ) {
			access( elems, k, key[k], exec, fn, value );
		}
		return elems;
	}
	
	// Setting one attribute
	if ( value !== undefined ) {
		// Optionally, function values get executed if exec is true
		exec = !pass && exec && jQuery.isFunction(value);
		
		for ( var i = 0; i < length; i++ ) {
			fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
		}
		
		return elems;
	}
	
	// Getting an attribute
	return length ? fn( elems[0], key ) : undefined;
}

function now() {
	return (new Date).getTime();
}
(function() {

	jQuery.support = {};

	var root = document.documentElement,
		script = document.createElement("script"),
		div = document.createElement("div"),
		id = "script" + now();

	div.style.display = "none";
	div.innerHTML = "   <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	var all = div.getElementsByTagName("*"),
		a = div.getElementsByTagName("a")[0];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return;
	}

	jQuery.support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: div.firstChild.nodeType === 3,

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText insted)
		style: /red/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: a.getAttribute("href") === "/a",

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55$/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: div.getElementsByTagName("input")[0].value === "on",

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: document.createElement("select").appendChild( document.createElement("option") ).selected,

		parentNode: div.removeChild( div.appendChild( document.createElement("div") ) ).parentNode === null,

		// Will be defined later
		deleteExpando: true,
		checkClone: false,
		scriptEval: false,
		noCloneEvent: true,
		boxModel: null
	};

	script.type = "text/javascript";
	try {
		script.appendChild( document.createTextNode( "window." + id + "=1;" ) );
	} catch(e) {}

	root.insertBefore( script, root.firstChild );

	// Make sure that the execution of code works by injecting a script
	// tag with appendChild/createTextNode
	// (IE doesn't support this, fails, and uses .text instead)
	if ( window[ id ] ) {
		jQuery.support.scriptEval = true;
		delete window[ id ];
	}

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete script.test;
	
	} catch(e) {
		jQuery.support.deleteExpando = false;
	}

	root.removeChild( script );

	if ( div.attachEvent && div.fireEvent ) {
		div.attachEvent("onclick", function click() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			jQuery.support.noCloneEvent = false;
			div.detachEvent("onclick", click);
		});
		div.cloneNode(true).fireEvent("onclick");
	}

	div = document.createElement("div");
	div.innerHTML = "<input type='radio' name='radiotest' checked='checked'/>";

	var fragment = document.createDocumentFragment();
	fragment.appendChild( div.firstChild );

	// WebKit doesn't clone checked state correctly in fragments
	jQuery.support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;

	// Figure out if the W3C box model works as expected
	// document.body must exist before we can do this
	jQuery(function() {
		var div = document.createElement("div");
		div.style.width = div.style.paddingLeft = "1px";

		document.body.appendChild( div );
		jQuery.boxModel = jQuery.support.boxModel = div.offsetWidth === 2;
		document.body.removeChild( div ).style.display = 'none';

		div = null;
	});

	// Technique from Juriy Zaytsev
	// http://thinkweb2.com/projects/prototype/detecting-event-support-without-browser-sniffing/
	var eventSupported = function( eventName ) { 
		var el = document.createElement("div"); 
		eventName = "on" + eventName; 

		var isSupported = (eventName in el); 
		if ( !isSupported ) { 
			el.setAttribute(eventName, "return;"); 
			isSupported = typeof el[eventName] === "function"; 
		} 
		el = null; 

		return isSupported; 
	};
	
	jQuery.support.submitBubbles = eventSupported("submit");
	jQuery.support.changeBubbles = eventSupported("change");

	// release memory in IE
	root = script = div = all = a = null;
})();

jQuery.props = {
	"for": "htmlFor",
	"class": "className",
	readonly: "readOnly",
	maxlength: "maxLength",
	cellspacing: "cellSpacing",
	rowspan: "rowSpan",
	colspan: "colSpan",
	tabindex: "tabIndex",
	usemap: "useMap",
	frameborder: "frameBorder"
};
var expando = "jQuery" + now(), uuid = 0, windowData = {};

jQuery.extend({
	cache: {},
	
	expando:expando,

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		"object": true,
		"applet": true
	},

	data: function( elem, name, data ) {
		if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
			return;
		}

		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ], cache = jQuery.cache, thisCache;

		if ( !id && typeof name === "string" && data === undefined ) {
			return null;
		}

		// Compute a unique ID for the element
		if ( !id ) { 
			id = ++uuid;
		}

		// Avoid generating a new cache unless none exists and we
		// want to manipulate it.
		if ( typeof name === "object" ) {
			elem[ expando ] = id;
			thisCache = cache[ id ] = jQuery.extend(true, {}, name);

		} else if ( !cache[ id ] ) {
			elem[ expando ] = id;
			cache[ id ] = {};
		}

		thisCache = cache[ id ];

		// Prevent overriding the named cache with undefined values
		if ( data !== undefined ) {
			thisCache[ name ] = data;
		}

		return typeof name === "string" ? thisCache[ name ] : thisCache;
	},

	removeData: function( elem, name ) {
		if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
			return;
		}

		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ], cache = jQuery.cache, thisCache = cache[ id ];

		// If we want to remove a specific section of the element's data
		if ( name ) {
			if ( thisCache ) {
				// Remove the section of cache data
				delete thisCache[ name ];

				// If we've removed all the data, remove the element's cache
				if ( jQuery.isEmptyObject(thisCache) ) {
					jQuery.removeData( elem );
				}
			}

		// Otherwise, we want to remove all of the element's data
		} else {
			if ( jQuery.support.deleteExpando ) {
				delete elem[ jQuery.expando ];

			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( jQuery.expando );
			}

			// Completely remove the data cache
			delete cache[ id ];
		}
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		if ( typeof key === "undefined" && this.length ) {
			return jQuery.data( this[0] );

		} else if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		var parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			var data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			if ( data === undefined && this.length ) {
				data = jQuery.data( this[0], key );
			}
			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;
		} else {
			return this.trigger("setData" + parts[1] + "!", [parts[0], value]).each(function() {
				jQuery.data( this, key, value );
			});
		}
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});
jQuery.extend({
	queue: function( elem, type, data ) {
		if ( !elem ) {
			return;
		}

		type = (type || "fx") + "queue";
		var q = jQuery.data( elem, type );

		// Speed up dequeue by getting out quickly if this is just a lookup
		if ( !data ) {
			return q || [];
		}

		if ( !q || jQuery.isArray(data) ) {
			q = jQuery.data( elem, type, jQuery.makeArray(data) );

		} else {
			q.push( data );
		}

		return q;
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ), fn = queue.shift();

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift("inprogress");
			}

			fn.call(elem, function() {
				jQuery.dequeue(elem, type);
			});
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined ) {
			return jQuery.queue( this[0], type );
		}
		return this.each(function( i, elem ) {
			var queue = jQuery.queue( this, type, data );

			if ( type === "fx" && queue[0] !== "inprogress" ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},

	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
		type = type || "fx";

		return this.queue( type, function() {
			var elem = this;
			setTimeout(function() {
				jQuery.dequeue( elem, type );
			}, time );
		});
	},

	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	}
});
var rclass = /[\n\t]/g,
	rspace = /\s+/,
	rreturn = /\r/g,
	rspecialurl = /href|src|style/,
	rtype = /(button|input)/i,
	rfocusable = /(button|input|object|select|textarea)/i,
	rclickable = /^(a|area)$/i,
	rradiocheck = /radio|checkbox/;

jQuery.fn.extend({
	attr: function( name, value ) {
		return access( this, name, value, true, jQuery.attr );
	},

	removeAttr: function( name, fn ) {
		return this.each(function(){
			jQuery.attr( this, name, "" );
			if ( this.nodeType === 1 ) {
				this.removeAttribute( name );
			}
		});
	},

	addClass: function( value ) {
		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.addClass( value.call(this, i, self.attr("class")) );
			});
		}

		if ( value && typeof value === "string" ) {
			var classNames = (value || "").split( rspace );

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className ) {
						elem.className = value;

					} else {
						var className = " " + elem.className + " ", setClass = elem.className;
						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( className.indexOf( " " + classNames[c] + " " ) < 0 ) {
								setClass += " " + classNames[c];
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.removeClass( value.call(this, i, self.attr("class")) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			var classNames = (value || "").split(rspace);

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						var className = (" " + elem.className + " ").replace(rclass, " ");
						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[c] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value, isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.toggleClass( value.call(this, i, self.attr("class"), stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className, i = 0, self = jQuery(this),
					state = stateVal,
					classNames = value.split( rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery.data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery.data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ";
		for ( var i = 0, l = this.length; i < l; i++ ) {
			if ( (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		if ( value === undefined ) {
			var elem = this[0];

			if ( elem ) {
				if ( jQuery.nodeName( elem, "option" ) ) {
					return (elem.attributes.value || {}).specified ? elem.value : elem.text;
				}

				// We need to handle select boxes special
				if ( jQuery.nodeName( elem, "select" ) ) {
					var index = elem.selectedIndex,
						values = [],
						options = elem.options,
						one = elem.type === "select-one";

					// Nothing was selected
					if ( index < 0 ) {
						return null;
					}

					// Loop through all the selected options
					for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
						var option = options[ i ];

						if ( option.selected ) {
							// Get the specifc value for the option
							value = jQuery(option).val();

							// We don't need an array for one selects
							if ( one ) {
								return value;
							}

							// Multi-Selects return an array
							values.push( value );
						}
					}

					return values;
				}

				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				if ( rradiocheck.test( elem.type ) && !jQuery.support.checkOn ) {
					return elem.getAttribute("value") === null ? "on" : elem.value;
				}
				

				// Everything else, we just grab the value
				return (elem.value || "").replace(rreturn, "");

			}

			return undefined;
		}

		var isFunction = jQuery.isFunction(value);

		return this.each(function(i) {
			var self = jQuery(this), val = value;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call(this, i, self.val());
			}

			// Typecast each time if the value is a Function and the appended
			// value is therefore different each time.
			if ( typeof val === "number" ) {
				val += "";
			}

			if ( jQuery.isArray(val) && rradiocheck.test( this.type ) ) {
				this.checked = jQuery.inArray( self.val(), val ) >= 0;

			} else if ( jQuery.nodeName( this, "select" ) ) {
				var values = jQuery.makeArray(val);

				jQuery( "option", this ).each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					this.selectedIndex = -1;
				}

			} else {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},
		
	attr: function( elem, name, value, pass ) {
		// don't set attributes on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
			return undefined;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery(elem)[name](value);
		}

		var notxml = elem.nodeType !== 1 || !jQuery.isXMLDoc( elem ),
			// Whether we are setting (or getting)
			set = value !== undefined;

		// Try to normalize/fix the name
		name = notxml && jQuery.props[ name ] || name;

		// Only do all the following if this is a node (faster for style)
		if ( elem.nodeType === 1 ) {
			// These attributes require special treatment
			var special = rspecialurl.test( name );

			// Safari mis-reports the default selected property of an option
			// Accessing the parent's selectedIndex property fixes it
			if ( name === "selected" && !jQuery.support.optSelected ) {
				var parent = elem.parentNode;
				if ( parent ) {
					parent.selectedIndex;
	
					// Make sure that it also works with optgroups, see #5701
					if ( parent.parentNode ) {
						parent.parentNode.selectedIndex;
					}
				}
			}

			// If applicable, access the attribute via the DOM 0 way
			if ( name in elem && notxml && !special ) {
				if ( set ) {
					// We can't allow the type property to be changed (since it causes problems in IE)
					if ( name === "type" && rtype.test( elem.nodeName ) && elem.parentNode ) {
						jQuery.error( "type property can't be changed" );
					}

					elem[ name ] = value;
				}

				// browsers index elements by id/name on forms, give priority to attributes.
				if ( jQuery.nodeName( elem, "form" ) && elem.getAttributeNode(name) ) {
					return elem.getAttributeNode( name ).nodeValue;
				}

				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				if ( name === "tabIndex" ) {
					var attributeNode = elem.getAttributeNode( "tabIndex" );

					return attributeNode && attributeNode.specified ?
						attributeNode.value :
						rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
							0 :
							undefined;
				}

				return elem[ name ];
			}

			if ( !jQuery.support.style && notxml && name === "style" ) {
				if ( set ) {
					elem.style.cssText = "" + value;
				}

				return elem.style.cssText;
			}

			if ( set ) {
				// convert the value to a string (all browsers do this but IE) see #1070
				elem.setAttribute( name, "" + value );
			}

			var attr = !jQuery.support.hrefNormalized && notxml && special ?
					// Some attributes require a special call on IE
					elem.getAttribute( name, 2 ) :
					elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return attr === null ? undefined : attr;
		}

		// elem is actually elem.style ... set the style
		// Using attr for specific style information is now deprecated. Use style instead.
		return jQuery.style( elem, name, value );
	}
});
var rnamespaces = /\.(.*)$/,
	fcleanup = function( nm ) {
		return nm.replace(/[^\w\s\.\|`]/g, function( ch ) {
			return "\\" + ch;
		});
	};

/*
 * A number of helper functions used for managing events.
 * Many of the ideas behind this code originated from
 * Dean Edwards' addEvent library.
 */
jQuery.event = {

	// Bind an event to an element
	// Original by Dean Edwards
	add: function( elem, types, handler, data ) {
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// For whatever reason, IE has trouble passing the window object
		// around, causing it to be cloned in the process
		if ( elem.setInterval && ( elem !== window && !elem.frameElement ) ) {
			elem = window;
		}

		var handleObjIn, handleObj;

		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
		}

		// Make sure that the function being executed has a unique ID
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure
		var elemData = jQuery.data( elem );

		// If no elemData is found then we must be trying to bind to one of the
		// banned noData elements
		if ( !elemData ) {
			return;
		}

		var events = elemData.events = elemData.events || {},
			eventHandle = elemData.handle, eventHandle;

		if ( !eventHandle ) {
			elemData.handle = eventHandle = function() {
				// Handle the second event of a trigger and when
				// an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && !jQuery.event.triggered ?
					jQuery.event.handle.apply( eventHandle.elem, arguments ) :
					undefined;
			};
		}

		// Add elem as a property of the handle function
		// This is to prevent a memory leak with non-native events in IE.
		eventHandle.elem = elem;

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = types.split(" ");

		var type, i = 0, namespaces;

		while ( (type = types[ i++ ]) ) {
			handleObj = handleObjIn ?
				jQuery.extend({}, handleObjIn) :
				{ handler: handler, data: data };

			// Namespaced event handlers
			if ( type.indexOf(".") > -1 ) {
				namespaces = type.split(".");
				type = namespaces.shift();
				handleObj.namespace = namespaces.slice(0).sort().join(".");

			} else {
				namespaces = [];
				handleObj.namespace = "";
			}

			handleObj.type = type;
			handleObj.guid = handler.guid;

			// Get the current list of functions bound to this event
			var handlers = events[ type ],
				special = jQuery.event.special[ type ] || {};

			// Init the event handler queue
			if ( !handlers ) {
				handlers = events[ type ] = [];

				// Check for a special event handler
				// Only use addEventListener/attachEvent if the special
				// events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}
			
			if ( special.add ) { 
				special.add.call( elem, handleObj ); 

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add the function to the element's handler list
			handlers.push( handleObj );

			// Keep track of which events have been used, for global triggering
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, pos ) {
		// don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		var ret, type, fn, i = 0, all, namespaces, namespace, special, eventType, handleObj, origType,
			elemData = jQuery.data( elem ),
			events = elemData && elemData.events;

		if ( !elemData || !events ) {
			return;
		}

		// types is actually an event object here
		if ( types && types.type ) {
			handler = types.handler;
			types = types.type;
		}

		// Unbind all events for the element
		if ( !types || typeof types === "string" && types.charAt(0) === "." ) {
			types = types || "";

			for ( type in events ) {
				jQuery.event.remove( elem, type + types );
			}

			return;
		}

		// Handle multiple events separated by a space
		// jQuery(...).unbind("mouseover mouseout", fn);
		types = types.split(" ");

		while ( (type = types[ i++ ]) ) {
			origType = type;
			handleObj = null;
			all = type.indexOf(".") < 0;
			namespaces = [];

			if ( !all ) {
				// Namespaced event handlers
				namespaces = type.split(".");
				type = namespaces.shift();

				namespace = new RegExp("(^|\\.)" + 
					jQuery.map( namespaces.slice(0).sort(), fcleanup ).join("\\.(?:.*\\.)?") + "(\\.|$)")
			}

			eventType = events[ type ];

			if ( !eventType ) {
				continue;
			}

			if ( !handler ) {
				for ( var j = 0; j < eventType.length; j++ ) {
					handleObj = eventType[ j ];

					if ( all || namespace.test( handleObj.namespace ) ) {
						jQuery.event.remove( elem, origType, handleObj.handler, j );
						eventType.splice( j--, 1 );
					}
				}

				continue;
			}

			special = jQuery.event.special[ type ] || {};

			for ( var j = pos || 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( handler.guid === handleObj.guid ) {
					// remove the given handler for the given type
					if ( all || namespace.test( handleObj.namespace ) ) {
						if ( pos == null ) {
							eventType.splice( j--, 1 );
						}

						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}

					if ( pos != null ) {
						break;
					}
				}
			}

			// remove generic event handler if no more handlers exist
			if ( eventType.length === 0 || pos != null && eventType.length === 1 ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					removeEvent( elem, type, elemData.handle );
				}

				ret = null;
				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			var handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			delete elemData.events;
			delete elemData.handle;

			if ( jQuery.isEmptyObject( elemData ) ) {
				jQuery.removeData( elem );
			}
		}
	},

	// bubbling is internal
	trigger: function( event, data, elem /*, bubbling */ ) {
		// Event object or event type
		var type = event.type || event,
			bubbling = arguments[3];

		if ( !bubbling ) {
			event = typeof event === "object" ?
				// jQuery.Event object
				event[expando] ? event :
				// Object literal
				jQuery.extend( jQuery.Event(type), event ) :
				// Just the event type (string)
				jQuery.Event(type);

			if ( type.indexOf("!") >= 0 ) {
				event.type = type = type.slice(0, -1);
				event.exclusive = true;
			}

			// Handle a global trigger
			if ( !elem ) {
				// Don't bubble custom events when global (to avoid too much overhead)
				event.stopPropagation();

				// Only trigger if we've ever bound an event for it
				if ( jQuery.event.global[ type ] ) {
					jQuery.each( jQuery.cache, function() {
						if ( this.events && this.events[type] ) {
							jQuery.event.trigger( event, data, this.handle.elem );
						}
					});
				}
			}

			// Handle triggering a single element

			// don't do events on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
				return undefined;
			}

			// Clean up in case it is reused
			event.result = undefined;
			event.target = elem;

			// Clone the incoming data, if any
			data = jQuery.makeArray( data );
			data.unshift( event );
		}

		event.currentTarget = elem;

		// Trigger the event, it is assumed that "handle" is a function
		var handle = jQuery.data( elem, "handle" );
		if ( handle ) {
			handle.apply( elem, data );
		}

		var parent = elem.parentNode || elem.ownerDocument;

		// Trigger an inline bound script
		try {
			if ( !(elem && elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()]) ) {
				if ( elem[ "on" + type ] && elem[ "on" + type ].apply( elem, data ) === false ) {
					event.result = false;
				}
			}

		// prevent IE from throwing an error for some elements with some event types, see #3533
		} catch (e) {}

		if ( !event.isPropagationStopped() && parent ) {
			jQuery.event.trigger( event, data, parent, true );

		} else if ( !event.isDefaultPrevented() ) {
			var target = event.target, old,
				isClick = jQuery.nodeName(target, "a") && type === "click",
				special = jQuery.event.special[ type ] || {};

			if ( (!special._default || special._default.call( elem, event ) === false) && 
				!isClick && !(target && target.nodeName && jQuery.noData[target.nodeName.toLowerCase()]) ) {

				try {
					if ( target[ type ] ) {
						// Make sure that we don't accidentally re-trigger the onFOO events
						old = target[ "on" + type ];

						if ( old ) {
							target[ "on" + type ] = null;
						}

						jQuery.event.triggered = true;
						target[ type ]();
					}

				// prevent IE from throwing an error for some elements with some event types, see #3533
				} catch (e) {}

				if ( old ) {
					target[ "on" + type ] = old;
				}

				jQuery.event.triggered = false;
			}
		}
	},

	handle: function( event ) {
		var all, handlers, namespaces, namespace, events;

		event = arguments[0] = jQuery.event.fix( event || window.event );
		event.currentTarget = this;

		// Namespaced event handlers
		all = event.type.indexOf(".") < 0 && !event.exclusive;

		if ( !all ) {
			namespaces = event.type.split(".");
			event.type = namespaces.shift();
			namespace = new RegExp("(^|\\.)" + namespaces.slice(0).sort().join("\\.(?:.*\\.)?") + "(\\.|$)");
		}

		var events = jQuery.data(this, "events"), handlers = events[ event.type ];

		if ( events && handlers ) {
			// Clone the handlers to prevent manipulation
			handlers = handlers.slice(0);

			for ( var j = 0, l = handlers.length; j < l; j++ ) {
				var handleObj = handlers[ j ];

				// Filter the functions by class
				if ( all || namespace.test( handleObj.namespace ) ) {
					// Pass in a reference to the handler function itself
					// So that we can later remove it
					event.handler = handleObj.handler;
					event.data = handleObj.data;
					event.handleObj = handleObj;
	
					var ret = handleObj.handler.apply( this, arguments );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}

					if ( event.isImmediatePropagationStopped() ) {
						break;
					}
				}
			}
		}

		return event.result;
	},

	props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),

	fix: function( event ) {
		if ( event[ expando ] ) {
			return event;
		}

		// store a copy of the original event object
		// and "clone" to set read-only properties
		var originalEvent = event;
		event = jQuery.Event( originalEvent );

		for ( var i = this.props.length, prop; i; ) {
			prop = this.props[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary
		if ( !event.target ) {
			event.target = event.srcElement || document; // Fixes #1925 where srcElement might not be defined either
		}

		// check if target is a textnode (safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Add relatedTarget, if necessary
		if ( !event.relatedTarget && event.fromElement ) {
			event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
		}

		// Calculate pageX/Y if missing and clientX/Y available
		if ( event.pageX == null && event.clientX != null ) {
			var doc = document.documentElement, body = document.body;
			event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
			event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
		}

		// Add which for key events
		if ( !event.which && ((event.charCode || event.charCode === 0) ? event.charCode : event.keyCode) ) {
			event.which = event.charCode || event.keyCode;
		}

		// Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
		if ( !event.metaKey && event.ctrlKey ) {
			event.metaKey = event.ctrlKey;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		// Note: button is not normalized, so don't use it
		if ( !event.which && event.button !== undefined ) {
			event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
		}

		return event;
	},

	// Deprecated, use jQuery.guid instead
	guid: 1E8,

	// Deprecated, use jQuery.proxy instead
	proxy: jQuery.proxy,

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady,
			teardown: jQuery.noop
		},

		live: {
			add: function( handleObj ) {
				jQuery.event.add( this, handleObj.origType, jQuery.extend({}, handleObj, {handler: liveHandler}) ); 
			},

			remove: function( handleObj ) {
				var remove = true,
					type = handleObj.origType.replace(rnamespaces, "");
				
				jQuery.each( jQuery.data(this, "events").live || [], function() {
					if ( type === this.origType.replace(rnamespaces, "") ) {
						remove = false;
						return false;
					}
				});

				if ( remove ) {
					jQuery.event.remove( this, handleObj.origType, liveHandler );
				}
			}

		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( this.setInterval ) {
					this.onbeforeunload = eventHandle;
				}

				return false;
			},
			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	}
};

var removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		elem.removeEventListener( type, handle, false );
	} : 
	function( elem, type, handle ) {
		elem.detachEvent( "on" + type, handle );
	};

jQuery.Event = function( src ) {
	// Allow instantiation without the 'new' keyword
	if ( !this.preventDefault ) {
		return new jQuery.Event( src );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;
	// Event type
	} else {
		this.type = src;
	}

	// timeStamp is buggy for some events on Firefox(#3843)
	// So we won't rely on the native value
	this.timeStamp = now();

	// Mark it as fixed
	this[ expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		
		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();
		}
		// otherwise set the returnValue property of the original event to false (IE)
		e.returnValue = false;
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Checks if an event happened on an element within another element
// Used in jQuery.event.special.mouseenter and mouseleave handlers
var withinElement = function( event ) {
	// Check if mouse(over|out) are still within the same parent element
	var parent = event.relatedTarget;

	// Firefox sometimes assigns relatedTarget a XUL element
	// which we cannot access the parentNode property of
	try {
		// Traverse up the tree
		while ( parent && parent !== this ) {
			parent = parent.parentNode;
		}

		if ( parent !== this ) {
			// set the correct event type
			event.type = event.data;

			// handle event if we actually just moused on to a non sub-element
			jQuery.event.handle.apply( this, arguments );
		}

	// assuming we've left the element since we most likely mousedover a xul element
	} catch(e) { }
},

// In case of event delegation, we only need to rename the event.type,
// liveHandler will take care of the rest.
delegate = function( event ) {
	event.type = event.data;
	jQuery.event.handle.apply( this, arguments );
};

// Create mouseenter and mouseleave events
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		setup: function( data ) {
			jQuery.event.add( this, fix, data && data.selector ? delegate : withinElement, orig );
		},
		teardown: function( data ) {
			jQuery.event.remove( this, fix, data && data.selector ? delegate : withinElement );
		}
	};
});

// submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function( data, namespaces ) {
			if ( this.nodeName.toLowerCase() !== "form" ) {
				jQuery.event.add(this, "click.specialSubmit", function( e ) {
					var elem = e.target, type = elem.type;

					if ( (type === "submit" || type === "image") && jQuery( elem ).closest("form").length ) {
						return trigger( "submit", this, arguments );
					}
				});
	 
				jQuery.event.add(this, "keypress.specialSubmit", function( e ) {
					var elem = e.target, type = elem.type;

					if ( (type === "text" || type === "password") && jQuery( elem ).closest("form").length && e.keyCode === 13 ) {
						return trigger( "submit", this, arguments );
					}
				});

			} else {
				return false;
			}
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialSubmit" );
		}
	};

}

// change delegation, happens here so we have bind.
if ( !jQuery.support.changeBubbles ) {

	var formElems = /textarea|input|select/i,

	changeFilters,

	getVal = function( elem ) {
		var type = elem.type, val = elem.value;

		if ( type === "radio" || type === "checkbox" ) {
			val = elem.checked;

		} else if ( type === "select-multiple" ) {
			val = elem.selectedIndex > -1 ?
				jQuery.map( elem.options, function( elem ) {
					return elem.selected;
				}).join("-") :
				"";

		} else if ( elem.nodeName.toLowerCase() === "select" ) {
			val = elem.selectedIndex;
		}

		return val;
	},

	testChange = function testChange( e ) {
		var elem = e.target, data, val;

		if ( !formElems.test( elem.nodeName ) || elem.readOnly ) {
			return;
		}

		data = jQuery.data( elem, "_change_data" );
		val = getVal(elem);

		// the current data will be also retrieved by beforeactivate
		if ( e.type !== "focusout" || elem.type !== "radio" ) {
			jQuery.data( elem, "_change_data", val );
		}
		
		if ( data === undefined || val === data ) {
			return;
		}

		if ( data != null || val ) {
			e.type = "change";
			return jQuery.event.trigger( e, arguments[1], elem );
		}
	};

	jQuery.event.special.change = {
		filters: {
			focusout: testChange, 

			click: function( e ) {
				var elem = e.target, type = elem.type;

				if ( type === "radio" || type === "checkbox" || elem.nodeName.toLowerCase() === "select" ) {
					return testChange.call( this, e );
				}
			},

			// Change has to be called before submit
			// Keydown will be called before keypress, which is used in submit-event delegation
			keydown: function( e ) {
				var elem = e.target, type = elem.type;

				if ( (e.keyCode === 13 && elem.nodeName.toLowerCase() !== "textarea") ||
					(e.keyCode === 32 && (type === "checkbox" || type === "radio")) ||
					type === "select-multiple" ) {
					return testChange.call( this, e );
				}
			},

			// Beforeactivate happens also before the previous element is blurred
			// with this event you can't trigger a change event, but you can store
			// information/focus[in] is not needed anymore
			beforeactivate: function( e ) {
				var elem = e.target;
				jQuery.data( elem, "_change_data", getVal(elem) );
			}
		},

		setup: function( data, namespaces ) {
			if ( this.type === "file" ) {
				return false;
			}

			for ( var type in changeFilters ) {
				jQuery.event.add( this, type + ".specialChange", changeFilters[type] );
			}

			return formElems.test( this.nodeName );
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialChange" );

			return formElems.test( this.nodeName );
		}
	};

	changeFilters = jQuery.event.special.change.filters;
}

function trigger( type, elem, args ) {
	args[0].type = type;
	return jQuery.event.handle.apply( elem, args );
}

// Create "bubbling" focus and blur events
if ( document.addEventListener ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {
		jQuery.event.special[ fix ] = {
			setup: function() {
				this.addEventListener( orig, handler, true );
			}, 
			teardown: function() { 
				this.removeEventListener( orig, handler, true );
			}
		};

		function handler( e ) { 
			e = jQuery.event.fix( e );
			e.type = fix;
			return jQuery.event.handle.call( this, e );
		}
	});
}

jQuery.each(["bind", "one"], function( i, name ) {
	jQuery.fn[ name ] = function( type, data, fn ) {
		// Handle object literals
		if ( typeof type === "object" ) {
			for ( var key in type ) {
				this[ name ](key, data, type[key], fn);
			}
			return this;
		}
		
		if ( jQuery.isFunction( data ) ) {
			fn = data;
			data = undefined;
		}

		var handler = name === "one" ? jQuery.proxy( fn, function( event ) {
			jQuery( this ).unbind( event, handler );
			return fn.apply( this, arguments );
		}) : fn;

		if ( type === "unload" && name !== "one" ) {
			this.one( type, data, fn );

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.add( this[i], type, handler, data );
			}
		}

		return this;
	};
});

jQuery.fn.extend({
	unbind: function( type, fn ) {
		// Handle object literals
		if ( typeof type === "object" && !type.preventDefault ) {
			for ( var key in type ) {
				this.unbind(key, type[key]);
			}

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.remove( this[i], type, fn );
			}
		}

		return this;
	},
	
	delegate: function( selector, types, data, fn ) {
		return this.live( types, data, fn, selector );
	},
	
	undelegate: function( selector, types, fn ) {
		if ( arguments.length === 0 ) {
				return this.unbind( "live" );
		
		} else {
			return this.die( types, null, fn, selector );
		}
	},
	
	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},

	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			var event = jQuery.Event( type );
			event.preventDefault();
			event.stopPropagation();
			jQuery.event.trigger( event, data, this[0] );
			return event.result;
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments, i = 1;

		// link all the functions, so any of them can unbind this click handler
		while ( i < args.length ) {
			jQuery.proxy( fn, args[ i++ ] );
		}

		return this.click( jQuery.proxy( fn, function( event ) {
			// Figure out which function to execute
			var lastToggle = ( jQuery.data( this, "lastToggle" + fn.guid ) || 0 ) % i;
			jQuery.data( this, "lastToggle" + fn.guid, lastToggle + 1 );

			// Make sure that clicks stop
			event.preventDefault();

			// and execute the function
			return args[ lastToggle ].apply( this, arguments ) || false;
		}));
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

var liveMap = {
	focus: "focusin",
	blur: "focusout",
	mouseenter: "mouseover",
	mouseleave: "mouseout"
};

jQuery.each(["live", "die"], function( i, name ) {
	jQuery.fn[ name ] = function( types, data, fn, origSelector /* Internal Use Only */ ) {
		var type, i = 0, match, namespaces, preType,
			selector = origSelector || this.selector,
			context = origSelector ? this : jQuery( this.context );

		if ( jQuery.isFunction( data ) ) {
			fn = data;
			data = undefined;
		}

		types = (types || "").split(" ");

		while ( (type = types[ i++ ]) != null ) {
			match = rnamespaces.exec( type );
			namespaces = "";

			if ( match )  {
				namespaces = match[0];
				type = type.replace( rnamespaces, "" );
			}

			if ( type === "hover" ) {
				types.push( "mouseenter" + namespaces, "mouseleave" + namespaces );
				continue;
			}

			preType = type;

			if ( type === "focus" || type === "blur" ) {
				types.push( liveMap[ type ] + namespaces );
				type = type + namespaces;

			} else {
				type = (liveMap[ type ] || type) + namespaces;
			}

			if ( name === "live" ) {
				// bind live handler
				context.each(function(){
					jQuery.event.add( this, liveConvert( type, selector ),
						{ data: data, selector: selector, handler: fn, origType: type, origHandler: fn, preType: preType } );
				});

			} else {
				// unbind live handler
				context.unbind( liveConvert( type, selector ), fn );
			}
		}
		
		return this;
	}
});

function liveHandler( event ) {
	var stop, elems = [], selectors = [], args = arguments,
		related, match, handleObj, elem, j, i, l, data,
		events = jQuery.data( this, "events" );

	// Make sure we avoid non-left-click bubbling in Firefox (#3861)
	if ( event.liveFired === this || !events || !events.live || event.button && event.type === "click" ) {
		return;
	}

	event.liveFired = this;

	var live = events.live.slice(0);

	for ( j = 0; j < live.length; j++ ) {
		handleObj = live[j];

		if ( handleObj.origType.replace( rnamespaces, "" ) === event.type ) {
			selectors.push( handleObj.selector );

		} else {
			live.splice( j--, 1 );
		}
	}

	match = jQuery( event.target ).closest( selectors, event.currentTarget );

	for ( i = 0, l = match.length; i < l; i++ ) {
		for ( j = 0; j < live.length; j++ ) {
			handleObj = live[j];

			if ( match[i].selector === handleObj.selector ) {
				elem = match[i].elem;
				related = null;

				// Those two events require additional checking
				if ( handleObj.preType === "mouseenter" || handleObj.preType === "mouseleave" ) {
					related = jQuery( event.relatedTarget ).closest( handleObj.selector )[0];
				}

				if ( !related || related !== elem ) {
					elems.push({ elem: elem, handleObj: handleObj });
				}
			}
		}
	}

	for ( i = 0, l = elems.length; i < l; i++ ) {
		match = elems[i];
		event.currentTarget = match.elem;
		event.data = match.handleObj.data;
		event.handleObj = match.handleObj;

		if ( match.handleObj.origHandler.apply( match.elem, args ) === false ) {
			stop = false;
			break;
		}
	}

	return stop;
}

function liveConvert( type, selector ) {
	return "live." + (type && type !== "*" ? type + "." : "") + selector.replace(/\./g, "`").replace(/ /g, "&");
}

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( fn ) {
		return fn ? this.bind( name, fn ) : this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}
});

// Prevent memory leaks in IE
// Window isn't included so as not to unbind existing unload events
// More info:
//  - http://isaacschlueter.com/2006/10/msie-memory-leaks/
if ( window.attachEvent && !window.addEventListener ) {
	window.attachEvent("onunload", function() {
		for ( var id in jQuery.cache ) {
			if ( jQuery.cache[ id ].handle ) {
				// Try/Catch is to handle iframes being unloaded, see #4280
				try {
					jQuery.event.remove( jQuery.cache[ id ].handle.elem );
				} catch(e) {}
			}
		}
	});
}
/*!
 * Sizzle CSS Selector Engine - v1.0
 *  Copyright 2009, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function(){
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function(selector, context, results, seed) {
	results = results || [];
	var origContext = context = context || document;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var parts = [], m, set, checkSet, extra, prune = true, contextXML = isXML(context),
		soFar = selector;
	
	// Reset the position of the chunker regexp (start from head)
	while ( (chunker.exec(""), m = chunker.exec(soFar)) !== null ) {
		soFar = m[3];
		
		parts.push( m[1] );
		
		if ( m[2] ) {
			extra = m[3];
			break;
		}
	}

	if ( parts.length > 1 && origPOS.exec( selector ) ) {
		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context );
		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set );
			}
		}
	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {
			var ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ? Sizzle.filter( ret.expr, ret.set )[0] : ret.set[0];
		}

		if ( context ) {
			var ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );
			set = ret.expr ? Sizzle.filter( ret.expr, ret.set ) : ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray(set);
			} else {
				prune = false;
			}

			while ( parts.length ) {
				var cur = parts.pop(), pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}
		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );
		} else if ( context && context.nodeType === 1 ) {
			for ( var i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}
		} else {
			for ( var i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}
	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function(results){
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort(sortOrder);

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[i-1] ) {
					results.splice(i--, 1);
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function(expr, set){
	return Sizzle(expr, null, null, set);
};

Sizzle.find = function(expr, context, isXML){
	var set, match;

	if ( !expr ) {
		return [];
	}

	for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
		var type = Expr.order[i], match;
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			var left = match[1];
			match.splice(1,1);

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace(/\\/g, "");
				set = Expr.find[ type ]( match, context, isXML );
				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = context.getElementsByTagName("*");
	}

	return {set: set, expr: expr};
};

Sizzle.filter = function(expr, set, inplace, not){
	var old = expr, result = [], curLoop = set, match, anyFound,
		isXMLFilter = set && set[0] && isXML(set[0]);

	while ( expr && set.length ) {
		for ( var type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				var filter = Expr.filter[ type ], found, item, left = match[1];
				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;
					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							var pass = not ^ !!found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;
								} else {
									curLoop[i] = false;
								}
							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );
			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw "Syntax error, unrecognized expression: " + msg;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],
	match: {
		ID: /#((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},
	leftMatch: {},
	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},
	attrHandle: {
		href: function(elem){
			return elem.getAttribute("href");
		}
	},
	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !/\W/.test(part),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},
		">": function(checkSet, part){
			var isPartStr = typeof part === "string";

			if ( isPartStr && !/\W/.test(part) ) {
				part = part.toLowerCase();

				for ( var i = 0, l = checkSet.length; i < l; i++ ) {
					var elem = checkSet[i];
					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}
			} else {
				for ( var i = 0, l = checkSet.length; i < l; i++ ) {
					var elem = checkSet[i];
					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},
		"": function(checkSet, part, isXML){
			var doneName = done++, checkFn = dirCheck;

			if ( typeof part === "string" && !/\W/.test(part) ) {
				var nodeCheck = part = part.toLowerCase();
				checkFn = dirNodeCheck;
			}

			checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
		},
		"~": function(checkSet, part, isXML){
			var doneName = done++, checkFn = dirCheck;

			if ( typeof part === "string" && !/\W/.test(part) ) {
				var nodeCheck = part = part.toLowerCase();
				checkFn = dirNodeCheck;
			}

			checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
		}
	},
	find: {
		ID: function(match, context, isXML){
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				return m ? [m] : [];
			}
		},
		NAME: function(match, context){
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [], results = context.getElementsByName(match[1]);

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},
		TAG: function(match, context){
			return context.getElementsByTagName(match[1]);
		}
	},
	preFilter: {
		CLASS: function(match, curLoop, inplace, result, not, isXML){
			match = " " + match[1].replace(/\\/g, "") + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}
					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},
		ID: function(match){
			return match[1].replace(/\\/g, "");
		},
		TAG: function(match, curLoop){
			return match[1].toLowerCase();
		},
		CHILD: function(match){
			if ( match[1] === "nth" ) {
				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},
		ATTR: function(match, curLoop, inplace, result, not, isXML){
			var name = match[1].replace(/\\/g, "");
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},
		PSEUDO: function(match, curLoop, inplace, result, not){
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);
				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
					if ( !inplace ) {
						result.push.apply( result, ret );
					}
					return false;
				}
			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},
		POS: function(match){
			match.unshift( true );
			return match;
		}
	},
	filters: {
		enabled: function(elem){
			return elem.disabled === false && elem.type !== "hidden";
		},
		disabled: function(elem){
			return elem.disabled === true;
		},
		checked: function(elem){
			return elem.checked === true;
		},
		selected: function(elem){
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			elem.parentNode.selectedIndex;
			return elem.selected === true;
		},
		parent: function(elem){
			return !!elem.firstChild;
		},
		empty: function(elem){
			return !elem.firstChild;
		},
		has: function(elem, i, match){
			return !!Sizzle( match[3], elem ).length;
		},
		header: function(elem){
			return /h\d/i.test( elem.nodeName );
		},
		text: function(elem){
			return "text" === elem.type;
		},
		radio: function(elem){
			return "radio" === elem.type;
		},
		checkbox: function(elem){
			return "checkbox" === elem.type;
		},
		file: function(elem){
			return "file" === elem.type;
		},
		password: function(elem){
			return "password" === elem.type;
		},
		submit: function(elem){
			return "submit" === elem.type;
		},
		image: function(elem){
			return "image" === elem.type;
		},
		reset: function(elem){
			return "reset" === elem.type;
		},
		button: function(elem){
			return "button" === elem.type || elem.nodeName.toLowerCase() === "button";
		},
		input: function(elem){
			return /input|select|textarea|button/i.test(elem.nodeName);
		}
	},
	setFilters: {
		first: function(elem, i){
			return i === 0;
		},
		last: function(elem, i, match, array){
			return i === array.length - 1;
		},
		even: function(elem, i){
			return i % 2 === 0;
		},
		odd: function(elem, i){
			return i % 2 === 1;
		},
		lt: function(elem, i, match){
			return i < match[3] - 0;
		},
		gt: function(elem, i, match){
			return i > match[3] - 0;
		},
		nth: function(elem, i, match){
			return match[3] - 0 === i;
		},
		eq: function(elem, i, match){
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function(elem, match, i, array){
			var name = match[1], filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;
			} else if ( name === "not" ) {
				var not = match[3];

				for ( var i = 0, l = not.length; i < l; i++ ) {
					if ( not[i] === elem ) {
						return false;
					}
				}

				return true;
			} else {
				Sizzle.error( "Syntax error, unrecognized expression: " + name );
			}
		},
		CHILD: function(elem, match){
			var type = match[1], node = elem;
			switch (type) {
				case 'only':
				case 'first':
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}
					if ( type === "first" ) { 
						return true; 
					}
					node = elem;
				case 'last':
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}
					return true;
				case 'nth':
					var first = match[2], last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}
					
					var doneName = match[0],
						parent = elem.parentNode;
	
					if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
						var count = 0;
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 
						parent.sizcache = doneName;
					}
					
					var diff = elem.nodeIndex - last;
					if ( first === 0 ) {
						return diff === 0;
					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},
		ID: function(elem, match){
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},
		TAG: function(elem, match){
			return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
		},
		CLASS: function(elem, match){
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},
		ATTR: function(elem, match){
			var name = match[1],
				result = Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},
		POS: function(elem, match, i, array){
			var name = match[2], filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS;

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + /(?![^\[]*\])(?![^\(]*\))/.source );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, function(all, num){
		return "\\" + (num - 0 + 1);
	}));
}

var makeArray = function(array, results) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch(e){
	makeArray = function(array, results) {
		var ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );
		} else {
			if ( typeof array.length === "number" ) {
				for ( var i = 0, l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}
			} else {
				for ( var i = 0; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			if ( a == b ) {
				hasDuplicate = true;
			}
			return a.compareDocumentPosition ? -1 : 1;
		}

		var ret = a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
} else if ( "sourceIndex" in document.documentElement ) {
	sortOrder = function( a, b ) {
		if ( !a.sourceIndex || !b.sourceIndex ) {
			if ( a == b ) {
				hasDuplicate = true;
			}
			return a.sourceIndex ? -1 : 1;
		}

		var ret = a.sourceIndex - b.sourceIndex;
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
} else if ( document.createRange ) {
	sortOrder = function( a, b ) {
		if ( !a.ownerDocument || !b.ownerDocument ) {
			if ( a == b ) {
				hasDuplicate = true;
			}
			return a.ownerDocument ? -1 : 1;
		}

		var aRange = a.ownerDocument.createRange(), bRange = b.ownerDocument.createRange();
		aRange.setStart(a, 0);
		aRange.setEnd(a, 0);
		bRange.setStart(b, 0);
		bRange.setEnd(b, 0);
		var ret = aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
}

// Utility function for retreiving the text value of an array of DOM nodes
function getText( elems ) {
	var ret = "", elem;

	for ( var i = 0; elems[i]; i++ ) {
		elem = elems[i];

		// Get the text from text nodes and CDATA nodes
		if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
			ret += elem.nodeValue;

		// Traverse everything else, except comment nodes
		} else if ( elem.nodeType !== 8 ) {
			ret += getText( elem.childNodes );
		}
	}

	return ret;
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date).getTime();
	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	var root = document.documentElement;
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function(match, context, isXML){
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				return m ? m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ? [m] : undefined : [];
			}
		};

		Expr.filter.ID = function(elem, match){
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );
	root = form = null; // release memory in IE
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function(match, context){
			var results = context.getElementsByTagName(match[1]);

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";
	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {
		Expr.attrHandle.href = function(elem){
			return elem.getAttribute("href", 2);
		};
	}

	div = null; // release memory in IE
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle, div = document.createElement("div");
		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}
	
		Sizzle = function(query, context, extra, seed){
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && context.nodeType === 9 && !isXML(context) ) {
				try {
					return makeArray( context.querySelectorAll(query), extra );
				} catch(e){}
			}
		
			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		div = null; // release memory in IE
	})();
}

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}
	
	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function(match, context, isXML) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	div = null; // release memory in IE
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];
		if ( elem ) {
			elem = elem[dir];
			var match = false;

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem.sizcache = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];
		if ( elem ) {
			elem = elem[dir];
			var match = false;

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem.sizcache = doneName;
						elem.sizset = i;
					}
					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

var contains = document.compareDocumentPosition ? function(a, b){
	return !!(a.compareDocumentPosition(b) & 16);
} : function(a, b){
	return a !== b && (a.contains ? a.contains(b) : true);
};

var isXML = function(elem){
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833) 
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function(selector, context){
	var tmpSet = [], later = "", match,
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = getText;
jQuery.isXMLDoc = isXML;
jQuery.contains = contains;

return;

window.Sizzle = Sizzle;

})();
var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	slice = Array.prototype.slice;

// Implement the identical functionality for filter and not
var winnow = function( elements, qualifier, keep ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return (elem === qualifier) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return (jQuery.inArray( elem, qualifier ) >= 0) === keep;
	});
};

jQuery.fn.extend({
	find: function( selector ) {
		var ret = this.pushStack( "", "find", selector ), length = 0;

		for ( var i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( var n = length; n < ret.length; n++ ) {
					for ( var r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},
	
	is: function( selector ) {
		return !!selector && jQuery.filter( selector, this ).length > 0;
	},

	closest: function( selectors, context ) {
		if ( jQuery.isArray( selectors ) ) {
			var ret = [], cur = this[0], match, matches = {}, selector;

			if ( cur && selectors.length ) {
				for ( var i = 0, l = selectors.length; i < l; i++ ) {
					selector = selectors[i];

					if ( !matches[selector] ) {
						matches[selector] = jQuery.expr.match.POS.test( selector ) ? 
							jQuery( selector, context || this.context ) :
							selector;
					}
				}

				while ( cur && cur.ownerDocument && cur !== context ) {
					for ( selector in matches ) {
						match = matches[selector];

						if ( match.jquery ? match.index(cur) > -1 : jQuery(cur).is(match) ) {
							ret.push({ selector: selector, elem: cur });
							delete matches[selector];
						}
					}
					cur = cur.parentNode;
				}
			}

			return ret;
		}

		var pos = jQuery.expr.match.POS.test( selectors ) ? 
			jQuery( selectors, context || this.context ) : null;

		return this.map(function( i, cur ) {
			while ( cur && cur.ownerDocument && cur !== context ) {
				if ( pos ? pos.index(cur) > -1 : jQuery(cur).is(selectors) ) {
					return cur;
				}
				cur = cur.parentNode;
			}
			return null;
		});
	},
	
	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {
		if ( !elem || typeof elem === "string" ) {
			return jQuery.inArray( this[0],
				// If it receives a string, the selector is used
				// If it receives nothing, the siblings are used
				elem ? jQuery( elem ) : this.parent().children() );
		}
		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context || this.context ) :
				jQuery.makeArray( selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( elem.parentNode.firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );
		
		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, slice.call(arguments).join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return jQuery.find.matches(expr, elems);
	},
	
	dir: function( elem, dir, until ) {
		var matched = [], cur = elem[dir];
		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});
var rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /(<([\w:]+)[^>]*?)\/>/g,
	rselfClosing = /^(?:area|br|col|embed|hr|img|input|link|meta|param)$/i,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnocache = /<script|<object|<embed|<option|<style/i,
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,  // checked="checked" or checked (html5)
	fcloseTag = function( all, front, tag ) {
		return rselfClosing.test( tag ) ?
			all :
			front + "></" + tag + ">";
	},
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	};

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( text ) {
		if ( jQuery.isFunction(text) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.text( text.call(this, i, self.text()) );
			});
		}

		if ( typeof text !== "object" && text !== undefined ) {
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
		}

		return jQuery.text( this );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append(this);
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ), contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		return this.each(function() {
			jQuery( this ).wrapAll( html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery(arguments[0]);
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery(arguments[0]).toArray() );
			return set;
		}
	},
	
	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					 elem.parentNode.removeChild( elem );
				}
			}
		}
		
		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}
		
		return this;
	},

	clone: function( events ) {
		// Do the clone
		var ret = this.map(function() {
			if ( !jQuery.support.noCloneEvent && !jQuery.isXMLDoc(this) ) {
				// IE copies events bound via attachEvent when
				// using cloneNode. Calling detachEvent on the
				// clone will also remove the events from the orignal
				// In order to get around this, we use innerHTML.
				// Unfortunately, this means some modifications to
				// attributes in IE that are actually only stored
				// as properties will not be copied (such as the
				// the name attribute on an input).
				var html = this.outerHTML, ownerDocument = this.ownerDocument;
				if ( !html ) {
					var div = ownerDocument.createElement("div");
					div.appendChild( this.cloneNode(true) );
					html = div.innerHTML;
				}

				return jQuery.clean([html.replace(rinlinejQuery, "")
					// Handle the case in IE 8 where action=/test/> self-closes a tag
					.replace(/=([^="'>\s]+\/)>/g, '="$1">')
					.replace(rleadingWhitespace, "")], ownerDocument)[0];
			} else {
				return this.cloneNode(true);
			}
		});

		// Copy the events from the original to the clone
		if ( events === true ) {
			cloneCopyEvent( this, ret );
			cloneCopyEvent( this.find("*"), ret.find("*") );
		}

		// Return the cloned set
		return ret;
	},

	html: function( value ) {
		if ( value === undefined ) {
			return this[0] && this[0].nodeType === 1 ?
				this[0].innerHTML.replace(rinlinejQuery, "") :
				null;

		// See if we can take a shortcut and just use innerHTML
		} else if ( typeof value === "string" && !rnocache.test( value ) &&
			(jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
			!wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

			value = value.replace(rxhtmlTag, fcloseTag);

			try {
				for ( var i = 0, l = this.length; i < l; i++ ) {
					// Remove element nodes and prevent memory leaks
					if ( this[i].nodeType === 1 ) {
						jQuery.cleanData( this[i].getElementsByTagName("*") );
						this[i].innerHTML = value;
					}
				}

			// If using innerHTML throws an exception, use the fallback method
			} catch(e) {
				this.empty().append( value );
			}

		} else if ( jQuery.isFunction( value ) ) {
			this.each(function(i){
				var self = jQuery(this), old = self.html();
				self.empty().append(function(){
					return value.call( this, i, old );
				});
			});

		} else {
			this.empty().append( value );
		}

		return this;
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery(value).detach();
			}

			return this.each(function() {
				var next = this.nextSibling, parent = this.parentNode;

				jQuery(this).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value );
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, value = args[0], scripts = [], fragment, parent;

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = buildFragment( args, this, scripts );
			}
			
			fragment = results.fragment;
			
			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						i > 0 || results.cacheable || this.length > 1  ?
							fragment.cloneNode(true) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, evalScript );
			}
		}

		return this;

		function root( elem, cur ) {
			return jQuery.nodeName(elem, "table") ?
				(elem.getElementsByTagName("tbody")[0] ||
				elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
				elem;
		}
	}
});

function cloneCopyEvent(orig, ret) {
	var i = 0;

	ret.each(function() {
		if ( this.nodeName !== (orig[i] && orig[i].nodeName) ) {
			return;
		}

		var oldData = jQuery.data( orig[i++] ), curData = jQuery.data( this, oldData ), events = oldData && oldData.events;

		if ( events ) {
			delete curData.handle;
			curData.events = {};

			for ( var type in events ) {
				for ( var handler in events[ type ] ) {
					jQuery.event.add( this, type, events[ type ][ handler ], events[ type ][ handler ].data );
				}
			}
		}
	});
}

function buildFragment( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults,
		doc = (nodes && nodes[0] ? nodes[0].ownerDocument || nodes[0] : document);

	// Only cache "small" (1/2 KB) strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	if ( args.length === 1 && typeof args[0] === "string" && args[0].length < 512 && doc === document &&
		!rnocache.test( args[0] ) && (jQuery.support.checkClone || !rchecked.test( args[0] )) ) {

		cacheable = true;
		cacheresults = jQuery.fragments[ args[0] ];
		if ( cacheresults ) {
			if ( cacheresults !== 1 ) {
				fragment = cacheresults;
			}
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ args[0] ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
}

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [], insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;
		
		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;
			
		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = (i > 0 ? this.clone(true) : this).get();
				jQuery.fn[ original ].apply( jQuery(insert[i]), elems );
				ret = ret.concat( elems );
			}
		
			return this.pushStack( ret, name, insert.selector );
		}
	};
});

jQuery.extend({
	clean: function( elems, context, fragment, scripts ) {
		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		var ret = [];

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" && !rhtml.test( elem ) ) {
				elem = context.createTextNode( elem );

			} else if ( typeof elem === "string" ) {
				// Fix "XHTML"-style tags in all browsers
				elem = elem.replace(rxhtmlTag, fcloseTag);

				// Trim whitespace, otherwise indexOf won't work as expected
				var tag = (rtagName.exec( elem ) || ["", ""])[1].toLowerCase(),
					wrap = wrapMap[ tag ] || wrapMap._default,
					depth = wrap[0],
					div = context.createElement("div");

				// Go to html and back, then peel off extra wrappers
				div.innerHTML = wrap[1] + elem + wrap[2];

				// Move to the right depth
				while ( depth-- ) {
					div = div.lastChild;
				}

				// Remove IE's autoinserted <tbody> from table fragments
				if ( !jQuery.support.tbody ) {

					// String was a <table>, *may* have spurious <tbody>
					var hasBody = rtbody.test(elem),
						tbody = tag === "table" && !hasBody ?
							div.firstChild && div.firstChild.childNodes :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !hasBody ?
								div.childNodes :
								[];

					for ( var j = tbody.length - 1; j >= 0 ; --j ) {
						if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
							tbody[ j ].parentNode.removeChild( tbody[ j ] );
						}
					}

				}

				// IE completely kills leading whitespace when innerHTML is used
				if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
					div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
				}

				elem = div.childNodes;
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			for ( var i = 0; ret[i]; i++ ) {
				if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
					scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );
				
				} else {
					if ( ret[i].nodeType === 1 ) {
						ret.splice.apply( ret, [i + 1, 0].concat(jQuery.makeArray(ret[i].getElementsByTagName("script"))) );
					}
					fragment.appendChild( ret[i] );
				}
			}
		}

		return ret;
	},
	
	cleanData: function( elems ) {
		var data, id, cache = jQuery.cache,
			special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;
		
		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			id = elem[ jQuery.expando ];
			
			if ( id ) {
				data = cache[ id ];
				
				if ( data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						} else {
							removeEvent( elem, type, data.handle );
						}
					}
				}
				
				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}
				
				delete cache[ id ];
			}
		}
	}
});
// exclude the following css properties to add px
var rexclude = /z-?index|font-?weight|opacity|zoom|line-?height/i,
	ralpha = /alpha\([^)]*\)/,
	ropacity = /opacity=([^)]*)/,
	rfloat = /float/i,
	rdashAlpha = /-([a-z])/ig,
	rupper = /([A-Z])/g,
	rnumpx = /^-?\d+(?:px)?$/i,
	rnum = /^-?\d/,

	cssShow = { position: "absolute", visibility: "hidden", display:"block" },
	cssWidth = [ "Left", "Right" ],
	cssHeight = [ "Top", "Bottom" ],

	// cache check for defaultView.getComputedStyle
	getComputedStyle = document.defaultView && document.defaultView.getComputedStyle,
	// normalize float css property
	styleFloat = jQuery.support.cssFloat ? "cssFloat" : "styleFloat",
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn.css = function( name, value ) {
	return access( this, name, value, true, function( elem, name, value ) {
		if ( value === undefined ) {
			return jQuery.curCSS( elem, name );
		}
		
		if ( typeof value === "number" && !rexclude.test(name) ) {
			value += "px";
		}

		jQuery.style( elem, name, value );
	});
};

jQuery.extend({
	style: function( elem, name, value ) {
		// don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
			return undefined;
		}

		// ignore negative width and height values #1599
		if ( (name === "width" || name === "height") && parseFloat(value) < 0 ) {
			value = undefined;
		}

		var style = elem.style || elem, set = value !== undefined;

		// IE uses filters for opacity
		if ( !jQuery.support.opacity && name === "opacity" ) {
			if ( set ) {
				// IE has trouble with opacity if it does not have layout
				// Force it by setting the zoom level
				style.zoom = 1;

				// Set the alpha filter to set the opacity
				var opacity = parseInt( value, 10 ) + "" === "NaN" ? "" : "alpha(opacity=" + value * 100 + ")";
				var filter = style.filter || jQuery.curCSS( elem, "filter" ) || "";
				style.filter = ralpha.test(filter) ? filter.replace(ralpha, opacity) : opacity;
			}

			return style.filter && style.filter.indexOf("opacity=") >= 0 ?
				(parseFloat( ropacity.exec(style.filter)[1] ) / 100) + "":
				"";
		}

		// Make sure we're using the right name for getting the float value
		if ( rfloat.test( name ) ) {
			name = styleFloat;
		}

		name = name.replace(rdashAlpha, fcamelCase);

		if ( set ) {
			style[ name ] = value;
		}

		return style[ name ];
	},

	css: function( elem, name, force, extra ) {
		if ( name === "width" || name === "height" ) {
			var val, props = cssShow, which = name === "width" ? cssWidth : cssHeight;

			function getWH() {
				val = name === "width" ? elem.offsetWidth : elem.offsetHeight;

				if ( extra === "border" ) {
					return;
				}

				jQuery.each( which, function() {
					if ( !extra ) {
						val -= parseFloat(jQuery.curCSS( elem, "padding" + this, true)) || 0;
					}

					if ( extra === "margin" ) {
						val += parseFloat(jQuery.curCSS( elem, "margin" + this, true)) || 0;
					} else {
						val -= parseFloat(jQuery.curCSS( elem, "border" + this + "Width", true)) || 0;
					}
				});
			}

			if ( elem.offsetWidth !== 0 ) {
				getWH();
			} else {
				jQuery.swap( elem, props, getWH );
			}

			return Math.max(0, Math.round(val));
		}

		return jQuery.curCSS( elem, name, force );
	},

	curCSS: function( elem, name, force ) {
		var ret, style = elem.style, filter;

		// IE uses filters for opacity
		if ( !jQuery.support.opacity && name === "opacity" && elem.currentStyle ) {
			ret = ropacity.test(elem.currentStyle.filter || "") ?
				(parseFloat(RegExp.$1) / 100) + "" :
				"";

			return ret === "" ?
				"1" :
				ret;
		}

		// Make sure we're using the right name for getting the float value
		if ( rfloat.test( name ) ) {
			name = styleFloat;
		}

		if ( !force && style && style[ name ] ) {
			ret = style[ name ];

		} else if ( getComputedStyle ) {

			// Only "float" is needed here
			if ( rfloat.test( name ) ) {
				name = "float";
			}

			name = name.replace( rupper, "-$1" ).toLowerCase();

			var defaultView = elem.ownerDocument.defaultView;

			if ( !defaultView ) {
				return null;
			}

			var computedStyle = defaultView.getComputedStyle( elem, null );

			if ( computedStyle ) {
				ret = computedStyle.getPropertyValue( name );
			}

			// We should always get a number back from opacity
			if ( name === "opacity" && ret === "" ) {
				ret = "1";
			}

		} else if ( elem.currentStyle ) {
			var camelCase = name.replace(rdashAlpha, fcamelCase);

			ret = elem.currentStyle[ name ] || elem.currentStyle[ camelCase ];

			// From the awesome hack by Dean Edwards
			// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

			// If we're not dealing with a regular pixel number
			// but a number that has a weird ending, we need to convert it to pixels
			if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {
				// Remember the original values
				var left = style.left, rsLeft = elem.runtimeStyle.left;

				// Put in the new values to get a computed value out
				elem.runtimeStyle.left = elem.currentStyle.left;
				style.left = camelCase === "fontSize" ? "1em" : (ret || 0);
				ret = style.pixelLeft + "px";

				// Revert the changed values
				style.left = left;
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret;
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {};

		// Remember the old values, and insert the new ones
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		// Revert the old values
		for ( var name in options ) {
			elem.style[ name ] = old[ name ];
		}
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth, height = elem.offsetHeight,
			skip = elem.nodeName.toLowerCase() === "tr";

		return width === 0 && height === 0 && !skip ?
			true :
			width > 0 && height > 0 && !skip ?
				false :
				jQuery.curCSS(elem, "display") === "none";
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}
var jsc = now(),
	rscript = /<script(.|\s)*?\/script>/gi,
	rselectTextarea = /select|textarea/i,
	rinput = /color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week/i,
	jsre = /=\?(&|$)/,
	rquery = /\?/,
	rts = /(\?|&)_=.*?(&|$)/,
	rurl = /^(\w+:)?\/\/([^\/?#]+)/,
	r20 = /%20/g,

	// Keep a copy of the old load method
	_load = jQuery.fn.load;

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" ) {
			return _load.call( this, url );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf(" ");
		if ( off >= 0 ) {
			var selector = url.slice(off, url.length);
			url = url.slice(0, off);
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = null;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			complete: function( res, status ) {
				// If successful, inject the HTML into all the matched elements
				if ( status === "success" || status === "notmodified" ) {
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div />")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(res.responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						res.responseText );
				}

				if ( callback ) {
					self.each( callback, [res.responseText, status, res] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param(this.serializeArray());
	},
	serializeArray: function() {
		return this.map(function() {
			return this.elements ? jQuery.makeArray(this.elements) : this;
		})
		.filter(function() {
			return this.name && !this.disabled &&
				(this.checked || rselectTextarea.test(this.nodeName) ||
					rinput.test(this.type));
		})
		.map(function( i, elem ) {
			var val = jQuery(this).val();

			return val == null ?
				null :
				jQuery.isArray(val) ?
					jQuery.map( val, function( val, i ) {
						return { name: elem.name, value: val };
					}) :
					{ name: elem.name, value: val };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function( i, o ) {
	jQuery.fn[o] = function( f ) {
		return this.bind(o, f);
	};
});

jQuery.extend({

	get: function( url, data, callback, type ) {
		// shift arguments if data argument was omited
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = null;
		}

		return jQuery.ajax({
			type: "GET",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	getScript: function( url, callback ) {
		return jQuery.get(url, null, callback, "script");
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get(url, data, callback, "json");
	},

	post: function( url, data, callback, type ) {
		// shift arguments if data argument was omited
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = {};
		}

		return jQuery.ajax({
			type: "POST",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	ajaxSetup: function( settings ) {
		jQuery.extend( jQuery.ajaxSettings, settings );
	},

	ajaxSettings: {
		url: location.href,
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		username: null,
		password: null,
		traditional: false,
		*/
		// Create the request object; Microsoft failed to properly
		// implement the XMLHttpRequest in IE7 (can't request local files),
		// so we use the ActiveXObject when it is available
		// This function can be overriden by calling jQuery.ajaxSetup
		xhr: window.XMLHttpRequest && (window.location.protocol !== "file:" || !window.ActiveXObject) ?
			function() {
				return new window.XMLHttpRequest();
			} :
			function() {
				try {
					return new window.ActiveXObject("Microsoft.XMLHTTP");
				} catch(e) {}
			},
		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			script: "text/javascript, application/javascript",
			json: "application/json, text/javascript",
			text: "text/plain",
			_default: "*/*"
		}
	},

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajax: function( origSettings ) {
		var s = jQuery.extend(true, {}, jQuery.ajaxSettings, origSettings);
		
		var jsonp, status, data,
			callbackContext = origSettings && origSettings.context || s,
			type = s.type.toUpperCase();

		// convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Handle JSONP Parameter Callbacks
		if ( s.dataType === "jsonp" ) {
			if ( type === "GET" ) {
				if ( !jsre.test( s.url ) ) {
					s.url += (rquery.test( s.url ) ? "&" : "?") + (s.jsonp || "callback") + "=?";
				}
			} else if ( !s.data || !jsre.test(s.data) ) {
				s.data = (s.data ? s.data + "&" : "") + (s.jsonp || "callback") + "=?";
			}
			s.dataType = "json";
		}

		// Build temporary JSONP function
		if ( s.dataType === "json" && (s.data && jsre.test(s.data) || jsre.test(s.url)) ) {
			jsonp = s.jsonpCallback || ("jsonp" + jsc++);

			// Replace the =? sequence both in the query string and the data
			if ( s.data ) {
				s.data = (s.data + "").replace(jsre, "=" + jsonp + "$1");
			}

			s.url = s.url.replace(jsre, "=" + jsonp + "$1");

			// We need to make sure
			// that a JSONP style response is executed properly
			s.dataType = "script";

			// Handle JSONP-style loading
			window[ jsonp ] = window[ jsonp ] || function( tmp ) {
				data = tmp;
				success();
				complete();
				// Garbage collect
				window[ jsonp ] = undefined;

				try {
					delete window[ jsonp ];
				} catch(e) {}

				if ( head ) {
					head.removeChild( script );
				}
			};
		}

		if ( s.dataType === "script" && s.cache === null ) {
			s.cache = false;
		}

		if ( s.cache === false && type === "GET" ) {
			var ts = now();

			// try replacing _= if it is there
			var ret = s.url.replace(rts, "$1_=" + ts + "$2");

			// if nothing was replaced, add timestamp to the end
			s.url = ret + ((ret === s.url) ? (rquery.test(s.url) ? "&" : "?") + "_=" + ts : "");
		}

		// If data is available, append data to url for get requests
		if ( s.data && type === "GET" ) {
			s.url += (rquery.test(s.url) ? "&" : "?") + s.data;
		}

		// Watch for a new set of requests
		if ( s.global && ! jQuery.active++ ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Matches an absolute URL, and saves the domain
		var parts = rurl.exec( s.url ),
			remote = parts && (parts[1] && parts[1] !== location.protocol || parts[2] !== location.host);

		// If we're requesting a remote document
		// and trying to load JSON or Script with a GET
		if ( s.dataType === "script" && type === "GET" && remote ) {
			var head = document.getElementsByTagName("head")[0] || document.documentElement;
			var script = document.createElement("script");
			script.src = s.url;
			if ( s.scriptCharset ) {
				script.charset = s.scriptCharset;
			}

			// Handle Script loading
			if ( !jsonp ) {
				var done = false;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function() {
					if ( !done && (!this.readyState ||
							this.readyState === "loaded" || this.readyState === "complete") ) {
						done = true;
						success();
						complete();

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}
					}
				};
			}

			// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
			// This arises when a base node is used (#2709 and #4378).
			head.insertBefore( script, head.firstChild );

			// We handle everything using the script element injection
			return undefined;
		}

		var requestDone = false;

		// Create the request object
		var xhr = s.xhr();

		if ( !xhr ) {
			return;
		}

		// Open the socket
		// Passing null username, generates a login popup on Opera (#2865)
		if ( s.username ) {
			xhr.open(type, s.url, s.async, s.username, s.password);
		} else {
			xhr.open(type, s.url, s.async);
		}

		// Need an extra try/catch for cross domain requests in Firefox 3
		try {
			// Set the correct header, if data is being sent
			if ( s.data || origSettings && origSettings.contentType ) {
				xhr.setRequestHeader("Content-Type", s.contentType);
			}

			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if ( s.ifModified ) {
				if ( jQuery.lastModified[s.url] ) {
					xhr.setRequestHeader("If-Modified-Since", jQuery.lastModified[s.url]);
				}

				if ( jQuery.etag[s.url] ) {
					xhr.setRequestHeader("If-None-Match", jQuery.etag[s.url]);
				}
			}

			// Set header so the called script knows that it's an XMLHttpRequest
			// Only send the header if it's not a remote XHR
			if ( !remote ) {
				xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			}

			// Set the Accepts header for the server, depending on the dataType
			xhr.setRequestHeader("Accept", s.dataType && s.accepts[ s.dataType ] ?
				s.accepts[ s.dataType ] + ", */*" :
				s.accepts._default );
		} catch(e) {}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && s.beforeSend.call(callbackContext, xhr, s) === false ) {
			// Handle the global AJAX counter
			if ( s.global && ! --jQuery.active ) {
				jQuery.event.trigger( "ajaxStop" );
			}

			// close opended socket
			xhr.abort();
			return false;
		}

		if ( s.global ) {
			trigger("ajaxSend", [xhr, s]);
		}

		// Wait for a response to come back
		var onreadystatechange = xhr.onreadystatechange = function( isTimeout ) {
			// The request was aborted
			if ( !xhr || xhr.readyState === 0 || isTimeout === "abort" ) {
				// Opera doesn't call onreadystatechange before this point
				// so we simulate the call
				if ( !requestDone ) {
					complete();
				}

				requestDone = true;
				if ( xhr ) {
					xhr.onreadystatechange = jQuery.noop;
				}

			// The transfer is complete and the data is available, or the request timed out
			} else if ( !requestDone && xhr && (xhr.readyState === 4 || isTimeout === "timeout") ) {
				requestDone = true;
				xhr.onreadystatechange = jQuery.noop;

				status = isTimeout === "timeout" ?
					"timeout" :
					!jQuery.httpSuccess( xhr ) ?
						"error" :
						s.ifModified && jQuery.httpNotModified( xhr, s.url ) ?
							"notmodified" :
							"success";

				var errMsg;

				if ( status === "success" ) {
					// Watch for, and catch, XML document parse errors
					try {
						// process the data (runs the xml through httpData regardless of callback)
						data = jQuery.httpData( xhr, s.dataType, s );
					} catch(err) {
						status = "parsererror";
						errMsg = err;
					}
				}

				// Make sure that the request was successful or notmodified
				if ( status === "success" || status === "notmodified" ) {
					// JSONP handles its own success callback
					if ( !jsonp ) {
						success();
					}
				} else {
					jQuery.handleError(s, xhr, status, errMsg);
				}

				// Fire the complete handlers
				complete();

				if ( isTimeout === "timeout" ) {
					xhr.abort();
				}

				// Stop memory leaks
				if ( s.async ) {
					xhr = null;
				}
			}
		};

		// Override the abort handler, if we can (IE doesn't allow it, but that's OK)
		// Opera doesn't fire onreadystatechange at all on abort
		try {
			var oldAbort = xhr.abort;
			xhr.abort = function() {
				if ( xhr ) {
					oldAbort.call( xhr );
				}

				onreadystatechange( "abort" );
			};
		} catch(e) { }

		// Timeout checker
		if ( s.async && s.timeout > 0 ) {
			setTimeout(function() {
				// Check to see if the request is still happening
				if ( xhr && !requestDone ) {
					onreadystatechange( "timeout" );
				}
			}, s.timeout);
		}

		// Send the data
		try {
			xhr.send( type === "POST" || type === "PUT" || type === "DELETE" ? s.data : null );
		} catch(e) {
			jQuery.handleError(s, xhr, null, e);
			// Fire the complete handlers
			complete();
		}

		// firefox 1.5 doesn't fire statechange for sync requests
		if ( !s.async ) {
			onreadystatechange();
		}

		function success() {
			// If a local callback was specified, fire it and pass it the data
			if ( s.success ) {
				s.success.call( callbackContext, data, status, xhr );
			}

			// Fire the global callback
			if ( s.global ) {
				trigger( "ajaxSuccess", [xhr, s] );
			}
		}

		function complete() {
			// Process result
			if ( s.complete ) {
				s.complete.call( callbackContext, xhr, status);
			}

			// The request was completed
			if ( s.global ) {
				trigger( "ajaxComplete", [xhr, s] );
			}

			// Handle the global AJAX counter
			if ( s.global && ! --jQuery.active ) {
				jQuery.event.trigger( "ajaxStop" );
			}
		}
		
		function trigger(type, args) {
			(s.context ? jQuery(s.context) : jQuery.event).trigger(type, args);
		}

		// return XMLHttpRequest to allow aborting the request etc.
		return xhr;
	},

	handleError: function( s, xhr, status, e ) {
		// If a local callback was specified, fire it
		if ( s.error ) {
			s.error.call( s.context || s, xhr, status, e );
		}

		// Fire the global callback
		if ( s.global ) {
			(s.context ? jQuery(s.context) : jQuery.event).trigger( "ajaxError", [xhr, s, e] );
		}
	},

	// Counter for holding the number of active queries
	active: 0,

	// Determines if an XMLHttpRequest was successful or not
	httpSuccess: function( xhr ) {
		try {
			// IE error sometimes returns 1223 when it should be 204 so treat it as success, see #1450
			return !xhr.status && location.protocol === "file:" ||
				// Opera returns 0 when status is 304
				( xhr.status >= 200 && xhr.status < 300 ) ||
				xhr.status === 304 || xhr.status === 1223 || xhr.status === 0;
		} catch(e) {}

		return false;
	},

	// Determines if an XMLHttpRequest returns NotModified
	httpNotModified: function( xhr, url ) {
		var lastModified = xhr.getResponseHeader("Last-Modified"),
			etag = xhr.getResponseHeader("Etag");

		if ( lastModified ) {
			jQuery.lastModified[url] = lastModified;
		}

		if ( etag ) {
			jQuery.etag[url] = etag;
		}

		// Opera returns 0 when status is 304
		return xhr.status === 304 || xhr.status === 0;
	},

	httpData: function( xhr, type, s ) {
		var ct = xhr.getResponseHeader("content-type") || "",
			xml = type === "xml" || !type && ct.indexOf("xml") >= 0,
			data = xml ? xhr.responseXML : xhr.responseText;

		if ( xml && data.documentElement.nodeName === "parsererror" ) {
			jQuery.error( "parsererror" );
		}

		// Allow a pre-filtering function to sanitize the response
		// s is checked to keep backwards compatibility
		if ( s && s.dataFilter ) {
			data = s.dataFilter( data, type );
		}

		// The filter can actually parse the response
		if ( typeof data === "string" ) {
			// Get the JavaScript object, if JSON is used.
			if ( type === "json" || !type && ct.indexOf("json") >= 0 ) {
				data = jQuery.parseJSON( data );

			// If the type is "script", eval it in global context
			} else if ( type === "script" || !type && ct.indexOf("javascript") >= 0 ) {
				jQuery.globalEval( data );
			}
		}

		return data;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [];
		
		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}
		
		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray(a) || a.jquery ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});
			
		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[prefix] );
			}
		}

		// Return the resulting serialization
		return s.join("&").replace(r20, "+");

		function buildParams( prefix, obj ) {
			if ( jQuery.isArray(obj) ) {
				// Serialize array item.
				jQuery.each( obj, function( i, v ) {
					if ( traditional || /\[\]$/.test( prefix ) ) {
						// Treat each array item as a scalar.
						add( prefix, v );
					} else {
						// If array item is non-scalar (array or object), encode its
						// numeric index to resolve deserialization ambiguity issues.
						// Note that rack (as of 1.0.0) can't currently deserialize
						// nested arrays properly, and attempting to do so may cause
						// a server error. Possible fixes are to modify rack's
						// deserialization algorithm or to provide an option or flag
						// to force array serialization to be shallow.
						buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v );
					}
				});
					
			} else if ( !traditional && obj != null && typeof obj === "object" ) {
				// Serialize object item.
				jQuery.each( obj, function( k, v ) {
					buildParams( prefix + "[" + k + "]", v );
				});
					
			} else {
				// Serialize scalar item.
				add( prefix, obj );
			}
		}

		function add( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction(value) ? value() : value;
			s[ s.length ] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
		}
	}
});
var elemdisplay = {},
	rfxtypes = /toggle|show|hide/,
	rfxnum = /^([+-]=)?([\d+-.]+)(.*)$/,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	];

jQuery.fn.extend({
	show: function( speed, callback ) {
		if ( speed || speed === 0) {
			return this.animate( genFx("show", 3), speed, callback);

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				var old = jQuery.data(this[i], "olddisplay");

				this[i].style.display = old || "";

				if ( jQuery.css(this[i], "display") === "none" ) {
					var nodeName = this[i].nodeName, display;

					if ( elemdisplay[ nodeName ] ) {
						display = elemdisplay[ nodeName ];

					} else {
						var elem = jQuery("<" + nodeName + " />").appendTo("body");

						display = elem.css("display");

						if ( display === "none" ) {
							display = "block";
						}

						elem.remove();

						elemdisplay[ nodeName ] = display;
					}

					jQuery.data(this[i], "olddisplay", display);
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( var j = 0, k = this.length; j < k; j++ ) {
				this[j].style.display = jQuery.data(this[j], "olddisplay") || "";
			}

			return this;
		}
	},

	hide: function( speed, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, callback);

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				var old = jQuery.data(this[i], "olddisplay");
				if ( !old && old !== "none" ) {
					jQuery.data(this[i], "olddisplay", jQuery.css(this[i], "display"));
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( var j = 0, k = this.length; j < k; j++ ) {
				this[j].style.display = "none";
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2 ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2);
		}

		return this;
	},

	fadeTo: function( speed, to, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed(speed, easing, callback);

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete );
		}

		return this[ optall.queue === false ? "each" : "queue" ](function() {
			var opt = jQuery.extend({}, optall), p,
				hidden = this.nodeType === 1 && jQuery(this).is(":hidden"),
				self = this;

			for ( p in prop ) {
				var name = p.replace(rdashAlpha, fcamelCase);

				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
					p = name;
				}

				if ( prop[p] === "hide" && hidden || prop[p] === "show" && !hidden ) {
					return opt.complete.call(this);
				}

				if ( ( p === "height" || p === "width" ) && this.style ) {
					// Store display property
					opt.display = jQuery.css(this, "display");

					// Make sure that nothing sneaks out
					opt.overflow = this.style.overflow;
				}

				if ( jQuery.isArray( prop[p] ) ) {
					// Create (if needed) and add to specialEasing
					(opt.specialEasing = opt.specialEasing || {})[p] = prop[p][1];
					prop[p] = prop[p][0];
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			opt.curAnim = jQuery.extend({}, prop);

			jQuery.each( prop, function( name, val ) {
				var e = new jQuery.fx( self, opt, name );

				if ( rfxtypes.test(val) ) {
					e[ val === "toggle" ? hidden ? "show" : "hide" : val ]( prop );

				} else {
					var parts = rfxnum.exec(val),
						start = e.cur(true) || 0;

					if ( parts ) {
						var end = parseFloat( parts[2] ),
							unit = parts[3] || "px";

						// We need to compute starting value
						if ( unit !== "px" ) {
							self.style[ name ] = (end || 1) + unit;
							start = ((end || 1) / e.cur(true)) * start;
							self.style[ name ] = start + unit;
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ((parts[1] === "-=" ? -1 : 1) * end) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			});

			// For JS strict compliance
			return true;
		});
	},

	stop: function( clearQueue, gotoEnd ) {
		var timers = jQuery.timers;

		if ( clearQueue ) {
			this.queue([]);
		}

		this.each(function() {
			// go in reverse order so anything added to the queue during the loop is ignored
			for ( var i = timers.length - 1; i >= 0; i-- ) {
				if ( timers[i].elem === this ) {
					if (gotoEnd) {
						// force the next step to be the last
						timers[i](true);
					}

					timers.splice(i, 1);
				}
			}
		});

		// start the next in the queue if the last step wasn't forced
		if ( !gotoEnd ) {
			this.dequeue();
		}

		return this;
	}

});

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show", 1),
	slideUp: genFx("hide", 1),
	slideToggle: genFx("toggle", 1),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, callback ) {
		return this.animate( props, speed, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? speed : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			jQuery.fx.speeds[opt.duration] || jQuery.fx.speeds._default;

		// Queueing
		opt.old = opt.complete;
		opt.complete = function() {
			if ( opt.queue !== false ) {
				jQuery(this).dequeue();
			}
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		if ( !options.orig ) {
			options.orig = {};
		}
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		(jQuery.fx.step[this.prop] || jQuery.fx.step._default)( this );

		// Set display property to block for height/width animations
		if ( ( this.prop === "height" || this.prop === "width" ) && this.elem.style ) {
			this.elem.style.display = "block";
		}
	},

	// Get the current size
	cur: function( force ) {
		if ( this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null) ) {
			return this.elem[ this.prop ];
		}

		var r = parseFloat(jQuery.css(this.elem, this.prop, force));
		return r && r > -10000 ? r : parseFloat(jQuery.curCSS(this.elem, this.prop)) || 0;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		this.startTime = now();
		this.start = from;
		this.end = to;
		this.unit = unit || this.unit || "px";
		this.now = this.start;
		this.pos = this.state = 0;

		var self = this;
		function t( gotoEnd ) {
			return self.step(gotoEnd);
		}

		t.elem = this.elem;

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval(jQuery.fx.tick, 13);
		}
	},

	// Simple 'show' function
	show: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any
		// flash of content
		this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom(this.cur(), 0);
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var t = now(), done = true;

		if ( gotoEnd || t >= this.options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			this.options.curAnim[ this.prop ] = true;

			for ( var i in this.options.curAnim ) {
				if ( this.options.curAnim[i] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				if ( this.options.display != null ) {
					// Reset the overflow
					this.elem.style.overflow = this.options.overflow;

					// Reset the display
					var old = jQuery.data(this.elem, "olddisplay");
					this.elem.style.display = old ? old : this.options.display;

					if ( jQuery.css(this.elem, "display") === "none" ) {
						this.elem.style.display = "block";
					}
				}

				// Hide the element if the "hide" operation was done
				if ( this.options.hide ) {
					jQuery(this.elem).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( this.options.hide || this.options.show ) {
					for ( var p in this.options.curAnim ) {
						jQuery.style(this.elem, p, this.options.orig[p]);
					}
				}

				// Execute the complete function
				this.options.complete.call( this.elem );
			}

			return false;

		} else {
			var n = t - this.startTime;
			this.state = n / this.options.duration;

			// Perform the easing function, defaults to swing
			var specialEasing = this.options.specialEasing && this.options.specialEasing[this.prop];
			var defaultEasing = this.options.easing || (jQuery.easing.swing ? "swing" : "linear");
			this.pos = jQuery.easing[specialEasing || defaultEasing](this.state, n, 0, 1, this.options.duration);
			this.now = this.start + ((this.end - this.start) * this.pos);

			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		var timers = jQuery.timers;

		for ( var i = 0; i < timers.length; i++ ) {
			if ( !timers[i]() ) {
				timers.splice(i--, 1);
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},
		
	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},
	
	speeds: {
		slow: 600,
 		fast: 200,
 		// Default speed
 		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style(fx.elem, "opacity", fx.now);
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = (fx.prop === "width" || fx.prop === "height" ? Math.max(0, fx.now) : fx.now) + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice(0,num)), function() {
		obj[ this ] = type;
	});

	return obj;
}
if ( "getBoundingClientRect" in document.documentElement ) {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];

		if ( options ) { 
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		var box = elem.getBoundingClientRect(), doc = elem.ownerDocument, body = doc.body, docElem = doc.documentElement,
			clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0,
			top  = box.top  + (self.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop ) - clientTop,
			left = box.left + (self.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft) - clientLeft;

		return { top: top, left: left };
	};

} else {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];

		if ( options ) { 
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		jQuery.offset.initialize();

		var offsetParent = elem.offsetParent, prevOffsetParent = elem,
			doc = elem.ownerDocument, computedStyle, docElem = doc.documentElement,
			body = doc.body, defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop, left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.offset.doesNotAddBorder && !(jQuery.offset.doesAddBorderForTableAndCells && /^t(able|d|h)$/i.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent, offsetParent = elem.offsetParent;
			}

			if ( jQuery.offset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.offset = {
	initialize: function() {
		var body = document.body, container = document.createElement("div"), innerDiv, checkDiv, table, td, bodyMarginTop = parseFloat( jQuery.curCSS(body, "marginTop", true) ) || 0,
			html = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";

		jQuery.extend( container.style, { position: "absolute", top: 0, left: 0, margin: 0, border: 0, width: "1px", height: "1px", visibility: "hidden" } );

		container.innerHTML = html;
		body.insertBefore( container, body.firstChild );
		innerDiv = container.firstChild;
		checkDiv = innerDiv.firstChild;
		td = innerDiv.nextSibling.firstChild.firstChild;

		this.doesNotAddBorder = (checkDiv.offsetTop !== 5);
		this.doesAddBorderForTableAndCells = (td.offsetTop === 5);

		checkDiv.style.position = "fixed", checkDiv.style.top = "20px";
		// safari subtracts parent border width here which is 5px
		this.supportsFixedPosition = (checkDiv.offsetTop === 20 || checkDiv.offsetTop === 15);
		checkDiv.style.position = checkDiv.style.top = "";

		innerDiv.style.overflow = "hidden", innerDiv.style.position = "relative";
		this.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

		this.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== bodyMarginTop);

		body.removeChild( container );
		body = container = innerDiv = checkDiv = table = td = null;
		jQuery.offset.initialize = jQuery.noop;
	},

	bodyOffset: function( body ) {
		var top = body.offsetTop, left = body.offsetLeft;

		jQuery.offset.initialize();

		if ( jQuery.offset.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.curCSS(body, "marginTop",  true) ) || 0;
			left += parseFloat( jQuery.curCSS(body, "marginLeft", true) ) || 0;
		}

		return { top: top, left: left };
	},
	
	setOffset: function( elem, options, i ) {
		// set position first, in-case top/left are set even on static elem
		if ( /static/.test( jQuery.curCSS( elem, "position" ) ) ) {
			elem.style.position = "relative";
		}
		var curElem   = jQuery( elem ),
			curOffset = curElem.offset(),
			curTop    = parseInt( jQuery.curCSS( elem, "top",  true ), 10 ) || 0,
			curLeft   = parseInt( jQuery.curCSS( elem, "left", true ), 10 ) || 0;

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		var props = {
			top:  (options.top  - curOffset.top)  + curTop,
			left: (options.left - curOffset.left) + curLeft
		};
		
		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({
	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = /^body|html$/i.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.curCSS(elem, "marginTop",  true) ) || 0;
		offset.left -= parseFloat( jQuery.curCSS(elem, "marginLeft", true) ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.curCSS(offsetParent[0], "borderTopWidth",  true) ) || 0;
		parentOffset.left += parseFloat( jQuery.curCSS(offsetParent[0], "borderLeftWidth", true) ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!/^body|html$/i.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( ["Left", "Top"], function( i, name ) {
	var method = "scroll" + name;

	jQuery.fn[ method ] = function(val) {
		var elem = this[0], win;
		
		if ( !elem ) {
			return null;
		}

		if ( val !== undefined ) {
			// Set the scroll offset
			return this.each(function() {
				win = getWindow( this );

				if ( win ) {
					win.scrollTo(
						!i ? val : jQuery(win).scrollLeft(),
						 i ? val : jQuery(win).scrollTop()
					);

				} else {
					this[ method ] = val;
				}
			});
		} else {
			win = getWindow( elem );

			// Return the scroll offset
			return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
				jQuery.support.boxModel && win.document.documentElement[ method ] ||
					win.document.body[ method ] :
				elem[ method ];
		}
	};
});

function getWindow( elem ) {
	return ("scrollTo" in elem && elem.document) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function( i, name ) {

	var type = name.toLowerCase();

	// innerHeight and innerWidth
	jQuery.fn["inner" + name] = function() {
		return this[0] ?
			jQuery.css( this[0], type, false, "padding" ) :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn["outer" + name] = function( margin ) {
		return this[0] ?
			jQuery.css( this[0], type, false, margin ? "margin" : "border" ) :
			null;
	};

	jQuery.fn[ type ] = function( size ) {
		// Get window width or height
		var elem = this[0];
		if ( !elem ) {
			return size == null ? null : this;
		}
		
		if ( jQuery.isFunction( size ) ) {
			return this.each(function( i ) {
				var self = jQuery( this );
				self[ type ]( size.call( this, i, self[ type ]() ) );
			});
		}

		return ("scrollTo" in elem && elem.document) ? // does it walk and quack like a window?
			// Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
			elem.document.compatMode === "CSS1Compat" && elem.document.documentElement[ "client" + name ] ||
			elem.document.body[ "client" + name ] :

			// Get document width or height
			(elem.nodeType === 9) ? // is it a document
				// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
				Math.max(
					elem.documentElement["client" + name],
					elem.body["scroll" + name], elem.documentElement["scroll" + name],
					elem.body["offset" + name], elem.documentElement["offset" + name]
				) :

				// Get or set width or height on the element
				size === undefined ?
					// Get width or height on the element
					jQuery.css( elem, type ) :

					// Set the width or height on the element (default to pixels if value is unitless)
					this.css( type, typeof size === "string" ? size : size + "px" );
	};

});

exports.$ = exports.jQuery = jQuery;

});
;bespin.tiki.register("::bespin", {
    name: "bespin",
    dependencies: { "jquery": "0.0.0" }
});bespin.bootLoaded = true;
bespin.tiki.module("bespin:builtins",function(require,exports,module) {
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Bespin.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Bespin Team (bespin@mozilla.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

exports.metadata =
{
    "bespin":
    {
        "provides":
        [
            {
                "ep": "extensionpoint",
                "name": "extensionpoint",
                "description": "Defines a new extension point",
                "params": [
                    {
                        "name": "name",
                        "type": "string",
                        "description": "the extension point's name",
                        "required": true
                    },
                    {
                        "name": "description",
                        "type": "string",
                        "description": "description of what the extension point is for"
                    },
                    {
                        "name": "params",
                        "type": "array of objects",
                        "description": "parameters that provide the metadata for a given extension. Each object should have name and description, minimally. It can also have a 'type' (eg string, pointer, or array) and required to denote whether or not this parameter must be present on the extension."
                    },
                    {
                        "name": "indexOn",
                        "type": "string",
                        "description": "You can provide an 'indexOn' property to name a property of extensions through which you'd like to be able to easily look up the extension."
                    },
                    {
                        "name": "register",
                        "type": "pointer",
                        "description": "function that is called when a new extension is discovered. Note that this should be used sparingly, because it will cause your plugin to be loaded whenever a matching plugin appears."
                    },
                    {
                        "name": "unregister",
                        "type": "pointer",
                        "description": "function that is called when an extension is removed. Note that this should be used sparingly, because it will cause your plugin to be loaded whenever a matching plugin appears."
                    }
                ]
            },
            {
                "ep": "extensionpoint",
                "name": "extensionhandler",
                "description": "Used to attach listeners ",
                "params": [
                    {
                        "name": "name",
                        "type": "string",
                        "description": "name of the extension point to listen to",
                        "required": true
                    },
                    {
                        "name": "register",
                        "type": "pointer",
                        "description": "function that is called when a new extension is discovered. Note that this should be used sparingly, because it will cause your plugin to be loaded whenever a matching plugin appears."
                    },
                    {
                        "name": "unregister",
                        "type": "pointer",
                        "description": "function that is called when an extension is removed. Note that this should be used sparingly, because it will cause your plugin to be loaded whenever a matching plugin appears."
                    }
                ]
            },
            {
                "ep": "extensionpoint",
                "name": "factory",
                "description": "Provides a factory for singleton components. Each extension needs to provide a name, a pointer and an action. The action can be 'call' (if the pointer refers to a function), 'new' (if the pointer refers to a traditional JS object) or 'value' (if the pointer refers to the object itself that is the component).",
                "indexOn": "name"
            },
            {
                "ep": "factory",
                "name": "hub",
                "action": "create",
                "pointer": "util/hub#Hub"
            },
            {
                "ep": "extensionpoint",
                "name": "command",
                "description": "Editor commands/actions. TODO: list parameters here."
            }
        ]
    }
};

});

bespin.tiki.module("bespin:console",function(require,exports,module) {
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Bespin.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Bespin Team (bespin@mozilla.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

var util = require("util/util");

/**
 * This object represents a "safe console" object that forwards debugging
 * messages appropriately without creating a dependency on Firebug in Firefox.
 */

// We could prefer to copy the methods on window.console to exports.console
// one by one because then we could be sure of using the safe subset that is
// implemented on all browsers, however this doesn't work properly everywhere
// ...

var noop = function() {
};

// These are the functions that are available in Chrome 4/5, Safari 4
// and Firefox 3.6. Don't add to this list without checking browser support
var NAMES = [
    "assert", "count", "debug", "dir", "dirxml", "error", "group", "groupEnd",
    "info", "log", "profile", "profileEnd", "time", "timeEnd", "trace", "warn"
];

if (typeof(window) === 'undefined') {
    // We're in a web worker. Forward to the main thread so the messages
    // will show up.
    var console = {};
    NAMES.forEach(function(name) {
        console[name] = function() {
            var args = Array.prototype.slice.call(arguments);
            var msg = { op: 'log', method: name, args: args };
            postMessage(JSON.stringify(msg));
        };
    });

    exports.console = console;
} else if (util.isSafari || util.isChrome) {
    // Webkit's output functions are bizarre because they get confused if 'this'
    // is not window.console, so we just copy it all across
    exports.console = window.console;
} else {
    // So we're not in Webkit, but we may still be no console object (in the
    // case of Firefox without Firebug)
    exports.console = { };

    // For each of the console functions, copy them if they exist, stub if not
    NAMES.forEach(function(name) {
        if (window.console && window.console[name]) {
            exports.console[name] = window.console[name];
        } else {
            exports.console[name] = noop;
        }
    });
}


});

bespin.tiki.module("bespin:globals",function(require,exports,module) {
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Bespin.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Bespin Team (bespin@mozilla.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

/*
* Installs ES5 and SproutCore monkeypatches as needed.
*/
var installGlobals = function() {
    /**
     * Array detector.
     * Firefox 3.5 and Safari 4 have this already. Chrome 4 however ...
     * Note to Dojo - your isArray is still broken: instanceof doesn't work with
     * Arrays taken from a different frame/window.
     */
    if (!Array.isArray) {
        Array.isArray = function(data) {
            return (data && Object.prototype.toString.call(data) == "[object Array]");
        };
    }

    /**
     * Retrieves the list of keys on an object.
     */
    if (!Object.keys) {
        Object.keys = function(obj) {
            var k, ret = [];
            for (k in obj) {
                if (obj.hasOwnProperty(k)) {
                    ret.push(k);
                }
            }
            return ret;
        };
    }

    if (!Function.prototype.bind) {
        // From Narwhal
        Function.prototype.bind = function () {
            var args = Array.prototype.slice.call(arguments);
            var self = this;
            var bound = function () {
                return self.call.apply(
                    self,
                    args.concat(
                        Array.prototype.slice.call(arguments)
                    )
                );
            };
            bound.name = this.name;
            bound.displayName = this.displayName;
            bound.length = this.length;
            bound.unbound = self;
            return bound;
        };
    }
};

// Narwhal's shim for ES5 defineProperty

// ES5 15.2.3.6
if (!Object.defineProperty) {
    Object.defineProperty = function(object, property, descriptor) {
        var has = Object.prototype.hasOwnProperty;
        if (typeof descriptor == "object" && object.__defineGetter__) {
            if (has.call(descriptor, "value")) {
                if (!object.__lookupGetter__(property) && !object.__lookupSetter__(property)) {
                    // data property defined and no pre-existing accessors
                    object[property] = descriptor.value;
                }
                if (has.call(descriptor, "get") || has.call(descriptor, "set")) {
                    // descriptor has a value property but accessor already exists
                    throw new TypeError("Object doesn't support this action");
                }
            }
            // fail silently if "writable", "enumerable", or "configurable"
            // are requested but not supported
            /*
            // alternate approach:
            if ( // can't implement these features; allow false but not true
            !(has.call(descriptor, "writable") ? descriptor.writable : true) ||
            !(has.call(descriptor, "enumerable") ? descriptor.enumerable : true) ||
            !(has.call(descriptor, "configurable") ? descriptor.configurable : true)
            )
            throw new RangeError(
            "This implementation of Object.defineProperty does not " +
            "support configurable, enumerable, or writable."
            );
            */
            else if (typeof descriptor.get == "function") {
                object.__defineGetter__(property, descriptor.get);
            }
            if (typeof descriptor.set == "function") {
                object.__defineSetter__(property, descriptor.set);
            }
        }
        return object;
    };
}

// ES5 15.2.3.7
if (!Object.defineProperties) {
    Object.defineProperties = function(object, properties) {
        for (var property in properties) {
            if (Object.prototype.hasOwnProperty.call(properties, property)) {
                Object.defineProperty(object, property, properties[property]);
            }
        }
        return object;
    };
}



installGlobals();

});

bespin.tiki.module("bespin:index",function(require,exports,module) {
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Bespin.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Bespin Team (bespin@mozilla.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

// BEGIN VERSION BLOCK
/** The core version of the Bespin system */
exports.versionNumber = 'tip';

/** The version number to display to users */
exports.versionCodename = 'DEVELOPMENT MODE';

/** The version number of the API (to ensure that the client and server are talking the same language) */
exports.apiVersion = 'dev';

// END VERSION BLOCK


});

bespin.tiki.module("bespin:plugins",function(require,exports,module) {
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Bespin.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Bespin Team (bespin@mozilla.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

require("globals");

var Promise = require("promise").Promise;
var group = require("promise").group;
var builtins = require("builtins");
var console = require("console").console;
var util = require("util/util");
var Trace = require("util/stacktrace").Trace;

var r = require;

var loader = require.loader;
var browser = loader.sources[0];

/**
 * Split an extension pointer from module/path#objectName into an object of the
 * type { modName:"module/path", objName:"objectName" } using a pluginName
 * as the base to which roots the pointer
 */
var _splitPointer = function(pluginName, pointer) {
    if (!pointer) {
        return undefined;
    }

    var parts = pointer.split("#");
    var modName;

    // this allows syntax like #foo
    // which is equivalent to PluginName:index#foo
    if (parts[0]) {
        modName = pluginName + ":" + parts[0];
    } else {
        modName = pluginName;
    }

    return {
        modName: modName,
        objName: parts[1]
    };
};

var _retrieveObject = function(pointerObj) {
    var module = r(pointerObj.modName);
    if (pointerObj.objName) {
        return module[pointerObj.objName];
    }
    return module;
};

/**
 * An Extension represents some code that can be lazy-loaded when needed.
 * @constructor
 */
exports.Extension = function(metadata) {
    this.pluginName = null;

    for (property in metadata) {
        if (metadata.hasOwnProperty(property)) {
            this[property] = metadata[property];
        }
    }

    this._observers = [];
};

exports.Extension.prototype = {
    /**
     * Asynchronously load the actual code represented by this Extension
     * @param callback Function to call when the load has finished (deprecated)
     * @param property Extension property to load (default 'pointer')
     * @returns A promise to be fulfilled on completion. Preferred over using the
     * <tt>callback</tt> parameter.
     */
    load: function(callback, property) {
        var promise = new Promise();

        var onComplete = function(func) {
            if (callback) {
                callback(func);
            }
            promise.resolve(func);
        };

        var pointerVal = this[property || 'pointer'];
        if (util.isFunction(pointerVal)) {
            onComplete(pointerVal);
            return promise;
        }

        var pointerObj = _splitPointer(this.pluginName, pointerVal);

        if (!pointerObj) {
            console.error('Extension cannot be loaded because it has no \'pointer\'');
            console.log(this);

            promise.reject(new Error('Extension has no \'pointer\' to call'));
            return promise;
        }
        
        exports.catalog.loadPlugin(this.pluginName).then(function() {
            require.ensure(pointerObj.modName, function() {
                var func = _retrieveObject(pointerObj);
                onComplete(func);

                // TODO: consider caching 'func' to save looking it up again
                // Something like: this._setPointer(property, data);
            });
        });

        return promise;
    },

    /**
     * Loads this extension and passes the result to the callback.
     * Any time this extension changes, the callback is called with the new value.
     * Note that if this extension goes away, the callback will be called with
     * undefined.
     * <p>observingPlugin is required, because if that plugin is torn down,
     * all of its observing callbacks need to be torn down as well.
     */
    observe: function(observingPlugin, callback, property) {
        this._observers.push({
            plugin: observingPlugin,
            callback: callback,
            property: property
        });
        this.load(callback, property);
    },

    /**
     * Returns the name of the plugin that provides this extension.
     */
    getPluginName: function() {
        return this.pluginName;
    },

    /**
     *
     */
    _getLoaded: function(property) {
        var pointerObj = this._getPointer(property);
        return _retrieveObject(pointerObj);
    }
};

/**
 * An ExtensionPoint is a get of Extensions grouped under the same name
 * for fast access.
 * @constructor
 */
exports.ExtensionPoint = function(name, catalog) {
    this.name = name;
    this.catalog = catalog;

    this.pluginName = undefined;
    this.indexOn = undefined;

    this.extensions = [];
    this.handlers = [];
};

/**
 * Implementation of ExtensionPoint
 */
exports.ExtensionPoint.prototype = {
    /**
    * Retrieves the list of plugins which provide extensions
    * for this extension point.
    */
    getImplementingPlugins: function() {
        var pluginSet = {};
        this.extensions.forEach(function(ext) {
            pluginSet[ext.pluginName] = true;
        });
        var matches = Object.keys(pluginSet);
        matches.sort();
        return matches;
    },

    /**
     * Get the name of the plugin that defines this extension point.
     */
    getDefiningPluginName: function() {
        return this.pluginName;
    },

    /**
     * If we are keeping an index (an indexOn property is set on the
     * extension point), you can look up an extension by key.
     */
    getByKey: function(key) {
        var indexOn = this.indexOn;

        if (!indexOn) {
            return undefined;
        }

        for (var i = 0; i < this.extensions.length; i++) {
            if (this.extensions[i][indexOn] == key) {
                return this.extensions[i];
            }
        }
        return undefined;
    },

    register: function(extension) {
        this.extensions.push(extension);
        this.handlers.forEach(function(handler) {
            if (handler.register) {
                handler.load(function(register) {
                    if (!register) {
                        console.error('missing register function for pluginName=', extension.pluginName, ", extension=", extension.name);
                    } else {
                         register(extension);
                    }
                }, "register");
            }
        });
    },

    unregister: function(extension) {
        this.extensions.splice(this.extensions.indexOf(extension), 1);
        this.handlers.forEach(function(handler) {
            if (handler.unregister) {
                handler.load(function(unregister) {
                    if (!unregister) {
                        console.error('missing unregister function for pluginName=', extension.pluginName, ", extension=", extension.name);
                    } else {
                         unregister(extension);
                    }
                }, "unregister");
            }
        });
    },

    /**
     * Order the extensions by a plugin order.
     */
    orderExtensions: function(pluginOrder) {
        var orderedExt = [];

        for (var i = 0; i < pluginOrder.length; i++) {
            var n = 0;
            while (n != this.extensions.length) {
                if (this.extensions[n].pluginName === pluginOrder[i]) {
                    orderedExt.push(this.extensions[n]);
                    this.extensions.splice(n, 1);
                } else {
                    n ++;
                }
            }
        }

        this.extensions = orderedExt.concat(this.extensions);
    }
};

/**
 * A Plugin is a set of Extensions that are loaded as a unit
 * @constructor
 */
exports.Plugin = function(metadata) {
    // Should be provided in the metadata
    this.catalog = null;
    this.name = null;
    this.provides = [];
    this.stylesheets = [];
    this.reloadURL = null;
    this.reloadPointer = null;

    for (property in metadata) {
        if (metadata.hasOwnProperty(property)) {
            this[property] = metadata[property];
        }
    }
};

/**
 * Implementation of Plugin
 */
exports.Plugin.prototype = {
    register: function() {
        this.provides.forEach(function(extension) {
            var ep = this.catalog.getExtensionPoint(extension.ep, true);
            ep.register(extension);
        }, this);
    },

    unregister: function() {
        this.provides.forEach(function(extension) {
            var ep = this.catalog.getExtensionPoint(extension.ep, true);
            ep.unregister(extension);
        }, this);
    },

    _getObservers: function() {
        var result = {};
        this.provides.forEach(function(extension) {
            console.log('ep: ', extension.ep);
            console.log(extension._observers);
            result[extension.ep] = extension._observers;
        });
        return result;
    },

    /**
     * Figure out which plugins depend on a given plugin. This
     * will allow the reload behavior to unregister/reregister
     * all of the plugins that depend on the one being reloaded.
     */
    _findDependents: function(pluginList, dependents) {
        var pluginName = this.name;
        var self = this;
        pluginList.forEach(function(testPluginName) {
            if (testPluginName == pluginName) {
                return;
            }
            var plugin = self.catalog.plugins[testPluginName];
            if (plugin && plugin.dependencies) {
                for (dependName in plugin.dependencies) {
                    if (dependName == pluginName && !dependents[testPluginName]) {
                        dependents[testPluginName] = {
                            keepModule: false
                        };
                        plugin._findDependents(pluginList, dependents);
                    }
                }
            }
        });
    },

    /**
     * removes the plugin from Tiki's registries.
     */
    _cleanup: function() {
        // Remove the css files.
        this.stylesheets.forEach(function(stylesheet) {
            var links = document.getElementsByTagName('link');
            for (var i = 0; i < links.length; i++) {
                if (links[i].href.indexOf(stylesheet.url) != -1) {
                    links[i].parentNode.removeChild(links[i]);
                    break;
                }
            }
        });

        // Remove all traces of the plugin.
        var pluginName = this.name;

        var nameMatch = new RegExp("^" + pluginName + '$');
        var moduleMatch = new RegExp('^::' + pluginName + ':');
        var packageMatch = new RegExp("^::" + pluginName + '$');

        var sandbox = require.sandbox;
        var loader = require.loader;
        var source = browser;

        // Clear the loader.
        _removeFromObject(moduleMatch, loader.factories);
        _removeFromObject(packageMatch, loader.canonicalIds);
        _removeFromObject(packageMatch, loader.canonicalPackageIds);
        _removeFromObject(packageMatch, loader.packageSources);
        _removeFromObject(packageMatch, loader.packages);

        // Clear the sandbox.
        _removeFromObject(moduleMatch, sandbox.exports);
        _removeFromObject(moduleMatch, sandbox.modules);
        _removeFromObject(moduleMatch, sandbox.usedExports);

        // Clear the source.
        _removeFromObject(nameMatch, source.packageInfoByName);
        _removeFromObject(moduleMatch, source.factories);
        _removeFromObject(moduleMatch, source.scriptActions);
        _removeFromObject(moduleMatch, source.stylesheetActions);
        _removeFromObject(packageMatch, source.packages);
        _removeFromObject(packageMatch, source.ensureActions);
        _removeFromObject(packageMatch, source.packageInfoById);
    },

    /**
     * reloads the plugin and reinitializes all
     * dependent plugins
     */
    reload: function(callback) {
        // TODO: Broken. Needs to be updated to the latest Tiki.

        // All reloadable plugins will have a reloadURL
        if (!this.reloadURL) {
            return;
        }

        if (this.reloadPointer) {
            var pointer = _splitPointer(this.name, this.reloadPointer);
            func = _retrieveObject(pointer);
            if (func) {
                func();
            } else {
                console.error("Reload function could not be loaded. Aborting reload.");
                return;
            }
        }

        // find all of the dependents recursively so that
        // they can all be unregistered
        var dependents = {};

        var pluginList = Object.keys(this.catalog.plugins);

        this._findDependents(pluginList, dependents);

        var reloadDescription = {
            pluginName: this.name,
            dependents: dependents
        };

        for (var dependName in dependents) {
            var plugin = this.catalog.plugins[dependName];
            if (plugin.preRefresh) {
                var parts = _splitPointer(dependName, plugin.preRefresh);
                func = _retrieveObject(parts);
                if (func) {
                    // the preRefresh call can return an object
                    // that includes attributes:
                    // keepModule (true to keep the module object)
                    // callPointer (pointer to call at the end of reloading)
                    dependents[dependName] = func(reloadDescription);
                }
            }
        }

        // notify everyone that this plugin is going away
        this.unregister();

        for (dependName in dependents) {
            this.catalog.plugins[dependName].unregister();
        }

        this._cleanup(this.name);

        // clear the sandbox of modules from all of the dependent plugins
        var fullModList = [];
        var sandbox = require.sandbox;

        var modulesKey = Object.keys(sandbox.modules);
        var i = modulesKey.length;
        var dependRegexes = [];
        for (dependName in dependents) {
            // check to see if the module stated that it shouldn't be
            // refreshed
            if (!dependents[dependName].keepModule) {
                dependRegexes.push(new RegExp("^::" + dependName + ":"));
            }
        }

        var nameMatch = new RegExp("^::" + this.name + ":");

        while (--i >= 0) {
            var item = modulesKey[i];
            if (nameMatch.exec(item)) {
                fullModList.push(item);
            } else {
                var j = dependRegexes.length;
                while (--j >= 0) {
                    if (dependRegexes[j].exec(item)) {
                        fullModList.push(item);
                        break;
                    }
                }
            }
        }

        // Remove the modules of the dependent plugins from the sandbox.
        fullModList.forEach(function(item) {
            delete sandbox.exports[item];
            delete sandbox.modules[item];
            delete sandbox.usedExports[item];
        });

        // reload the plugin metadata
        var onLoad = function() {
            // actually load the plugin, so that it's ready
            // for any dependent plugins
            this.catalog.loadPlugin(this.name).then(function() {
                // re-register all of the dependent plugins
                for (dependName in dependents) {
                    this.catalog.plugins[dependName].register();
                }

                for (dependName in dependents) {
                    if (dependents[dependName].callPointer) {
                        var parts = _splitPointer(dependName,
                            dependents[dependName].callPointer);
                        var func = _retrieveObject(parts);
                        if (func) {
                            func(reloadDescription);
                        }
                    }
                }

                if (callback) {
                    // at long last, reloading is done.
                    callback();
                }
            }.bind(this));
        }.bind(this);

        // TODO: There should be more error handling then just logging
        // to the command line.
        var onError = function() {
            console.error('Failed to load metadata from ' + this.reloadURL);
        }.bind(this);

        this.catalog.loadMetadataFromURL(this.reloadURL).then(onLoad, onError);
    }
};

var _setPath = function(root, path, value) {
    var segments = path.split('.');
    var current = root;
    var top = segments.length - 1;
    if (top > 0) {
        for (var i = 0; i < top; i++) {
            current = current[segments[i]];
        }
    }
    current[top] = value;
};

exports.Catalog = function() {
    this.points = {};
    this.plugins = {};
    this.deactivatedPlugins = {};
    this._extensionsOrdering = [];
    this.instances = {};
    this.instancesLoadPromises = {};
    this._objectDescriptors = {};

    // set up the "extensionpoint" extension point.
    // it indexes on name.
    var ep = this.getExtensionPoint("extensionpoint", true);
    ep.indexOn = "name";
    this.loadMetadata(builtins.metadata);
};

exports.Catalog.prototype = {
    /**
     * Registers information about an instance that will be tracked
     * by the catalog. The first parameter is the name used for looking up
     * the object. The descriptor should contain:
     * - factory (optional): name of the factory extension used to create the
     *                       object. defaults to the same value as the name
     *                       property.
     * - arguments (optional): array that is passed in if the factory is a
     *                      function.
     * - objects (optional): object that describes other objects that are
     *                      required when constructing this one (see below)
     *
     * The objects object defines objects that must be created before this
     * one and how they should be passed in. The key defines how they
     * are passed in, and the value is the name of the object to pass in.
     * You define how they are passed in relative to the arguments
     * array, using a very simple interface of dot separated keys.
     * For example, if you have an arguments array of [null, {foo: null}, "bar"]
     * you can have an object array like this:
     * {
     *  "0": "myCoolObject",
     *  "1.foo": "someOtherObject"
     * }
     *
     * which will result in arguments like this:
     * [myCoolObject, {foo: someOtherObject}, "bar"]
     * where myCoolObject and someOtherObject are the actual objects
     * created elsewhere.
     *
     * If the plugin containing the factory is reloaded, the object will
     * be recreated. The object will also be recreated if objects passed in
     * are reloaded.
     *
     * This method returns nothing and does not actually create the objects.
     * The objects are created via the createObject method and retrieved
     * via the getObject method.
     */
    registerObject: function(name, descriptor) {
        this._objectDescriptors[name] = descriptor;
    },

    /**
     * Stores an object directly in the instance cache. This should
     * not generally be used because reloading cannot work with
     * these objects.
     */
    _setObject: function(name, obj) {
        this.instances[name] = obj;
    },

    /**
     * Creates an object with a previously registered descriptor.
     *
     * Returns a promise that will be resolved (with the created object)
     * once the object has been made. The promise will be resolved
     * immediately if the instance is already there.
     *
     * throws an exception if the object is not registered or if
     * the factory cannot be found.
     */
    createObject: function(name) {
        // console.log("Creating", name);

        // If there is already a loading promise for this instance, then
        // return this one.
        if (this.instancesLoadPromises[name] !== undefined) {
            // console.log("Already have one (it's very nice)");
            return this.instancesLoadPromises[name];
        }
        // Otherwise create a new loading promise (which is returned at the
        // end of the function) and create the instance.
        var pr = this.instancesLoadPromises[name] = new Promise();

        var descriptor = this._objectDescriptors[name];
        if (descriptor === undefined) {
            throw new Error('Tried to create object "' + name +
                '" but that object is not registered.');
        }

        var factoryName = descriptor.factory || name;
        var ext = this.getExtensionByKey("factory", factoryName);
        if (ext === undefined) {
            throw new Error('When creating object "' + name +
                '", there is no factory called "' + factoryName +
                '" available."');
        }
        var factoryArguments = descriptor.arguments || [];
        var argumentPromises = [];
        if (descriptor.objects) {
            var objects = descriptor.objects;
            for (var key in objects) {
                var objectName = objects[key];
                var ropr = this.createObject(objectName);
                argumentPromises.push(ropr);
                // key is changing, so we need to hang onto the
                // current value
                ropr.location = key;
                ropr.then(function(obj) {
                    _setPath(factoryArguments, ropr.location, obj);
                });
            }
        }

        group(argumentPromises).then(function() {
            ext.load().then(function(factory) {
                // console.log("Got factory for ", name);
                var action = ext.action;
                var obj;

                if (action === "call") {
                    obj = factory.apply(factory, factoryArguments);
                } else if (action === "new") {
                    if (factoryArguments.length > 1) {
                        pr.reject(new Error('For object ' + name + ', create a simple factory function and change the action to call because JS cannot handle this case.'));
                        return;
                    }
                    obj = new factory(factoryArguments[0]);
                } else if (action === "value") {
                    obj = factory;
                } else {
                    pr.reject(new Error("Create action must be call|new|value. " +
                            "Found" + action));
                    return;
                }

                this.instances[name] = obj;
                pr.resolve(obj);
            }.bind(this));
        }.bind(this));

        return pr;
    },

    /**
     * Retrieve a registered object. Returns undefined
     * if the instance has not been created.
     */
    getObject: function(name) {
        return this.instances[name];
    },

    /** Retrieve an extension point object by name, optionally creating it if it
    * does not exist.
    */
    getExtensionPoint: function(name, create) {
        if (create && this.points[name] === undefined) {
            this.points[name] = new exports.ExtensionPoint(name, this);
        }
        return this.points[name];
    },

    /**
     * Retrieve the list of extensions for the named extension point.
     * If none are defined, this will return an empty array.
     */
    getExtensions: function(name) {
        var ep = this.getExtensionPoint(name);
        if (ep === undefined) {
            return [];
        }
        return ep.extensions;
    },

    /**
     * Sets the order of the plugin's extensions. Note that this orders *only*
     * Extensions and nothing else (load order of CSS files e.g.)
     */
    orderExtensions: function(pluginOrder) {
        pluginOrder = pluginOrder || this._extensionsOrdering;

        for (name in this.points) {
            this.points[name].orderExtensions(pluginOrder);
        }
        this._extensionsOrdering = pluginOrder;
    },

    /**
     * Returns the current plugin exentions ordering.
     */
    getExtensionsOrdering: function() {
        return this._extensionsOrdering;
    },

    /**
     * Look up an extension in an indexed extension point by the given key. If
     * the extension point or the key are unknown, undefined will be returned.
     */
    getExtensionByKey: function(name, key) {
        var ep = this.getExtensionPoint(name);
        if (ep === undefined) {
            return undefined;
        }

        return ep.getByKey(key);
    },

    _registerExtensionPoint: function(extension) {
        var ep = this.getExtensionPoint(extension.name, true);
        ep.description = extension.description;
        ep.pluginName = extension.pluginName;
        ep.params = extension.params;
        if (extension.indexOn) {
            ep.indexOn = extension.indexOn;
        }

        if (extension.register || extension.unregister) {
            this._registerExtensionHandler(extension);
        }
    },

    _registerExtensionHandler: function(extension) {
        var ep = this.getExtensionPoint(extension.name, true);
        ep.handlers.push(extension);
        if (extension.register) {
            // Store the current extensions to this extension point. We can't
            // use the ep.extensions array within the load-callback-function, as
            // the array at that point in time also contains extensions that got
            // registered by calling the handler.register function directly.
            // As such, using the ep.extensions in the load-callback-function
            // would result in calling the handler's register function on a few
            // extensions twice.
            var extensions = util.clone(ep.extensions);

            extension.load(function(register) {
                if (!register) {
                    throw extension.name + " is not ready";
                }
                extensions.forEach(function(ext) {
                    // console.log('call register on:', ext)
                    register(ext);
                });
            }, "register");
        }

    },

    // Topological sort algorithm from Wikipedia, credited to Tarjan 1976.
    //     http://en.wikipedia.org/wiki/Topological_sort
    _toposort: function(metadata) {
        var sorted = [];
        var visited = {};
        var visit = function(key) {
            if (key in visited || !(key in metadata)) {
                return;
            }

            visited[key] = true;
            var depends = metadata[key].dependencies;
            if (!util.none(depends)) {
                for (var dependName in depends) {
                    visit(dependName);
                }
            }

            sorted.push(key);
        };

        for (var key in metadata) {
            visit(key);
        }

        return sorted;
    },

    loadMetadata: function(metadata) {
        var plugins = this.plugins;
        
        var pluginName;

        for (pluginName in metadata) {
            // Skip if the plugin is not activated.
            if (this.deactivatedPlugins[pluginName]) {
                continue;
            }

            var md = metadata[pluginName];
            if (md.errors) {
                console.error("Plugin ", pluginName, " has errors:");
                md.errors.forEach(function(error) {
                    console.error(error);
                });
                delete metadata[pluginName];
                continue;
            }

            if (md.dependencies) {
                md.depends = Object.keys(md.dependencies);
            }

            md.name = pluginName;
            md.version = null;
            // console.log("loading metadata for", pluginName, " -> ", md);

            var packageId = browser.canonicalPackageId(pluginName);
            if (packageId === null) {
                browser.register('::' + pluginName, md);
                continue;
            }
        }

        this._toposort(metadata).forEach(function(name) {
            var md = metadata[name];
            var activated = !(this.deactivatedPlugins[name]);

            md.catalog = this;
            md.name = name;
            var plugin = new exports.Plugin(md);
            plugins[name] = plugin;

            // Skip if the plugin is not activated.
            if (md.provides && activated) {
                var provides = md.provides;
                for (var i = 0; i < provides.length; i++) {
                    var extension = new exports.Extension(provides[i]);
                    extension.pluginName = name;
                    provides[i] = extension;
                    var epname = extension.ep;
                    if (epname == "extensionpoint") {
                        this._registerExtensionPoint(extension);
                    } else if (epname == "extensionhandler") {
                        this._registerExtensionHandler(extension);
                    }
                    var ep = this.getExtensionPoint(extension.ep, true);
                    ep.register(extension);
                }
            } else {
                md.provides = [];
            }
        }, this);

        for (pluginName in metadata) {
            this._checkLoops(pluginName, plugins, []);
        }

        this.orderExtensions();
    },

    /**
     * Loads the named plugin, returning a promise called
     * when the plugin is loaded. This function is a convenience
     * for unusual situations and debugging only. Generally,
     * you should load plugins by calling load() on an Extension
     * object.
     */
    loadPlugin: function(pluginName) {
        var pr = new Promise();
        var plugin = this.plugins[pluginName];
        if (plugin.objects) {
            var objectPromises = [];
            plugin.objects.forEach(function(objectName) {
                objectPromises.push(this.createObject(objectName));
            }.bind(this));
            group(objectPromises).then(function() {
                require.ensurePackage(pluginName, function() {
                    pr.resolve();
                });
            });
        } else {
            require.ensurePackage(pluginName, function() {
                pr.resolve();
            });
        }
        return pr;
    },

    /**
     * Retrieve metadata from the server. Returns a promise that is
     * resolved when the metadata has been loaded.
     */
    loadMetadataFromURL: function(url, type) {
        var pr = new Promise();
        var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if (req.readyState !== 4) {
                return;
            }

            var status = req.status;
            if (status !== 0 && status !== 200) {
                pr.reject("XHR error: " + req.statusText);
                return;
            }

            this.loadMetadata(JSON.parse(req.responseText));
            pr.resolve();
        }.bind(this);

        req.open("GET", url, true);
        req.send();

        return pr;
    },

    deactivatePlugin: function(pluginName) {
        var plugin = this.plugins[pluginName];
        if (plugin !== undefined) {
            plugin.unregister();
            plugin._cleanup();
        }

        this.deactivatedPlugins[pluginName] = true;
    },

    /**
     * Removes a plugin, unregistering it and cleaning up.
     */
    removePlugin: function(pluginName) {
        var plugin = this.plugins[pluginName];
        if (plugin == undefined) {
            throw new Error("Attempted to remove plugin " + pluginName
                                            + " which does not exist.");
        }

        plugin.unregister();
        plugin._cleanup();
        delete this.plugins[pluginName];
    },

    /**
     * for the given plugin, get the first part of the URL required to
     * get at that plugin's resources (images, etc.).
     */
    getResourceURL: function(pluginName) {
        var link = document.getElementById("bespin_base");
        var base = "";
        if (link) {
            base += link.href;
            if (!util.endsWith(base, "/")) {
                base += "/";
            }
        }
        var plugin = this.plugins[pluginName];
        if (plugin == undefined) {
            return undefined;
        }
        return base + plugin.resourceURL;
    },

    /**
     * Check the dependency graph to ensure we don't have cycles.
     */
    _checkLoops: function(pluginName, data, trail) {
        var circular = false;
        trail.forEach(function(node) {
            if (pluginName === node) {
                console.error("Circular dependency", pluginName, trail);
                circular = true;
            }
        });
        if (circular) {
            return true;
        }
        trail.push(pluginName);
        if (!data[pluginName]) {
            console.error("Missing metadata for ", pluginName);
        } else {
            if (data[pluginName].dependencies) {
                for (var dependency in data[pluginName].dependencies) {
                    var trailClone = trail.slice();
                    var errors = this._checkLoops(dependency, data, trailClone);
                    if (errors) {
                        console.error("Errors found when looking at ", pluginName);
                        return true;
                    }
                }
            }
        }
        return false;
    },

    /**
     * Retrieve an array of the plugin objects.
     * The opts object can include the following options:
     * onlyType (string): only include plugins of this type
     * sortBy (array): list of keys to sort by (the primary sort is first).
     *                 default is sorted alphabetically by name.
     */
    getPlugins: function(opts) {
        var result = [];
        var onlyType = opts.onlyType;

        for (var key in this.plugins) {
            var plugin = this.plugins[key];

            // apply the filter
            if ((onlyType && plugin.type && plugin.type != onlyType)
                || plugin.name == "bespin") {
                continue;
            }

            result.push(plugin);
        }

        var sortBy = opts.sortBy;
        if (!sortBy) {
            sortBy = ["name"];
        }

        var sortfunc = function(a, b) {
            for (var i = 0; i < sortBy.length; i++) {
                key = sortBy[i];
                if (a[key] < b[key]) {
                    return -1;
                } else if (b[key] < a[key]) {
                    return 1;
                }
            }
            return 0;
        };

        result.sort(sortfunc);
        return result;
    },

    /**
     * Returns a promise to retrieve the object at the given property path,
     * loading the plugin if necessary.
     */
    loadObjectForPropertyPath: function(path, context) {
        var promise = new Promise();
        var parts = /^([^:]+):([^#]+)#(.*)$/.exec(path);
        if (parts === null) {
            throw new Error("loadObjectForPropertyPath: malformed path: '" +
                path + "'");
        }

        var pluginName = parts[1];
        if (pluginName === "") {
            if (util.none(context)) {
                throw new Error("loadObjectForPropertyPath: no plugin name " +
                    "supplied and no context is present");
            }

            pluginName = context;
        }

        require.ensurePackage(pluginName, function() {
            promise.resolve(this.objectForPropertyPath(path));
        }.bind(this));

        return promise;
    },

    /**
     * Finds the object for the passed path or array of path components.  This is
     * the standard method used in SproutCore to traverse object paths.
     * @param path {String} the path
     * @param root {Object} optional root object.  window is used otherwise
     * @param stopAt {Integer} optional point to stop searching the path.
     * @returns {Object} the found object or undefined.
     */
    objectForPropertyPath: function(path, root, stopAt) {
        stopAt = (stopAt == undefined) ? path.length : stopAt;
        if (!root) {
            root = window;
        }

        var hashed = path.split("#");
        if (hashed.length !== 1) {
            var module = require(hashed[0]);
            if (module === undefined) {
                return undefined;
            }

            path = hashed[1];
            root = module;
            stopAt = stopAt - hashed[0].length;
        }

        var loc = 0;
        while (root && loc < stopAt) {
            var nextDotAt = path.indexOf('.', loc);
            if (nextDotAt < 0 || nextDotAt > stopAt) {
                nextDotAt = stopAt;
            }
            var key = path.slice(loc, nextDotAt);
            root = root[key];
            loc = nextDotAt + 1;
        }

        if (loc < stopAt) {
            root = undefined; // hit a dead end. :(
        }

        return root;
    },

    /**
     * Publish <tt>value</tt> to all plugins that match both <tt>ep</tt> and
     * <tt>key</tt>.
     * @param source {object} The source calling the publish function.
     * @param ep {string} An extension point (indexed by the catalog) to which
     * we publish the information.
     * @param key {string} A key to which we publish (linearly searched, allowing
     * for regex matching).
     * @param value {object} The data to be passed to the subscribing function.
     */
    publish: function(source, ep, key, value) {
        var subscriptions = this.getExtensions(ep);
        subscriptions.forEach(function(sub) {
            // compile regexes only once
            if (sub.match && !sub.regexp) {
                sub.regexp = new RegExp(sub.match);
            }
            if (sub.regexp && sub.regexp.test(key)
                    || sub.key === key
                    || (util.none(sub.key) && util.none(key))) {
                sub.load().then(function(handler) {
                    handler(source, key, value);
                });
            }
        });
    },

    /**
     * The subscribe side of #publish for use when the object which will
     * publishes is created dynamically.
     * @param ep The extension point name to subscribe to
     * @param metadata An object containing:
     * <ul>
     * <li>pointer: A function which should be called on matching publish().
     * This can also be specified as a pointer string, however if you can do
     * that, you should be placing the metadata in package.json.
     * <li>key: A string that exactly matches the key passed to the publish()
     * function. For smarter matching, you can use 'match' instead...
     * <li>match: A regexp to be used in place of key
     * </ul>
     */
    registerExtension: function(ep, metadata) {
        var extension = new exports.Extension(metadata);
        extension.pluginName = '__dynamic';
        this.getExtensionPoint(ep).register(extension);
    }
};

exports.catalog = new exports.Catalog();

var _removeFromList = function(regex, array, matchFunc) {
    var i = 0;
    while (i < array.length) {
        if (regex.exec(array[i])) {
            var item = array.splice(i, 1);
            if (matchFunc) {
                matchFunc(item);
            }
            continue;
        }
        i++;
    }
};

var _removeFromObject = function(regex, obj) {
    var keys = Object.keys(obj);
    var i = keys.length;
    while (--i > 0) {
        if (regex.exec(keys[i])) {
            delete obj[keys[i]];
        }
    }
};

exports.getUserPlugins = function() {
    return exports.catalog.getPlugins({ onlyType: 'user' });
};

});

bespin.tiki.module("bespin:promise",function(require,exports,module) {
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Bespin.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Bespin Team (bespin@mozilla.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

var console = require('bespin:console').console;
var Trace = require('bespin:util/stacktrace').Trace;

/**
 * A promise can be in one of 2 states.
 * The ERROR and SUCCESS states are terminal, the PENDING state is the only
 * start state.
 */
var ERROR = -1;
var PENDING = 0;
var SUCCESS = 1;

/**
 * We give promises and ID so we can track which are outstanding
 */
var _nextId = 0;

/**
 * Debugging help if 2 things try to complete the same promise.
 * This can be slow (especially on chrome due to the stack trace unwinding) so
 * we should leave this turned off in normal use.
 */
var _traceCompletion = false;

/**
 * Outstanding promises. Handy list for debugging only.
 */
exports._outstanding = [];

/**
 * Recently resolved promises. Also for debugging only.
 */
exports._recent = [];

/**
 * Create an unfulfilled promise
 */
exports.Promise = function () {
    this._status = PENDING;
    this._value = undefined;
    this._onSuccessHandlers = [];
    this._onErrorHandlers = [];

    // Debugging help
    this._id = _nextId++;
    //this._createTrace = new Trace(new Error());
    exports._outstanding[this._id] = this;
};

/**
 * Yeay for RTTI.
 */
exports.Promise.prototype.isPromise = true;

/**
 * Have we either been resolve()ed or reject()ed?
 */
exports.Promise.prototype.isComplete = function() {
    return this._status != PENDING;
};

/**
 * Have we resolve()ed?
 */
exports.Promise.prototype.isResolved = function() {
    return this._status == SUCCESS;
};

/**
 * Have we reject()ed?
 */
exports.Promise.prototype.isRejected = function() {
    return this._status == ERROR;
};

/**
 * Take the specified action of fulfillment of a promise, and (optionally)
 * a different action on promise rejection.
 */
exports.Promise.prototype.then = function(onSuccess, onError) {
    if (onSuccess !== null && onSuccess !== undefined) {
        this._onSuccessHandlers.push(onSuccess);
    }
    if (onError !== null && onError !== undefined) {
        this._onErrorHandlers.push(onError);
    }

    if (this._status === SUCCESS) {
        onSuccess.call(null, this._value);
    }
    if (this._status === ERROR) {
        onError.call(null, this._value);
    }

    return this;
};

/**
 * Like then() except that rather than returning <tt>this</tt> we return
 * a promise which
 */
exports.Promise.prototype.chainPromise = function(onSuccess) {
    var chain = new exports.Promise();
    chain._chainedFrom = this;
    this.then(function(data) {
        try {
            chain.resolve(onSuccess(data));
        } catch (ex) {
            chain.reject(ex);
        }
    }, function(ex) {
        chain.reject(ex);
    });
    return chain;
};

/**
 * Supply the fulfillment of a promise
 */
exports.Promise.prototype.resolve = function(data) {
    return this._complete(this._onSuccessHandlers, SUCCESS, data, 'resolve');
};

/**
 * Renege on a promise
 */
exports.Promise.prototype.reject = function(data) {
    return this._complete(this._onErrorHandlers, ERROR, data, 'reject');
};

/**
 * Internal method to be called on resolve() or reject().
 * @private
 */
exports.Promise.prototype._complete = function(list, status, data, name) {
    // Complain if we've already been completed
    if (this._status != PENDING) {
        console.group('Promise already closed');
        console.error('Attempted ' + name + '() with ', data);
        console.error('Previous status = ', this._status,
                ', previous value = ', this._value);
        console.trace();

        if (this._completeTrace) {
            console.error('Trace of previous completion:');
            this._completeTrace.log(5);
        }
        console.groupEnd();
        return this;
    }

    if (_traceCompletion) {
        this._completeTrace = new Trace(new Error());
    }

    this._status = status;
    this._value = data;

    // Call all the handlers, and then delete them
    list.forEach(function(handler) {
        handler.call(null, this._value);
    }, this);
    this._onSuccessHandlers.length = 0;
    this._onErrorHandlers.length = 0;

    // Remove the given {promise} from the _outstanding list, and add it to the
    // _recent list, pruning more than 20 recent promises from that list.
    delete exports._outstanding[this._id];
    exports._recent.push(this);
    while (exports._recent.length > 20) {
        exports._recent.shift();
    }

    return this;
};


/**
 * Takes an array of promises and returns a promise that that is fulfilled once
 * all the promises in the array are fulfilled
 * @param group The array of promises
 * @return the promise that is fulfilled when all the array is fulfilled
 */
exports.group = function(promiseList) {
    if (!(promiseList instanceof Array)) {
        promiseList = Array.prototype.slice.call(arguments);
    }

    // If the original array has nothing in it, return now to avoid waiting
    if (promiseList.length === 0) {
        return new exports.Promise().resolve([]);
    }

    var groupPromise = new exports.Promise();
    var results = [];
    var fulfilled = 0;

    var onSuccessFactory = function(index) {
        return function(data) {
            results[index] = data;
            fulfilled++;
            // If the group has already failed, silently drop extra results
            if (groupPromise._status !== ERROR) {
                if (fulfilled === promiseList.length) {
                    groupPromise.resolve(results);
                }
            }
        };
    };

    promiseList.forEach(function(promise, index) {
        var onSuccess = onSuccessFactory(index);
        var onError = groupPromise.reject.bind(groupPromise);
        promise.then(onSuccess, onError);
    });

    return groupPromise;
};

});

bespin.tiki.module("bespin:util/cookie",function(require,exports,module) {
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Bespin.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Bespin Team (bespin@mozilla.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

/**
 * Adds escape sequences for special characters in regular expressions
 * @param {String} str a String with special characters to be left unescaped
 */
var escapeString = function(str, except){
    return str.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, function(ch){
        if(except && except.indexOf(ch) != -1){
            return ch;
        }
        return "\\" + ch;
    });
};

/**
 * Get a cookie value by name
 * @param {String} name The cookie value to retrieve
 * @return The value, or undefined if the cookie was not found
 */
exports.get = function(name) {
    var matcher = new RegExp("(?:^|; )" + escapeString(name) + "=([^;]*)");
    var matches = document.cookie.match(matcher);
    return matches ? decodeURIComponent(matches[1]) : undefined;
};

/**
 * Set a cookie value
 * @param {String} name The cookie value to alter
 * @param {String} value The new value for the cookie
 * @param {Object} props (Optional) cookie properties. One of:<ul>
 * <li>expires: Date|String|Number|null If a number, the number of days from
 * today at which the cookie will expire. If a date, the date past which the
 * cookie will expire. If expires is in the past, the cookie will be deleted.
 * If expires is omitted or is 0, the cookie will expire either directly (ff3)
 * or when the browser closes
 * <li>path: String|null The path to use for the cookie.
 * <li>domain: String|null The domain to use for the cookie.
 * <li>secure: Boolean|null Whether to only send the cookie on secure connections
 * </ul>
 */
exports.set = function(name, value, props) {
    props = props || {};

    if (typeof props.expires == "number") {
        var date = new Date();
        date.setTime(date.getTime() + props.expires * 24 * 60 * 60 * 1000);
        props.expires = date;
    }
    if (props.expires && props.expires.toUTCString) {
        props.expires = props.expires.toUTCString();
    }

    value = encodeURIComponent(value);
    var updatedCookie = name + "=" + value, propName;
    for (propName in props) {
        updatedCookie += "; " + propName;
        var propValue = props[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
};

/**
 * Remove a cookie by name. Depending on the browser, the cookie will either
 * be deleted directly or at browser close.
 * @param {String} name The cookie value to retrieve
 */
exports.remove = function(name) {
    exports.set(name, "", { expires: -1 });
};

/**
 * Use to determine if the current browser supports cookies or not.
 * @return Returns true if user allows cookies, false otherwise
 */
exports.isSupported = function() {
    if (!("cookieEnabled" in navigator)) {
        exports.set("__djCookieTest__", "CookiesAllowed");
        navigator.cookieEnabled = exports.get("__djCookieTest__") == "CookiesAllowed";
        if (navigator.cookieEnabled) {
            exports.remove("__djCookieTest__");
        }
    }
    return navigator.cookieEnabled;
};

});

bespin.tiki.module("bespin:util/scratchcanvas",function(require,exports,module) {
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Bespin.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Bespin Team (bespin@mozilla.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

var util = require('bespin:util/util');

/**
 * A invisible singleton canvas on the page, useful whenever a canvas context
 * is needed (e.g. for computing text sizes), but an actual canvas isn't handy
 * at the moment.
 * @constructor
 */
var ScratchCanvas = function() {
    this._canvas = document.getElementById('bespin-scratch-canvas');

    // It's possible that another ScratchCanvas instance in another sandbox
    // exists on the page. If so, we assume they're compatible, and use
    // that one.
    if (util.none(this._canvas)) {
        this._canvas = document.createElement('canvas');
        this._canvas.id = 'bespin-scratch-canvas';
        this._canvas.width = 400;
        this._canvas.height = 300;
        this._canvas.style.position = 'absolute';
        this._canvas.style.top = "-10000px";
        this._canvas.style.left = "-10000px";
        document.body.appendChild(this._canvas);
    }
};

ScratchCanvas.prototype.getContext = function() {
    return this._canvas.getContext('2d');
};

/**
 * Returns the width in pixels of the given string ("M", by default) in the
 * given font.
 */
ScratchCanvas.prototype.measureStringWidth = function(font, str) {
    if (util.none(str)) {
        str = "M";
    }

    var context = this.getContext();
    context.save();
    context.font = font;
    var width = context.measureText(str).width;
    context.restore();
    return width;
};

var singleton = null;

/**
 * Returns the instance of the scratch canvas on the page, creating it if
 * necessary.
 */
exports.get = function() {
    if (singleton === null) {
        singleton = new ScratchCanvas();
    }
    return singleton;
};

});

bespin.tiki.module("bespin:util/stacktrace",function(require,exports,module) {
// Changed to suit the specific needs of running within Bespin

// Domain Public by Eric Wendelin http://eriwen.com/ (2008)
//                  Luke Smith http://lucassmith.name/ (2008)
//                  Loic Dachary <loic@dachary.org> (2008)
//                  Johan Euphrosine <proppy@aminche.com> (2008)
//                  Øyvind Sean Kinsey http://kinsey.no/blog
//
// Information and discussions
// http://jspoker.pokersource.info/skin/test-printstacktrace.html
// http://eriwen.com/javascript/js-stack-trace/
// http://eriwen.com/javascript/stacktrace-update/
// http://pastie.org/253058
// http://browsershots.org/http://jspoker.pokersource.info/skin/test-printstacktrace.html
//

//
// guessFunctionNameFromLines comes from firebug
//
// Software License Agreement (BSD License)
//
// Copyright (c) 2007, Parakey Inc.
// All rights reserved.
//
// Redistribution and use of this software in source and binary forms, with or without modification,
// are permitted provided that the following conditions are met:
//
// * Redistributions of source code must retain the above
//   copyright notice, this list of conditions and the
//   following disclaimer.
//
// * Redistributions in binary form must reproduce the above
//   copyright notice, this list of conditions and the
//   following disclaimer in the documentation and/or other
//   materials provided with the distribution.
//
// * Neither the name of Parakey Inc. nor the names of its
//   contributors may be used to endorse or promote products
//   derived from this software without specific prior
//   written permission of Parakey Inc.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
// IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
// FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
// DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
// IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
// OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

var util = require('bespin:util/util');
var console = require("bespin:console").console;

/**
 * Different browsers create stack traces in different ways.
 * <strike>Feature</strike> Browser detection baby ;).
 */
var mode = (function() {

    // We use SC's browser detection here to avoid the "break on error"
    // functionality provided by Firebug. Firebug tries to do the right
    // thing here and break, but it happens every time you load the page.
    // bug 554105
    if (util.isMozilla) {
        return 'firefox';
    } else if (util.isOpera) {
        return 'opera';
    } else if (util.isSafari) {
        return 'other';
    }

    // SC doesn't do any detection of Chrome at this time.

    // this is the original feature detection code that is used as a
    // fallback.
    try {
        (0)();
    } catch (e) {
        if (e.arguments) {
            return 'chrome';
        }
        if (e.stack) {
            return 'firefox';
        }
        if (window.opera && !('stacktrace' in e)) { //Opera 9-
            return 'opera';
        }
    }
    return 'other';
})();

/**
 *
 */
function stringifyArguments(args) {
    for (var i = 0; i < args.length; ++i) {
        var argument = args[i];
        if (typeof argument == 'object') {
            args[i] = '#object';
        } else if (typeof argument == 'function') {
            args[i] = '#function';
        } else if (typeof argument == 'string') {
            args[i] = '"' + argument + '"';
        }
    }
    return args.join(',');
}

/**
 * Extract a stack trace from the format emitted by each browser.
 */
var decoders = {
    chrome: function(e) {
        var stack = e.stack;
        if (!stack) {
            console.log(e);
            return [];
        }
        return stack.replace(/^.*?\n/, '').
                replace(/^.*?\n/, '').
                replace(/^.*?\n/, '').
                replace(/^[^\(]+?[\n$]/gm, '').
                replace(/^\s+at\s+/gm, '').
                replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@').
                split('\n');
    },

    firefox: function(e) {
        var stack = e.stack;
        if (!stack) {
            console.log(e);
            return [];
        }
        // stack = stack.replace(/^.*?\n/, '');
        stack = stack.replace(/(?:\n@:0)?\s+$/m, '');
        stack = stack.replace(/^\(/gm, '{anonymous}(');
        return stack.split('\n');
    },

    // Opera 7.x and 8.x only!
    opera: function(e) {
        var lines = e.message.split('\n'), ANON = '{anonymous}',
            lineRE = /Line\s+(\d+).*?script\s+(http\S+)(?:.*?in\s+function\s+(\S+))?/i, i, j, len;

        for (i = 4, j = 0, len = lines.length; i < len; i += 2) {
            if (lineRE.test(lines[i])) {
                lines[j++] = (RegExp.$3 ? RegExp.$3 + '()@' + RegExp.$2 + RegExp.$1 : ANON + '()@' + RegExp.$2 + ':' + RegExp.$1) +
                ' -- ' +
                lines[i + 1].replace(/^\s+/, '');
            }
        }

        lines.splice(j, lines.length - j);
        return lines;
    },

    // Safari, Opera 9+, IE, and others
    other: function(curr) {
        var ANON = '{anonymous}', fnRE = /function\s*([\w\-$]+)?\s*\(/i, stack = [], j = 0, fn, args;

        var maxStackSize = 10;
        while (curr && stack.length < maxStackSize) {
            fn = fnRE.test(curr.toString()) ? RegExp.$1 || ANON : ANON;
            args = Array.prototype.slice.call(curr['arguments']);
            stack[j++] = fn + '(' + stringifyArguments(args) + ')';

            //Opera bug: if curr.caller does not exist, Opera returns curr (WTF)
            if (curr === curr.caller && window.opera) {
                //TODO: check for same arguments if possible
                break;
            }
            curr = curr.caller;
        }
        return stack;
    }
};

/**
 *
 */
function NameGuesser() {
}

NameGuesser.prototype = {

    sourceCache: {},

    ajax: function(url) {
        var req = this.createXMLHTTPObject();
        if (!req) {
            return;
        }
        req.open('GET', url, false);
        req.setRequestHeader('User-Agent', 'XMLHTTP/1.0');
        req.send('');
        return req.responseText;
    },

    createXMLHTTPObject: function() {
	    // Try XHR methods in order and store XHR factory
        var xmlhttp, XMLHttpFactories = [
            function() {
                return new XMLHttpRequest();
            }, function() {
                return new ActiveXObject('Msxml2.XMLHTTP');
            }, function() {
                return new ActiveXObject('Msxml3.XMLHTTP');
            }, function() {
                return new ActiveXObject('Microsoft.XMLHTTP');
            }
        ];
        for (var i = 0; i < XMLHttpFactories.length; i++) {
            try {
                xmlhttp = XMLHttpFactories[i]();
                // Use memoization to cache the factory
                this.createXMLHTTPObject = XMLHttpFactories[i];
                return xmlhttp;
            } catch (e) {}
        }
    },

    getSource: function(url) {
        if (!(url in this.sourceCache)) {
            this.sourceCache[url] = this.ajax(url).split('\n');
        }
        return this.sourceCache[url];
    },

    guessFunctions: function(stack) {
        for (var i = 0; i < stack.length; ++i) {
            var reStack = /{anonymous}\(.*\)@(\w+:\/\/([-\w\.]+)+(:\d+)?[^:]+):(\d+):?(\d+)?/;
            var frame = stack[i], m = reStack.exec(frame);
            if (m) {
                var file = m[1], lineno = m[4]; //m[7] is character position in Chrome
                if (file && lineno) {
                    var functionName = this.guessFunctionName(file, lineno);
                    stack[i] = frame.replace('{anonymous}', functionName);
                }
            }
        }
        return stack;
    },

    guessFunctionName: function(url, lineNo) {
        try {
            return this.guessFunctionNameFromLines(lineNo, this.getSource(url));
        } catch (e) {
            return 'getSource failed with url: ' + url + ', exception: ' + e.toString();
        }
    },

    guessFunctionNameFromLines: function(lineNo, source) {
        var reFunctionArgNames = /function ([^(]*)\(([^)]*)\)/;
        var reGuessFunction = /['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*(function|eval|new Function)/;
        // Walk backwards from the first line in the function until we find the line which
        // matches the pattern above, which is the function definition
        var line = '', maxLines = 10;
        for (var i = 0; i < maxLines; ++i) {
            line = source[lineNo - i] + line;
            if (line !== undefined) {
                var m = reGuessFunction.exec(line);
                if (m) {
                    return m[1];
                }
                else {
                    m = reFunctionArgNames.exec(line);
                }
                if (m && m[1]) {
                    return m[1];
                }
            }
        }
        return '(?)';
    }
};

var guesser = new NameGuesser();

var frameIgnorePatterns = [
    /http:\/\/localhost:4020\/sproutcore.js:/
];

exports.ignoreFramesMatching = function(regex) {
    frameIgnorePatterns.push(regex);
};

/**
 * Create a stack trace from an exception
 * @param ex {Error} The error to create a stacktrace from (optional)
 * @param guess {Boolean} If we should try to resolve the names of anonymous functions
 */
exports.Trace = function Trace(ex, guess) {
    this._ex = ex;
    this._stack = decoders[mode](ex);

    if (guess) {
        this._stack = guesser.guessFunctions(this._stack);
    }
};

/**
 * Log to the console a number of lines (default all of them)
 * @param lines {number} Maximum number of lines to wrote to console
 */
exports.Trace.prototype.log = function(lines) {
    if (lines <= 0) {
        // You aren't going to have more lines in your stack trace than this
        // and it still fits in a 32bit integer
        lines = 999999999;
    }

    var printed = 0;
    for (var i = 0; i < this._stack.length && printed < lines; i++) {
        var frame = this._stack[i];
        var display = true;
        frameIgnorePatterns.forEach(function(regex) {
            if (regex.test(frame)) {
                display = false;
            }
        });
        if (display) {
            console.debug(frame);
            printed++;
        }
    }
};

});

bespin.tiki.module("bespin:util/util",function(require,exports,module) {
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Bespin.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Bespin Team (bespin@mozilla.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

/**
 * Create an object representing a de-serialized query section of a URL.
 * Query keys with multiple values are returned in an array.
 * <p>Example: The input "foo=bar&foo=baz&thinger=%20spaces%20=blah&zonk=blarg&"
 * Produces the output object:
 * <pre>{
 *   foo: [ "bar", "baz" ],
 *   thinger: " spaces =blah",
 *   zonk: "blarg"
 * }
 * </pre>
 * <p>Note that spaces and other urlencoded entities are correctly handled
 * @see dojo.queryToObject()
 * While dojo.queryToObject() is mainly for URL query strings, this version
 * allows to specify a separator character
 */
exports.queryToObject = function(str, seperator) {
    var ret = {};
    var qp = str.split(seperator || "&");
    var dec = decodeURIComponent;
    qp.forEach(function(item) {
        if (item.length) {
            var parts = item.split("=");
            var name = dec(parts.shift());
            var val = dec(parts.join("="));
            if (exports.isString(ret[name])){
                ret[name] = [ret[name]];
            }
            if (Array.isArray(ret[name])){
                ret[name].push(val);
            } else {
                ret[name] = val;
            }
        }
    });
    return ret;
};

/**
 * Takes a name/value mapping object and returns a string representing a
 * URL-encoded version of that object for use in a GET request
 * <p>For example, given the input:
 * <code>{ blah: "blah", multi: [ "thud", "thonk" ] }</code>
 * The following string would be returned:
 * <code>"blah=blah&multi=thud&multi=thonk"</code>
 * @param map {Object} The object to convert
 * @return {string} A URL-encoded version of the input
 */
exports.objectToQuery = function(map) {
    // FIXME: need to implement encodeAscii!!
    var enc = encodeURIComponent;
    var pairs = [];
    var backstop = {};
    for (var name in map) {
        var value = map[name];
        if (value != backstop[name]) {
            var assign = enc(name) + "=";
            if (value.isArray) {
                for (var i = 0; i < value.length; i++) {
                    pairs.push(assign + enc(value[i]));
                }
            } else {
                pairs.push(assign + enc(value));
            }
        }
    }
    return pairs.join("&");
};

/**
 * Holds the count to keep a unique value for setTimeout
 * @private See rateLimit()
 */
var nextRateLimitId = 0;

/**
 * Holds the timeouts so they can be cleared later
 * @private See rateLimit()
 */
var rateLimitTimeouts = {};

/**
 * Delay calling some function to check that it's not called again inside a
 * maxRate. The real function is called after maxRate ms unless the return
 * value of this function is called before, in which case the clock is restarted
 */
exports.rateLimit = function(maxRate, scope, func) {
    if (maxRate) {
        var rateLimitId = nextRateLimitId++;

        return function() {
            if (rateLimitTimeouts[rateLimitId]) {
                clearTimeout(rateLimitTimeouts[rateLimitId]);
            }

            rateLimitTimeouts[rateLimitId] = setTimeout(function() {
                func.apply(scope, arguments);
                delete rateLimitTimeouts[rateLimitId];
            }, maxRate);
        };
    }
};

/**
 * Return true if it is a String
 */
exports.isString = function(it) {
    return (typeof it == "string" || it instanceof String);
};

/**
 * Returns true if it is a Boolean.
 */
exports.isBoolean = function(it) {
    return (typeof it == 'boolean');
};

/**
 * Returns true if it is a Number.
 */
exports.isNumber = function(it) {
    return (typeof it == 'number' && isFinite(it));
};

/**
 * Hack copied from dojo.
 */
exports.isObject = function(it) {
    return it !== undefined &&
        (it === null || typeof it == "object" ||
        Array.isArray(it) || exports.isFunction(it));
};

/**
 * Is the passed object a function?
 * From dojo.isFunction()
 */
exports.isFunction = (function() {
    var _isFunction = function(it) {
        var t = typeof it; // must evaluate separately due to bizarre Opera bug. See #8937
        //Firefox thinks object HTML element is a function, so test for nodeType.
        return it && (t == "function" || it instanceof Function) && !it.nodeType; // Boolean
    };

    return exports.isSafari ?
        // only slow this down w/ gratuitious casting in Safari (not WebKit)
        function(/*anything*/ it) {
            if (typeof it == "function" && it == "[object NodeList]") {
                return false;
            }
            return _isFunction(it); // Boolean
        } : _isFunction;
})();

/**
 * A la Prototype endsWith(). Takes a regex excluding the '$' end marker
 */
exports.endsWith = function(str, end) {
    if (!str) {
        return false;
    }
    return str.match(new RegExp(end + "$"));
};

/**
 * A la Prototype include().
 */
exports.include = function(array, item) {
    return array.indexOf(item) > -1;
};

/**
 * Like include, but useful when you're checking for a specific
 * property on each object in the list...
 *
 * Returns null if the item is not in the list, otherwise
 * returns the index of the item.
 */
exports.indexOfProperty = function(array, propertyName, item) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][propertyName] == item) {
            return i;
        }
    }
    return null;
};

/**
 * A la Prototype last().
 */
exports.last = function(array) {
    if (Array.isArray(array)) {
        return array[array.length - 1];
    }
};

/**
 * Knock off any undefined items from the end of an array
 */
exports.shrinkArray = function(array) {
    var newArray = [];

    var stillAtBeginning = true;
    array.reverse().forEach(function(item) {
        if (stillAtBeginning && item === undefined) {
            return;
        }

        stillAtBeginning = false;

        newArray.push(item);
    });

    return newArray.reverse();
};

/**
 * Create an array
 * @param number The size of the new array to create
 * @param character The item to put in the array, defaults to ' '
 */
exports.makeArray = function(number, character) {
    if (number < 1) {
        return []; // give us a normal number please!
    }
    if (!character){character = ' ';}

    var newArray = [];
    for (var i = 0; i < number; i++) {
        newArray.push(character);
    }
    return newArray;
};

/**
 * Repeat a string a given number of times.
 * @param string String to repeat
 * @param repeat Number of times to repeat
 */
exports.repeatString = function(string, repeat) {
    var newstring = '';

    for (var i = 0; i < repeat; i++) {
        newstring += string;
    }

    return newstring;
};

/**
 * Given a row, find the number of leading spaces.
 * E.g. an array with the string "  aposjd" would return 2
 * @param row The row to hunt through
 */
exports.leadingSpaces = function(row) {
    var numspaces = 0;
    for (var i = 0; i < row.length; i++) {
        if (row[i] == ' ' || row[i] == '' || row[i] === undefined) {
            numspaces++;
        } else {
            return numspaces;
        }
    }
    return numspaces;
};

/**
 * Given a row, find the number of leading tabs.
 * E.g. an array with the string "\t\taposjd" would return 2
 * @param row The row to hunt through
 */
exports.leadingTabs = function(row) {
    var numtabs = 0;
    for (var i = 0; i < row.length; i++) {
        if (row[i] == '\t' || row[i] == '' || row[i] === undefined) {
            numtabs++;
        } else {
            return numtabs;
        }
    }
    return numtabs;
};

/**
 * Given a row, extract a copy of the leading spaces or tabs.
 * E.g. an array with the string "\t    \taposjd" would return an array with the
 * string "\t    \t".
 * @param row The row to hunt through
 */
exports.leadingWhitespace = function(row) {
    var leading = [];
    for (var i = 0; i < row.length; i++) {
        if (row[i] == ' ' || row[i] == '\t' || row[i] == '' || row[i] === undefined) {
            leading.push(row[i]);
        } else {
            return leading;
        }
    }
    return leading;
};

/**
 * Given a camelCaseWord convert to "Camel Case Word"
 */
exports.englishFromCamel = function(camel) {
    camel.replace(/([A-Z])/g, function(str) {
        return " " + str.toLowerCase();
    }).trim();
};

/**
 * I hate doing this, but we need some way to determine if the user is on a Mac
 * The reason is that users have different expectations of their key combinations.
 *
 * Take copy as an example, Mac people expect to use CMD or APPLE + C
 * Windows folks expect to use CTRL + C
 */
exports.OS = {
    LINUX: 'LINUX',
    MAC: 'MAC',
    WINDOWS: 'WINDOWS'
};

var ua = navigator.userAgent;
var av = navigator.appVersion;

/** Is the user using a browser that identifies itself as Linux */
exports.isLinux = av.indexOf("Linux") >= 0;

/** Is the user using a browser that identifies itself as Windows */
exports.isWindows = av.indexOf("Win") >= 0;

/** Is the user using a browser that identifies itself as WebKit */
exports.isWebKit = parseFloat(ua.split("WebKit/")[1]) || undefined;

/** Is the user using a browser that identifies itself as Chrome */
exports.isChrome = parseFloat(ua.split("Chrome/")[1]) || undefined;

/** Is the user using a browser that identifies itself as Mac OS */
exports.isMac = av.indexOf("Macintosh") >= 0;

/* Is this Firefox or related? */
exports.isMozilla = av.indexOf('Gecko/') >= 0;

if (ua.indexOf("AdobeAIR") >= 0) {
    exports.isAIR = 1;
}

/**
 * Is the user using a browser that identifies itself as Safari
 * See also:
 * - http://developer.apple.com/internet/safari/faq.html#anchor2
 * - http://developer.apple.com/internet/safari/uamatrix.html
 */
var index = Math.max(av.indexOf("WebKit"), av.indexOf("Safari"), 0);
if (index && !exports.isChrome) {
    // try to grab the explicit Safari version first. If we don't get
    // one, look for less than 419.3 as the indication that we're on something
    // "Safari 2-ish".
    exports.isSafari = parseFloat(av.split("Version/")[1]);
    if (!exports.isSafari || parseFloat(av.substr(index + 7)) <= 419.3) {
        exports.isSafari = 2;
    }
}

if (ua.indexOf("Gecko") >= 0 && !exports.isWebKit) {
    exports.isMozilla = parseFloat(av);
}

/**
 * Return a exports.OS constant
 */
exports.getOS = function() {
    if (exports.isMac) {
        return exports.OS['MAC'];
    } else if (exports.isLinux) {
        return exports.OS['LINUX'];
    } else {
        return exports.OS['WINDOWS'];
    }
};

/** Returns true if the DOM element "b" is inside the element "a". */
if (typeof(document) !== 'undefined' && document.compareDocumentPosition) {
    exports.contains = function(a, b) {
        return a.compareDocumentPosition(b) & 16;
    };
} else {
    exports.contains = function(a, b) {
        return a !== b && (a.contains ? a.contains(b) : true);
    };
}

/**
 * Prevents propagation and clobbers the default action of the passed event
 */
exports.stopEvent = function(ev) {
    ev.preventDefault();
    ev.stopPropagation();
};

/**
 * Create a random password of the given length (default 16 chars)
 */
exports.randomPassword = function(length) {
    length = length || 16;
    var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    var pass = "";
    for (var x = 0; x < length; x++) {
        var charIndex = Math.floor(Math.random() * chars.length);
        pass += chars.charAt(charIndex);
    }
    return pass;
};

/**
 * Is the passed object free of members, i.e. are there any enumerable
 * properties which the objects claims as it's own using hasOwnProperty()
 */
exports.isEmpty = function(object) {
    for (var x in object) {
        if (object.hasOwnProperty(x)) {
            return false;
        }
    }
    return true;
};

/**
 * Does the name of a project indicate that it is owned by someone else
 * TODO: This is a major hack. We really should have a File object that include
 * separate owner information.
 */
exports.isMyProject = function(project) {
    return project.indexOf("+") == -1;
};

/**
 * Format a date as dd MMM yyyy
 */
exports.formatDate = function (date) {
    if (!date) {
        return "Unknown";
    }
    return date.getDate() + " " +
        exports.formatDate.shortMonths[date.getMonth()] + " " +
        date.getFullYear();
};

/**
 * Month data for exports.formatDate
 */
exports.formatDate.shortMonths = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

/**
 * Add a CSS class to the list of classes on the given node
 */
exports.addClass = function(node, className) {
    var parts = className.split(/\s+/);
    var cls = " " + node.className + " ";
    for (var i = 0, len = parts.length, c; i < len; ++i) {
        c = parts[i];
        if (c && cls.indexOf(" " + c + " ") < 0) {
            cls += c + " ";
        }
    }
    node.className = cls.trim();
};

/**
 * Remove a CSS class from the list of classes on the given node
 */
exports.removeClass = function(node, className) {
    var cls;
    if (className !== undefined) {
        var parts = className.split(/\s+/);
        cls = " " + node.className + " ";
        for (var i = 0, len = parts.length; i < len; ++i) {
            cls = cls.replace(" " + parts[i] + " ", " ");
        }
        cls = cls.trim();
    } else {
        cls = "";
    }
    if (node.className != cls) {
        node.className = cls;
    }
};

/**
 * Add or remove a CSS class from the list of classes on the given node
 * depending on the value of <tt>include</tt>
 */
exports.setClass = function(node, className, include) {
    if (include) {
        exports.addClass(node, className);
    } else {
        exports.removeClass(node, className);
    }
};

/**
 * Is the passed object either null or undefined (using ===)
 */
exports.none = function(obj) {
    return obj === null || obj === undefined;
};

/**
 * Creates a clone of the passed object.  This function can take just about
 * any type of object and create a clone of it, including primitive values
 * (which are not actually cloned because they are immutable).
 * If the passed object implements the clone() method, then this function
 * will simply call that method and return the result.
 * @param object {Object} the object to clone
 * @returns {Object} the cloned object
 */
exports.clone = function(object) {
    if (Array.isArray(object)) {
        return object.slice();
    }

    if (typeof object === 'object') {
        if (object === null) {
            return null;
        }

        var reply = {};
        for (var key in object) {
            reply[key] = object[key];
        }
        return reply;
    }

    if (object.clone && typeof(object.clone) === 'function') {
        return object.clone();
    }

    // That leaves numbers, booleans, undefined. Doesn't it?
    return object;
};


/**
 * Helper method for extending one object with another
 * Copies all properties from source to target. Returns the extended target
 * object.
 * Taken from John Resig, http://ejohn.org/blog/javascript-getters-and-setters/.
 */
exports.mixin = function(a, b) {
    for (var i in b) {
        var g = b.__lookupGetter__(i);
        var s = b.__lookupSetter__(i);

        if (g || s) {
            if (g) {
                a.__defineGetter__(i, g);
            }
            if (s) {
                a.__defineSetter__(i, s);
            }
        } else {
            a[i] = b[i];
        }
    }

    return a;
};

/**
 * Basically taken from Sproutcore.
 * Replaces the count items from idx with objects.
 */
exports.replace = function(arr, idx, amt, objects) {
    return arr.slice(0, idx).concat(objects).concat(arr.slice(idx + amt));
};

/**
 * Return true if the two frames match.  You can also pass only points or sizes.
 * @param r1 {Rect} the first rect
 * @param r2 {Rect} the second rect
 * @param delta {Float} an optional delta that allows for rects that do not match exactly. Defaults to 0.1
 * @returns {Boolean} true if rects match
 */
exports.rectsEqual = function(r1, r2, delta) {
    if (!r1 || !r2) {
        return r1 == r2;
    }

    if (!delta && delta !== 0) {
        delta = 0.1;
    }

    if ((r1.y != r2.y) && (Math.abs(r1.y - r2.y) > delta)) {
        return false;
    }

    if ((r1.x != r2.x) && (Math.abs(r1.x - r2.x) > delta)) {
        return false;
    }

    if ((r1.width != r2.width) && (Math.abs(r1.width - r2.width) > delta)) {
        return false;
    }

    if ((r1.height != r2.height) && (Math.abs(r1.height - r2.height) > delta)) {
        return false;
    }

    return true;
};

});
;bespin.tiki.register("::syntax_directory", {
    name: "syntax_directory",
    dependencies: {  }
});
bespin.tiki.module("syntax_directory:index",function(require,exports,module) {
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Bespin.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Bespin Team (bespin@mozilla.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

"define metadata";
({
    "description": "Catalogs the available syntax engines",
    "dependencies": {},
    "environments": { "main": true, "worker": true },
    "provides": [
        {
            "ep": "extensionhandler",
            "name": "syntax",
            "register": "#discoveredNewSyntax"
        }
    ]
});
"end";

var plugins = require("bespin:plugins");

function SyntaxInfo(ext) {
    this.extension = ext;
    this.name = ext.name;
    this.fileExts = ext.hasOwnProperty('fileexts') ? ext.fileexts : [];
}

/**
 * Stores metadata for all of the syntax plugins.
 *
 * @exports syntaxDirectory as syntax_directory:syntaxDirectory
 */
var syntaxDirectory = {
    _fileExts: {},
    _syntaxInfo: {},

    get: function(syntaxName) {
        return this._syntaxInfo[syntaxName];
    },

    hasSyntax: function(syntax) {
        return this._syntaxInfo.hasOwnProperty(syntax);
    },

    register: function(extension) {
        var syntaxInfo = new SyntaxInfo(extension);
        this._syntaxInfo[syntaxInfo.name] = syntaxInfo;

        var fileExts = this._fileExts;
        syntaxInfo.fileExts.forEach(function(fileExt) {
            fileExts[fileExt] = syntaxInfo.name;
        });
    },

    syntaxForFileExt: function(fileExt) {
        fileExt = fileExt.toLowerCase();
        var fileExts = this._fileExts;
        return fileExts.hasOwnProperty(fileExt) ? fileExts[fileExt] : 'plain';
    }
};

function discoveredNewSyntax(syntaxExtension) {
    syntaxDirectory.register(syntaxExtension);
}

exports.syntaxDirectory = syntaxDirectory;
exports.discoveredNewSyntax = discoveredNewSyntax;


});
;bespin.tiki.register("::underscore", {
    name: "underscore",
    dependencies: {  }
});
bespin.tiki.module("underscore:index",function(require,exports,module) {
// Underscore.js
// (c) 2010 Jeremy Ashkenas, DocumentCloud Inc.
// Underscore is freely distributable under the terms of the MIT license.
// Portions of Underscore are inspired by or borrowed from Prototype.js,
// Oliver Steele's Functional, and John Resig's Micro-Templating.
// For all details and documentation:
// http://documentcloud.github.com/underscore

"define metadata";
({
    "description": "Functional Programming Aid for Javascript. Works well with jQuery."
});
"end";

(function() {
  // ------------------------- Baseline setup ---------------------------------

  // Establish the root object, "window" in the browser, or "global" on the server.
  var root = this;

  // Save the previous value of the "_" variable.
  var previousUnderscore = root._;

  // Establish the object that gets thrown to break out of a loop iteration.
  var breaker = typeof StopIteration !== 'undefined' ? StopIteration : '__break__';

  // Quick regexp-escaping function, because JS doesn't have RegExp.escape().
  var escapeRegExp = function(s) { return s.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1'); };

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var slice                 = ArrayProto.slice,
      unshift               = ArrayProto.unshift,
      toString              = ObjProto.toString,
      hasOwnProperty        = ObjProto.hasOwnProperty,
      propertyIsEnumerable  = ObjProto.propertyIsEnumerable;

  // All ECMA5 native implementations we hope to use are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) { return new wrapper(obj); };

  // Export the Underscore object for CommonJS.
  if (typeof exports !== 'undefined') exports._ = _;

  // Export underscore to global scope.
  root._ = _;

  // Current version.
  _.VERSION = '1.0.2';

  // ------------------------ Collection Functions: ---------------------------

  // The cornerstone, an each implementation.
  // Handles objects implementing forEach, arrays, and raw objects.
  // Delegates to JavaScript 1.6's native forEach if available.
  var each = _.forEach = function(obj, iterator, context) {
    try {
      if (nativeForEach && obj.forEach === nativeForEach) {
        obj.forEach(iterator, context);
      } else if (_.isNumber(obj.length)) {
        for (var i = 0, l = obj.length; i < l; i++) iterator.call(context, obj[i], i, obj);
      } else {
        for (var key in obj) {
          if (hasOwnProperty.call(obj, key)) iterator.call(context, obj[key], key, obj);
        }
      }
    } catch(e) {
      if (e != breaker) throw e;
    }
    return obj;
  };

  // Return the results of applying the iterator to each element.
  // Delegates to JavaScript 1.6's native map if available.
  _.map = function(obj, iterator, context) {
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    var results = [];
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  // Reduce builds up a single result from a list of values, aka inject, or foldl.
  // Delegates to JavaScript 1.8's native reduce if available.
  _.reduce = function(obj, memo, iterator, context) {
    if (nativeReduce && obj.reduce === nativeReduce) return obj.reduce(_.bind(iterator, context), memo);
    each(obj, function(value, index, list) {
      memo = iterator.call(context, memo, value, index, list);
    });
    return memo;
  };

  // The right-associative version of reduce, also known as foldr. Uses
  // Delegates to JavaScript 1.8's native reduceRight if available.
  _.reduceRight = function(obj, memo, iterator, context) {
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) return obj.reduceRight(_.bind(iterator, context), memo);
    var reversed = _.clone(_.toArray(obj)).reverse();
    return _.reduce(reversed, memo, iterator, context);
  };

  // Return the first value which passes a truth test.
  _.detect = function(obj, iterator, context) {
    var result;
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        _.breakLoop();
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to JavaScript 1.6's native filter if available.
  _.filter = function(obj, iterator, context) {
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    var results = [];
    each(obj, function(value, index, list) {
      iterator.call(context, value, index, list) && results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    var results = [];
    each(obj, function(value, index, list) {
      !iterator.call(context, value, index, list) && results.push(value);
    });
    return results;
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to JavaScript 1.6's native every if available.
  _.every = function(obj, iterator, context) {
    iterator = iterator || _.identity;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    var result = true;
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) _.breakLoop();
    });
    return result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to JavaScript 1.6's native some if available.
  _.some = function(obj, iterator, context) {
    iterator = iterator || _.identity;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    var result = false;
    each(obj, function(value, index, list) {
      if (result = iterator.call(context, value, index, list)) _.breakLoop();
    });
    return result;
  };

  // Determine if a given value is included in the array or object using '==='.
  _.include = function(obj, target) {
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    var found = false;
    each(obj, function(value) {
      if (found = value === target) _.breakLoop();
    });
    return found;
  };

  // Invoke a method with arguments on every item in a collection.
  _.invoke = function(obj, method) {
    var args = _.rest(arguments, 2);
    return _.map(obj, function(value) {
      return (method ? value[method] : value).apply(value, args);
    });
  };

  // Convenience version of a common use case of map: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Return the maximum item or (item-based computation).
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.max.apply(Math, obj);
    var result = {computed : -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj)) return Math.min.apply(Math, obj);
    var result = {computed : Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      return a < b ? -1 : a > b ? 1 : 0;
    }), 'value');
  };

  // Use a comparator function to figure out at what index an object should
  // be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator) {
    iterator = iterator || _.identity;
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >> 1;
      iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Convert anything iterable into a real, live array.
  _.toArray = function(iterable) {
    if (!iterable)                return [];
    if (iterable.toArray)         return iterable.toArray();
    if (_.isArray(iterable))      return iterable;
    if (_.isArguments(iterable))  return slice.call(iterable);
    return _.values(iterable);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    return _.toArray(obj).length;
  };

  // -------------------------- Array Functions: ------------------------------

  // Get the first element of an array. Passing "n" will return the first N
  // values in the array. Aliased as "head". The "guard" check allows it to work
  // with _.map.
  _.first = function(array, n, guard) {
    return n && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the first entry of the array. Aliased as "tail".
  // Especially useful on the arguments object. Passing an "index" will return
  // the rest of the values in the array from that index onward. The "guard"
   //check allows it to work with _.map.
  _.rest = function(array, index, guard) {
    return slice.call(array, _.isUndefined(index) || guard ? 1 : index);
  };

  // Get the last element of an array.
  _.last = function(array) {
    return array[array.length - 1];
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, function(value){ return !!value; });
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array) {
    return _.reduce(array, [], function(memo, value) {
      if (_.isArray(value)) return memo.concat(_.flatten(value));
      memo.push(value);
      return memo;
    });
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    var values = _.rest(arguments);
    return _.filter(array, function(value){ return !_.include(values, value); });
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  _.uniq = function(array, isSorted) {
    return _.reduce(array, [], function(memo, el, i) {
      if (0 == i || (isSorted === true ? _.last(memo) != el : !_.include(memo, el))) memo.push(el);
      return memo;
    });
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersect = function(array) {
    var rest = _.rest(arguments);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = _.toArray(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) results[i] = _.pluck(args, String(i));
    return results;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, MSIE),
  // we need this function. Return the position of the first occurence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to JavaScript 1.8's native indexOf if available.
  _.indexOf = function(array, item) {
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
    for (var i = 0, l = array.length; i < l; i++) if (array[i] === item) return i;
    return -1;
  };


  // Delegates to JavaScript 1.6's native lastIndexOf if available.
  _.lastIndexOf = function(array, item) {
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item);
    var i = array.length;
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python range() function. See:
  // http://docs.python.org/library/functions.html#range
  _.range = function(start, stop, step) {
    var a     = _.toArray(arguments);
    var solo  = a.length <= 1;
    var start = solo ? 0 : a[0], stop = solo ? a[0] : a[1], step = a[2] || 1;
    var len   = Math.ceil((stop - start) / step);
    if (len <= 0) return [];
    var range = new Array(len);
    for (var i = start, idx = 0; true; i += step) {
      if ((step > 0 ? i - stop : stop - i) >= 0) return range;
      range[idx++] = i;
    }
  };

  // ----------------------- Function Functions: ------------------------------

  // Create a function bound to a given object (assigning 'this', and arguments,
  // optionally). Binding with arguments is also known as 'curry'.
  _.bind = function(func, obj) {
    var args = _.rest(arguments, 2);
    return function() {
      return func.apply(obj || {}, args.concat(_.toArray(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = _.rest(arguments);
    if (funcs.length == 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = _.rest(arguments, 2);
    return setTimeout(function(){ return func.apply(func, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(_.rest(arguments)));
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func].concat(_.toArray(arguments));
      return wrapper.apply(wrapper, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = _.toArray(arguments);
    return function() {
      var args = _.toArray(arguments);
      for (var i=funcs.length-1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // ------------------------- Object Functions: ------------------------------

  // Retrieve the names of an object's properties.
  // Delegates to ECMA5's native Object.keys
  _.keys = nativeKeys || function(obj) {
    if (_.isArray(obj)) return _.range(0, obj.length);
    var keys = [];
    for (var key in obj) if (hasOwnProperty.call(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    return _.map(obj, _.identity);
  };

  // Return a sorted list of the function names available on the object.
  _.functions = function(obj) {
    return _.filter(_.keys(obj), function(key){ return _.isFunction(obj[key]); }).sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(_.rest(arguments), function(source) {
      for (var prop in source) obj[prop] = source[prop];
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (_.isArray(obj)) return obj.slice(0);
    return _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    // Check object identity.
    if (a === b) return true;
    // Different types?
    var atype = typeof(a), btype = typeof(b);
    if (atype != btype) return false;
    // Basic equality test (watch out for coercions).
    if (a == b) return true;
    // One is falsy and the other truthy.
    if ((!a && b) || (a && !b)) return false;
    // One of them implements an isEqual()?
    if (a.isEqual) return a.isEqual(b);
    // Check dates' integer values.
    if (_.isDate(a) && _.isDate(b)) return a.getTime() === b.getTime();
    // Both are NaN?
    if (_.isNaN(a) && _.isNaN(b)) return true;
    // Compare regular expressions.
    if (_.isRegExp(a) && _.isRegExp(b))
      return a.source     === b.source &&
             a.global     === b.global &&
             a.ignoreCase === b.ignoreCase &&
             a.multiline  === b.multiline;
    // If a is not an object by this point, we can't handle it.
    if (atype !== 'object') return false;
    // Check for different array lengths before comparing contents.
    if (a.length && (a.length !== b.length)) return false;
    // Nothing else worked, deep compare the contents.
    var aKeys = _.keys(a), bKeys = _.keys(b);
    // Different object sizes?
    if (aKeys.length != bKeys.length) return false;
    // Recursive comparison of contents.
    for (var key in a) if (!(key in b) || !_.isEqual(a[key], b[key])) return false;
    return true;
  };

  // Is a given array or object empty?
  _.isEmpty = function(obj) {
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (hasOwnProperty.call(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType == 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return !!(obj && obj.concat && obj.unshift && !obj.callee);
  };

  // Is a given variable an arguments object?
  _.isArguments = function(obj) {
    return obj && obj.callee;
  };

  // Is a given value a function?
  _.isFunction = function(obj) {
    return !!(obj && obj.constructor && obj.call && obj.apply);
  };

  // Is a given value a string?
  _.isString = function(obj) {
    return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
  };

  // Is a given value a number?
  _.isNumber = function(obj) {
    return (obj === +obj) || (toString.call(obj) === '[object Number]');
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false;
  };

  // Is a given value a date?
  _.isDate = function(obj) {
    return !!(obj && obj.getTimezoneOffset && obj.setUTCFullYear);
  };

  // Is the given value a regular expression?
  _.isRegExp = function(obj) {
    return !!(obj && obj.test && obj.exec && (obj.ignoreCase || obj.ignoreCase === false));
  };

  // Is the given value NaN -- this one is interesting. NaN != NaN, and
  // isNaN(undefined) == true, so we make sure it's a number first.
  _.isNaN = function(obj) {
    return _.isNumber(obj) && isNaN(obj);
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return typeof obj == 'undefined';
  };

  // -------------------------- Utility Functions: ----------------------------

  // Run Underscore.js in noConflict mode, returning the '_' variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function n times.
  _.times = function (n, iterator, context) {
    for (var i = 0; i < n; i++) iterator.call(context, i);
  };

  // Break out of the middle of an iteration.
  _.breakLoop = function() {
    throw breaker;
  };

  // Add your own custom functions to the Underscore object, ensuring that
  // they're correctly added to the OOP wrapper as well.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      addToWrapper(name, _[name] = obj[name]);
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    start       : '<%',
    end         : '%>',
    interpolate : /<%=(.+?)%>/g
  };

  // JavaScript templating a-la ERB, pilfered from John Resig's
  // "Secrets of the JavaScript Ninja", page 83.
  // Single-quote fix from Rick Strahl's version.
  // With alterations for arbitrary delimiters.
  _.template = function(str, data) {
    var c  = _.templateSettings;
    var endMatch = new RegExp("'(?=[^"+c.end.substr(0, 1)+"]*"+escapeRegExp(c.end)+")","g");
    var fn = new Function('obj',
      'var p=[],print=function(){p.push.apply(p,arguments);};' +
      'with(obj){p.push(\'' +
      str.replace(/[\r\t\n]/g, " ")
         .replace(endMatch,"\t")
         .split("'").join("\\'")
         .split("\t").join("'")
         .replace(c.interpolate, "',$1,'")
         .split(c.start).join("');")
         .split(c.end).join("p.push('")
         + "');}return p.join('');");
    return data ? fn(data) : fn;
  };

  // ------------------------------- Aliases ----------------------------------

  _.each     = _.forEach;
  _.foldl    = _.inject       = _.reduce;
  _.foldr    = _.reduceRight;
  _.select   = _.filter;
  _.all      = _.every;
  _.any      = _.some;
  _.head     = _.first;
  _.tail     = _.rest;
  _.methods  = _.functions;

  // ------------------------ Setup the OOP Wrapper: --------------------------

  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.
  var wrapper = function(obj) { this._wrapped = obj; };

  // Helper function to continue chaining intermediate results.
  var result = function(obj, chain) {
    return chain ? _(obj).chain() : obj;
  };

  // A method to easily add functions to the OOP wrapper.
  var addToWrapper = function(name, func) {
    wrapper.prototype[name] = function() {
      var args = _.toArray(arguments);
      unshift.call(args, this._wrapped);
      return result(func.apply(_, args), this._chain);
    };
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      method.apply(this._wrapped, arguments);
      return result(this._wrapped, this._chain);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      return result(method.apply(this._wrapped, arguments), this._chain);
    };
  });

  // Start chaining a wrapped Underscore object.
  wrapper.prototype.chain = function() {
    this._chain = true;
    return this;
  };

  // Extracts the result from a wrapped and chained object.
  wrapper.prototype.value = function() {
    return this._wrapped;
  };

})();

exports._.noConflict();
});

bespin.tiki.require("bespin:plugins").catalog.loadMetadata({"jquery": {"testmodules": [], "resourceURL": "resources/jquery/", "name": "jquery", "type": "plugins/thirdparty"}, "bespin": {"resourceURL": "resources/bespin/", "name": "bespin", "environments": {"main": true, "worker": true}, "dependencies": {"jquery": "1.4.0"}, "testmodules": [], "type": "plugins/boot"}, "syntax_directory": {"resourceURL": "resources/syntax_directory/", "name": "syntax_directory", "environments": {"main": true, "worker": true}, "dependencies": {}, "testmodules": [], "provides": [{"register": "#discoveredNewSyntax", "ep": "extensionhandler", "name": "syntax"}], "type": "plugins/supported", "description": "Catalogs the available syntax engines"}, "underscore": {"testmodules": [], "type": "plugins/thirdparty", "resourceURL": "resources/underscore/", "description": "Functional Programming Aid for Javascript. Works well with jQuery.", "name": "underscore"}});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Bespin.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Bespin Team (bespin@mozilla.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

// Responsible for loading the second script (BespinMain 
// or BespinWorker)

// check to see if we're in a worker
if (typeof(window) === "undefined") {
    importScripts("BespinWorker.js");
} else {
    (function() {
        var mainscript = document.createElement("script");
        mainscript.setAttribute("src", bespin.base + "BespinMain.js");
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(mainscript);
    })();
}
