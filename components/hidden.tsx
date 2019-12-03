import React from 'react'
import { Children } from '../types'

export default function Hidden({ children }: { children: Children }) {
	return <span style={{ display: 'none' }}>{children}</span>
}
