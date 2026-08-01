import { getWindow } from './browser.js';

export interface RafLoop {
	start(): void;
	stop(): void;
	readonly running: boolean;
}

export function createRafLoop(callback: FrameRequestCallback): RafLoop {
	let frame = 0;
	let running = false;
	const run: FrameRequestCallback = (timestamp) => {
		if (!running) return;
		callback(timestamp);
		frame = getWindow()?.requestAnimationFrame(run) ?? 0;
	};

	return {
		get running() {
			return running;
		},
		start() {
			if (running) return;
			const currentWindow = getWindow();
			if (!currentWindow) return;
			running = true;
			frame = currentWindow.requestAnimationFrame(run);
		},
		stop() {
			if (!running) return;
			getWindow()?.cancelAnimationFrame(frame);
			frame = 0;
			running = false;
		}
	};
}
