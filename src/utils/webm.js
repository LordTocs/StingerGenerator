import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { drawPanel } from './stinger';

export async function stingerToWebM(stinger, { frameRate } = { frameRate: 60 })
{
	const ffmpeg = createFFmpeg({ log: true, corePath: 'https://unpkg.com/@ffmpeg/core@0.8.5/dist/ffmpeg-core.js', });
	await ffmpeg.load();
	const frames = Math.ceil(stinger.transitionTime * frameRate);

	const canvas = document.createElement('canvas');
	canvas.setAttribute('width', stinger.width);
	canvas.setAttribute('height', stinger.height);
	const ctx = canvas.getContext('2d');

	console.time("Encoding");
	for (let i = 0; i <= frames; ++i)
	{
		ctx.clearRect(0, 0, stinger.width, stinger.height);
		for (let panel of stinger.panels)
		{
			drawPanel(stinger, panel, ctx, (i / frames) * stinger.transitionTime);
		}

		//frameRgbs.push({ name: `${String(i).padStart(3, '0')}.raw`, data: ctx.getImageData(0, 0, stinger.width, stinger.height).data });
		ffmpeg.FS('writeFile', `${String(i).padStart(3, '0')}.raw`, await fetchFile(ctx.getImageData(0, 0, stinger.width, stinger.height).data));

		console.log("Wrote Frame ", i);
	}

	console.log("Encoding");
	const inputArgs = ['-f', 'image2', '-pixel_format', 'rgba', '-video_size', `${stinger.width}x${stinger.height}`, '-i', '%03d.raw'];
	//const outputArgs = ['-crf', '50', '-b:v', '0', 'output.webm'];
	const outputArgs = ['-deadline', 'realtime', 'output.webm'];

	await ffmpeg.run('-framerate', String(frameRate), ...inputArgs, ...outputArgs);
	console.log("Encoding Complete");
	console.timeEnd("Encoding");

	const data = ffmpeg.FS('readFile', 'output.webm')
	return new Blob([data.buffer], { type: 'video/webm' });
}