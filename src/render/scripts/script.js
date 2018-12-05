(function () {
	// Prepare
	const $ = window.jQuery

	// Get Root URL
	// https://github.com/balupton/history.js/blob/master/scripts/uncompressed/history.js#L358
	function getRootUrl () {
		let rootUrl = document.location.protocol + '//' + (document.location.hostname || document.location.host)
		if ( document.location.port ) {
			rootUrl += ':' + document.location.port
		}
		rootUrl += '/'
		return rootUrl
	}

	// Contact Form
	function showModal (which) {
		// Prepare
		const $modal = $('.modal.' + which)

		// Check
		if ( !$modal.hasClass('hide') ) {
			return
		}

		// Prepare
		const $backdropModal = $('.modal.backdrop')

		// Show
		$modal.add($backdropModal).removeClass('hide')
	}
	function hideModals () {
		$('.modal').addClass('hide')
	}

	// Open Link
	function openLink (opts) {
		const url = opts.url
		const action = opts.action
		if ( action === 'new' ) {
			window.open(url, '_blank')
		}
		else if ( action === 'same' ) {
			setTimeout(function () {
				document.location.href = url
			}, 100)
		}
	}

	// Open Outbound Link
	function openOutboundLink (opts) {
		const url = opts.url
		const action = opts.action

		// https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
		const hostname = url.replace(/^.+?\/+([^\/]+).*$/, '$1')
		return openLink(opts)
	}



	// ---------------------------------
	// Selectors

	// Internal Link Helper
	$.expr[':'].internal = function (obj, index, meta, stack) {
		// Prepare
		const $this = $(obj)
		const url = $this.attr('href') || $this.data('href') || ''
		const rootUrl = getRootUrl()

		// Check link
		isInternalLink = url.substring(0, rootUrl.length) === rootUrl || url.indexOf(':') === -1

		// Ignore or Keep
		return isInternalLink
	}

	// External Link Helper
	$.expr[':'].external = function (obj, index, meta, stack) {
		return $.expr[':'].internal(obj, index, meta, stack) === false
	}


	// ---------------------------------
	// jQuery's domReady

	$(function () {
		// Prepare
		const $document = $(document)
		const $body = $(document.body)
		const $window = $(window)


		// ---------------------------------
		// Links

		// Outbound Link Tracking
		$body.on('click', 'a[href]:external', function (event) {
			// Prepare
			let $this, url, action
			$this = $(this)
			url = $this.attr('href')
			if ( !url || url.indexOf('mailto:') === 0 ) {
				return
			}

			// Discover how we should handle the link
			if ( event.which === 2 || event.metaKey ) {
				action = 'default'
			}
			else {
				action = 'same'
				event.preventDefault()
			}

			// Open the link
			const opts = {url, action}
			return openOutboundLink(opts)
		})

		// Modals
		$document.on('keyup', function (event) {
			if ( event.keyCode === 27 /* escape */ ) {
				hideModals()
			}
		})
		$body.on('click', '.modal.backdrop', function (event) {
			event.stopImmediatePropagation()
			event.preventDefault()
			hideModals()
		})
		$body.on('click', '.contact-button', function (event) {
			event.stopImmediatePropagation()
			event.preventDefault()
			showModal('contact')
		})
		$body.on('click', '.referral-button', function (event) {
			event.stopImmediatePropagation()
			event.preventDefault()
			showModal('referrals')
		})
		$window.on('hashchange', function () {
			const state = window.location.hash.replace('#', '')
			switch ( state ) {
				case 'referrals':
				case 'contact':
					showModal(state)
					break
			}
		}).trigger('hashchange')


		// ---------------------------------
		// Misc

		// Show javascript properties
		$('.js').removeClass('js')

		// Handle more to read areas
		$('.more-to-read').hide()
		$('.read-more').click(function () {
			$(this).hide().next('.more-to-read').show()
		})
	})

}())
