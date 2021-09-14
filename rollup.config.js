import {version, author} from './package.json';
import replace from 'rollup-plugin-replace';

const banner =
'/*!\r\n' +
' * Snowy\r\n' +
' * @Version ' + version + '\r\n' +
' * @Author ' + author + '\r\n' +
'*/';

export default {
	input: './src/index.js',
	output: [{
		banner:banner,
		file: './dist/snowy-' + version + '.js',
		format: 'iife',
		name: '$S',
		preferConst:true
	}],
	plugins: [
		replace({
			delimiters: ['', ''],
			__CSS: 'snowy',
			__EVENT: 'snowy',
			__CNEW: true
		})
	]
}