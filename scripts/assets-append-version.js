import {readFileSync, renameSync, statSync} from 'fs';
import {sync as globSync} from 'glob';
import {basename, dirname, join} from 'path';
import {fileURLToPath} from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const Package = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)));

const PATTERN = 'dist/*';

const paths = globSync(PATTERN);
paths.forEach((path) => {
	const fileName = basename(path);
	if (statSync(path).isDirectory()) {
		return;
	}

	const ext = fileName.match(/(\..+)$/)[1];
	const base = basename(fileName, ext);
	const versionedPath = join(
		dirname(path),
		`${base}-${Package.version}${ext}`,
	);
	renameSync(path, versionedPath);
});
