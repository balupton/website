import React from 'react'
import Link from './link'

export function SubHeading() {
	return (
		<>
			<span>
				Founded <Link code="bevry" />, <Link code="docpad" />, and{' '}
				<Link code="hostel" />.
			</span>
			<span>
				Accomplished in <Link code="javascript" />, <Link code="nodejs" />,{' '}
				<Link code="webeng">Web Development</Link> and{' '}
				<Link code="opensource" />.
			</span>
			<span>
				Enthusiast of <Link code="quantitativepsychology" />,{' '}
				<Link code="philosophy" /> and <Link code="trading" />.
			</span>
			<span>
				Available for consulting, training and speaking. <Link code="contact" />
				. <Link code="referrals" />.
			</span>
		</>
	)
}

export function About() {
	return (
		<>
			This website is created with <Link code="zeit">ZEIT&apos;s</Link>{' '}
			<Link code="nextjs" /> and is <Link code="source">open-source</Link>.
		</>
	)
}

export function Copyright() {
	return (
		<>
			Unless stated otherwise; all works are Copyright © 2011+{' '}
			<Link code="me" /> and licensed{' '}
			<Link code="permissive-license">permissively</Link> under the{' '}
			<Link code="mit-license" /> for code and the <Link code="cca-license" />{' '}
			for everything else (including content, media and design), enjoy!
		</>
	)
}
