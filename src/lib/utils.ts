import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import { get, writable } from 'svelte/store';

export let disable_key_tracking = writable(false);

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

export function getSelectedText() {
	var text = '';
	if (typeof window.getSelection != 'undefined') {
		text = window.getSelection()?.toString() || '';
	} else if (
		typeof document.getSelection() != 'undefined' &&
		document.getSelection()?.type == 'Text'
	) {
		text = document.getSelection()?.getRangeAt(0).toString() || '';
	}
	return text;
}

export function resize_to_fit(document: Document, first = true) {
	let output = document.getElementById('scramble');
	let outputContainer = document.getElementById('scrambleContainer');
	if (output == null || outputContainer == null) return;
	if (first) {
		output.style.fontSize = '3rem';
		output.style.lineHeight = '150%';
		setTimeout(() => {
			//resize_to_fit(document, false);
		}, 100);
	}
	let fontSize = window.getComputedStyle(output).fontSize;
	if (output.clientHeight >= outputContainer.clientHeight) {
		output.style.fontSize = parseFloat(fontSize) - 2 + 'px';
		//resize_to_fit(document, false);
	}
}

export function timeToFormattedString(time: number, decimals: number) {
	time = time / 1000;
	let minutes = Math.floor(time / 60);
	let seconds = (time % 60).toFixed(decimals);
	if (minutes == 0) return seconds;
	if (parseFloat(seconds) < 10) seconds = '0' + seconds;
	return `${minutes}:${seconds}`;
}

export function getUUID() {
  return crypto.randomUUID();
}

