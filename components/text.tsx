import React from 'react'
import Error from './error'
import { text } from '../config'

export default function Text({ code }: { code: string }) {
	const fetch = text[code]
	if (!fetch) return <Error>No text with code: {code}</Error>
	return <>{fetch()}</>
}
