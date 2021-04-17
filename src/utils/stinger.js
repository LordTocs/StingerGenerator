import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

export function drawPanel(stinger, panel, ctx, time)
{
	if (typeof panel.color == 'string' || panel.color instanceof String)
	{
		ctx.fillStyle = panel.color;
	}
	else
	{
		const gradient = ctx.createLinearGradient(0, 0, stinger.width, stinger.height);
		gradient.addColorStop(0, "red");
		gradient.addColorStop(1, "blue");
		ctx.fillStyle = gradient;
	}


	const horizOffset = Math.tan(stinger.angle) * stinger.height / 2;

	let maxWidth = 0;
	for (let panel of stinger.panels)
	{
		maxWidth = Math.max(panel.width, maxWidth);
	}

	const effectiveMaxWidth = maxWidth + 2 * horizOffset; //Account for angle offset

	const speed = (stinger.width + effectiveMaxWidth + horizOffset) / stinger.transitionTime;
	const offset = (maxWidth - panel.width) / 2;

	const start = (speed * time + offset) - effectiveMaxWidth;
	const end = start + panel.width;

	//Draw a panel
	const tl = { x: start + horizOffset, y: 0 };
	const tr = { x: end + horizOffset, y: 0 };
	const bl = { x: start - horizOffset, y: stinger.height };
	const br = { x: end - horizOffset, y: stinger.height };

	ctx.beginPath();
	ctx.moveTo(tl.x, tl.y);
	ctx.lineTo(tr.x, tr.y);
	ctx.lineTo(br.x, br.y);
	ctx.lineTo(bl.x, bl.y);
	ctx.closePath();
	ctx.fill();

	if (panel.image)
	{
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(tl.x, tl.y);
		ctx.lineTo(tr.x, tr.y);
		ctx.lineTo(br.x, br.y);
		ctx.lineTo(bl.x, bl.y);
		ctx.closePath();
		ctx.clip();

		const scale = panel.imageStartScale + (panel.imageEndScale - panel.imageStartScale) * (time / stinger.transitionTime);
		const width = panel.image.width * scale;
		const height = panel.image.height * scale;
		ctx.drawImage(panel.image, (stinger.width - width) / 2, (stinger.height - height) / 2, width, height);

		ctx.restore();
	}
}

export async function getStingerBlob(stinger, { frameRate } = { frameRate: 60 })
{

	const ffmpeg = createFFmpeg({ log: true, corePath: 'https://unpkg.com/@ffmpeg/core@0.8.5/dist/ffmpeg-core.js', });
	await ffmpeg.load();

	const frames = Math.ceil(stinger.transitionTime * frameRate);

	const canvas = document.createElement('canvas');
	canvas.setAttribute('width', stinger.width);
	canvas.setAttribute('height', stinger.height);
	const ctx = canvas.getContext('2d');

	for (let i = 0; i <= frames; ++i)
	{
		ctx.clearRect(0, 0, stinger.width, stinger.height);
		for (let panel of stinger.panels)
		{
			drawPanel(stinger, panel, ctx, (i / frames) * stinger.transitionTime);
		}

		//videoWriter.add(canvas);

		const blobPromise = new Promise((resolve) =>
		{
			canvas.toBlob((blob) => resolve(blob), "image/png");
		})

		const blob = await blobPromise;
		const array = await blob.arrayBuffer();
		const array8 = new Uint8Array(array);

		//console.log("Array ", array);

		ffmpeg.FS('writeFile', `${String(i).padStart(3, '0')}.png`, await fetchFile(array8));

		console.log("Wrote Frame ", i);
	}

	//ffmpeg -framerate 25 -f image2 -i frames/%03d.png -c:v libvpx -pix_fmt yuva420p output.webm

	console.log("Encoding");
	await ffmpeg.run('-framerate', String(frameRate), '-f', 'image2', '-i', '%03d.png', '-crf', '50', '-b:v', '0', /*'-c:v', 'libvpx', '-pix_fmt', 'yuva420p',*/ 'output.webm');
	//await ffmpeg.run('-framerate', String(frameRate), '-f', 'image2', '-i', '%03d.png', '-deadline', 'realtime', '-lossless', '1', 'output.webm');
	//await ffmpeg.run('-framerate', String(frameRate), '-f', 'image2', '-i', '%03d.png', '-vcodec', 'qtrle', 'output.mov');
	//-vcodec qtrle
	console.log("Encoding Complete");

	const data = ffmpeg.FS('readFile', 'output.webm')
	return new Blob([data.buffer], { type: 'video/webm' });

	//const data = ffmpeg.FS('readFile', 'output.mov')
	//return new Blob([data.buffer], { type: 'video/quicktime' });
}