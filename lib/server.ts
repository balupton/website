import * as xml2js from 'xml2js'
import fsUtil, { promises as fs } from 'fs'

import { cachePath } from './config'

function parseXML(xml: string): Promise<object> {
	return new Promise(function(resolve, reject) {
		xml2js.parseString(xml, function(err: undefined | Error, result: object) {
			if (err) return reject(err)
			resolve(result)
		})
	})
}

async function doesExist(path: string): Promise<boolean> {
	return new Promise(function(resolve) {
		fsUtil.exists(path, function(exists) {
			resolve(exists)
		})
	})
}

async function cache(
	url: string,
	type: 'json' | 'xml' | 'text',
	test?: (data: string) => boolean
) {
	const hash = require('crypto')
		.createHash('md5')
		.update(url)
		.digest('hex')
	const cachefile = `${cachePath}/${hash}`
	const exists = await doesExist(cachefile)
	if (exists) {
		let data
		const text = await fs.readFile(cachefile, 'utf8')
		switch (type) {
			case 'json':
				data = JSON.parse(text)
				break
			case 'xml':
				data = await parseXML(text)
				break
			case 'text':
			default:
				data = text
				break
		}
		return data
	} else {
		let data, text
		const response = await fetch(url)
		switch (type) {
			case 'json':
				data = await response.json()
				text = JSON.stringify(data, null, '  ')
				break
			case 'xml':
				text = await response.text()
				data = await parseXML(text)
				break
			case 'text':
			default:
				data = text = await response.text()
				break
		}
		if (test && test(data) !== true) {
			throw new Error(`test failed for ${url} with data: ${text}`)
		}
		await fs.writeFile(cachefile, text)
		return data
	}
}
