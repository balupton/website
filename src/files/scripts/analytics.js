// Re-Invigorate
if ( typeof reinvigorate !== 'undefined' ) {
	reinvigorate.code = "702o7-66905bt9t0";
	reinvigorate.url_filter = function(url) {
		if ( url == reinvigorate.session.url && reinvigorate.url_override != null ) {
			reinvigorate.session.url = url = reinvigorate.url_override;
		}
		return url.replace(/^https?:\/\/(www\.)?/,"http://");
	};
	reinvigorate.ajax_track = function(url) {
		reinvigorate.url_override = url;
		reinvigorate.track(reinvigorate.code);
	};
	reinvigorate.url_override = null;
	reinvigorate.track(reinvigorate.code);
}

// Google Analytics
if ( typeof _gat !== 'undefined' ) {
	var pageTracker = _gat._getTracker("UA-4446117-1");
	pageTracker._initData();
	if ( Modernizr ) {
		pageTracker._setCustomVar(1, "html5.csstransforms", Modernizr.csstransforms ? "yes" : "no" , 2 );
		pageTracker._setCustomVar(2, "html5.draganddrop", Modernizr.draganddrop ? "yes" : "no", 2 );
		pageTracker._setCustomVar(3, "html5.history", Modernizr.history ? "yes" : "no", 2 );
		pageTracker._setCustomVar(4, "html5.localstorage", Modernizr.localstorage ? "yes" : "no", 2 );
		pageTracker._setCustomVar(5, "html5.flexbox", Modernizr.flexbox ? "yes" : "no", 2 );
	}
	pageTracker._trackPageview();
}