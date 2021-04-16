

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