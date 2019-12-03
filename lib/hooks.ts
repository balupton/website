import { useState, useEffect } from 'react'
import Router from 'next/router'
import { objectKeys } from 'simplytyped'

export function getHash() {
	return typeof window === 'undefined' ? '' : window.location.hash.substr(1)
}

export function getSearch() {
	return typeof window === 'undefined' ? '' : window.location.search.substr(1)
}

export function useRouteChange(callback: () => any, init = true) {
	useEffect(function() {
		if (init) callback()
		Router.events.on('routeChangeComplete', callback)
		Router.events.on('hashChangeComplete', callback)
		return function() {
			Router.events.on('routeChangeComplete', callback)
			Router.events.on('hashChangeComplete', callback)
		}
	})
}

interface Pages {
	[key: string]: string[]
}
export function useHashPages(pages: Pages): string {
	const [activePage, setPage] = useState('')
	useRouteChange(function() {
		const hash = getHash()
		for (const page of Object.keys(pages)) {
			if (pages[page].includes(hash)) {
				if (activePage !== page) setPage(page)
				return
			}
		}
		if (activePage !== '') setPage('')
	})
	return activePage
}
