import * as pathUtil from 'path'
import { promises as fs } from 'fs'
import { Files } from '../lib/types'
const files: Files = []

function add(folder: string) {
	const directory = pathUtil.basename(folder)
	const dir = pathUtil.resolve(__dirname, folder)
	return fs.readdir(dir).then(filenames => {
		filenames.forEach(function(filename) {
			const [basename, extension] = filename.split('.')
			const path = pathUtil.join(dir, filename)
			const url = '/' + pathUtil.join(directory, basename)
			files.push({ basename, extension, directory, path, url })
		})
	})
}

Promise.all([add('../pages/blog'), add('../pages/notes')]).then(() =>
	fs.writeFile(
		pathUtil.resolve(__dirname, '../lib/files.json'),
		JSON.stringify(files, null, '  ')
	)
)

export default files
