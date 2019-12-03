import React from 'react'
import { Children } from '../types'

export default function JSXError({ children }: { children: Children }) {
	console.error(new Error(JSON.stringify(children, null, '  ')))
	return <span className="error">{children}</span>
}
