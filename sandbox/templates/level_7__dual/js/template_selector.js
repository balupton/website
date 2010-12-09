/**
 * @author balupton
 */

var loc = new String(window.location);
var templater = 'jsmarty=1';

if ( loc.indexOf(templater) <= 0 ) {
	// Not using jsmarty
	if ( loc.indexOf('?') <= 0 ) {
		loc = loc + '?' + templater
	}
	else {
		loc = loc + '&' + templater
	}
	window.location = loc;
}
