
/*
This plugin is still in beta, don't use it.
*/

(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  module.exports = function(BasePlugin) {
    var CachrPlugin, balUtil, fs, path, request;
    balUtil = require('bal-util');
    request = require('request');
    path = require('path');
    fs = require('fs');
    return CachrPlugin = (function(_super) {

      __extends(CachrPlugin, _super);

      function CachrPlugin() {
        CachrPlugin.__super__.constructor.apply(this, arguments);
      }

      CachrPlugin.prototype.name = 'cachr';

      CachrPlugin.prototype.config = {
        urlPrefix: '/_docpad/plugins/cachr',
        pathPrefix: path.join('_docpad', 'plugins', 'cachr')
      };

      CachrPlugin.prototype.urlsToCache = null;

      CachrPlugin.prototype.queueRemoteUrlSync = function(sourceUrl) {
        var config, details, docpad, name;
        docpad = this.docpad;
        config = this.config;
        name = path.basename(sourceUrl);
        details = {
          name: name,
          sourceUrl: sourceUrl,
          cacheUrl: "" + config.urlPrefix + "/" + name,
          cachePath: path.resolve(docpad.config.outPath, config.pathPrefix, name)
        };
        this.urlsToCache[sourceUrl] = details;
        return details.cacheUrl;
      };

      CachrPlugin.prototype.cacheRemoteUrl = function(details, next) {
        var attempt, docpad, viaRequest;
        docpad = this.docpad;
        attempt = 1;
        viaRequest = function() {
          var writeStream;
          docpad.logger.log('debug', "Cachr is fetching [" + details.sourceUrl + "] to [" + details.cachePath + "]");
          writeStream = fs.createWriteStream(details.cachePath);
          return request({
            uri: details.sourceUrl
          }, function(err) {
            if (err) {
              ++attempt;
              if (attempt === 3) {
                return path.exists(details.cachePath, function(exists) {
                  if (exists) {
                    return fs.unlink(details.cachePath, function(err2) {
                      return typeof next === "function" ? next(err) : void 0;
                    });
                  } else {
                    return typeof next === "function" ? next(err) : void 0;
                  }
                });
              } else {
                return viaRequest();
              }
            } else {
              return typeof next === "function" ? next() : void 0;
            }
          }).pipe(writeStream);
        };
        balUtil.isPathOlderThan(details.cachePath, 1000 * 60 * 5, function(err, older) {
          if (err) return typeof next === "function" ? next(err) : void 0;
          if (older === null || older === true) {
            return viaRequest();
          } else {
            return typeof next === "function" ? next() : void 0;
          }
        });
        return this;
      };

      CachrPlugin.prototype.renderBefore = function(_arg, next) {
        var cachr, templateData;
        templateData = _arg.templateData;
        cachr = this;
        this.urlsToCache = {};
        templateData.cachr = function(sourceUrl) {
          return cachr.queueRemoteUrlSync(sourceUrl);
        };
        if (typeof next === "function") next();
        return this;
      };

      CachrPlugin.prototype.writeAfter = function(_arg, next) {
        var cachr, cachrPath, config, docpad, failures, templateData, urlsToCache;
        templateData = _arg.templateData;
        cachr = this;
        docpad = this.docpad;
        config = this.config;
        urlsToCache = this.urlsToCache;
        cachrPath = path.resolve(docpad.config.outPath, config.pathPrefix);
        failures = 0;
        balUtil.ensurePath(cachrPath, function(err) {
          var tasks,
            _this = this;
          if (err) return typeof next === "function" ? next(err) : void 0;
          tasks = new balUtil.Group(function(err) {
            return docpad.logger.log((failures ? 'warn' : 'info'), 'Cachr finished caching everything', (failures ? "with " + failures + " failures" : ''));
          });
          balUtil.each(urlsToCache, function(details, sourceUrl) {
            return tasks.push(function(complete) {
              return cachr.cacheRemoteUrl(details, function(err) {
                if (err) {
                  docpad.logger.log('warn', "Cachr failed to fetch [" + sourceUrl + "]");
                  docpad.error(err);
                  ++failures;
                }
                return complete();
              });
            });
          });
          tasks.async();
          return typeof next === "function" ? next() : void 0;
        });
        return this;
      };

      return CachrPlugin;

    })(BasePlugin);
  };

}).call(this);
