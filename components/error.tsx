import React from 'react'
import { Children } from '../lib/types'
export default function Error({ children }: { children: Children }) {
	return <span className="error">{children}</span>
}
