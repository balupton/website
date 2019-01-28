export function uniq<T>(...args: Array<null | undefined | T[]>): T[] {
	const set = new Set(args.reduce((a, b) => (a || []).concat(b || [])))
	return Array.from(set.values())
}
