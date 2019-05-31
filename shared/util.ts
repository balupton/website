import { Link } from '../types/app'

export function uniq<T>(...args: Array<null | undefined | T[]>): T[] {
	const set = new Set(args.reduce((a, b) => (a || []).concat(b || [])))
	return Array.from(set.values())
}

export function postComparator(a: Link, b: Link) {
	if (a.date && b.date) {
		return new Date(b.date).getTime() - new Date(a.date).getTime()
	} else return 0
}
