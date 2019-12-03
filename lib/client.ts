import { Page } from '../types'

export function uniq<T>(...args: Array<null | undefined | T[]>): T[] {
	const set = new Set(args.reduce((a, b) => (a || []).concat(b || [])))
	return Array.from(set.values())
}

export function postComparator(a: Page, b: Page) {
	if (a.date && b.date) {
		return new Date(b.date).getTime() - new Date(a.date).getTime()
	} else return 0
}

export function suffixNumber(input: string | number): string {
	const number = Number(input)
	let result = String(input)

	if (number) {
		if (number >= 1000) {
			result = result.substring(0, result.length - 3) + ',' + result.substr(-3)
		} else if (number >= 10 && number < 20) {
			result += 'th'
		} else {
			switch (result.substr(-1)) {
				case '1':
					result += 'st'
					break
				case '2':
					result += 'nd'
					break
				case '3':
					result += 'rd'
					break
				default:
					result += 'th'
			}
		}
	}

	return result
}

export function floorToNearest(value: number, floorToNearest: number): number {
	return Math.floor(value / floorToNearest) * floorToNearest
}

export function getRank(list: any) {
	const index = list.findIndex((user: any) => user.username === 'balupton')
	return index === -1
		? Promise.reject('could not find me in the listing')
		: Promise.resolve(index + 1)
}
