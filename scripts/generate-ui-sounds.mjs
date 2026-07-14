import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const sampleRate = 48_000;

const definitions = {
	"start-recording": [
		{ frequency: 660, seconds: 0.09 },
		{ frequency: 880, seconds: 0.13 },
	],
	"stop-recording": [
		{ frequency: 820, seconds: 0.09 },
		{ frequency: 520, seconds: 0.14 },
	],
	screenshot: [
		{ frequency: 1_200, seconds: 0.055 },
		{ frequency: 1_800, seconds: 0.07 },
	],
	action: [{ frequency: 720, seconds: 0.17 }],
};

const destinations = {
	"start-recording": [
		"apps/desktop/src-tauri/sounds/start-recording.wav",
		"apps/chrome-extension/public/sounds/start-recording.wav",
		"apps/web/public/sounds/start-recording.wav",
	],
	"stop-recording": [
		"apps/desktop/src-tauri/sounds/stop-recording.wav",
		"apps/chrome-extension/public/sounds/stop-recording.wav",
		"apps/web/public/sounds/stop-recording.wav",
	],
	screenshot: ["apps/desktop/src-tauri/sounds/screenshot.wav"],
	action: ["apps/desktop/src-tauri/sounds/action.wav"],
};

function makePcm(segments) {
	const values = [];
	let phase = 0;
	for (const segment of segments) {
		const count = Math.round(segment.seconds * sampleRate);
		for (let index = 0; index < count; index += 1) {
			const edge = Math.max(1, Math.round(sampleRate * 0.012));
			const attack = Math.min(1, index / edge);
			const release = Math.min(1, (count - index - 1) / edge);
			const envelope = Math.max(0, Math.min(attack, release));
			values.push(Math.sin(phase) * envelope * 0.22);
			phase += (2 * Math.PI * segment.frequency) / sampleRate;
		}
	}
	return values;
}

function makeWav(samples) {
	const dataBytes = samples.length * 2;
	const buffer = Buffer.alloc(44 + dataBytes);
	buffer.write("RIFF", 0);
	buffer.writeUInt32LE(36 + dataBytes, 4);
	buffer.write("WAVEfmt ", 8);
	buffer.writeUInt32LE(16, 16);
	buffer.writeUInt16LE(1, 20);
	buffer.writeUInt16LE(1, 22);
	buffer.writeUInt32LE(sampleRate, 24);
	buffer.writeUInt32LE(sampleRate * 2, 28);
	buffer.writeUInt16LE(2, 32);
	buffer.writeUInt16LE(16, 34);
	buffer.write("data", 36);
	buffer.writeUInt32LE(dataBytes, 40);
	samples.forEach((sample, index) => {
		buffer.writeInt16LE(Math.round(sample * 32_767), 44 + index * 2);
	});
	return buffer;
}

for (const [name, segments] of Object.entries(definitions)) {
	const wav = makeWav(makePcm(segments));
	for (const relativePath of destinations[name]) {
		const output = resolve(root, relativePath);
		mkdirSync(dirname(output), { recursive: true });
		writeFileSync(output, wav);
	}
}
