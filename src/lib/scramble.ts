import { Scrambow } from '$lib/scrambow/scrambow';
import type { PuzzleID } from 'cubing/twisty';
import { writable } from 'svelte/store';
import clock from './scrambow/scramblers/clock';

export const scramble = writable('loading...');

export const type = writable('333');

export const types: {[group: string]: string[]} = {
	WCA: [
		'333',
		'222',
		'444',
		'555',
		'666',
		'777',
		'megaminx',
		'pyraminx',
		'skewb',
		'square1',
		'clock'
	],
	CFOP: ['cross', 'oll', 'pll'],
	Roux: ['cmll', 'lse']
};

export const typemap: { [type: string]: { display: string; puzzle: PuzzleID; pre_moves: string } } =
	{
		'333': { display: '3x3x3', puzzle: '3x3x3', pre_moves: '' },
		'222': { display: '2x2x2', puzzle: '2x2x2', pre_moves: '' },
		'444': { display: '4x4x4', puzzle: '4x4x4', pre_moves: '' },
		'555': { display: '5x5x5', puzzle: '5x5x5', pre_moves: '' },
		'666': { display: '6x6x6', puzzle: '6x6x6', pre_moves: '' },
		'777': { display: '7x7x7', puzzle: '7x7x7', pre_moves: '' },
		megaminx: { display: 'Megaminx', puzzle: 'megaminx', pre_moves: '' },
		pyraminx: { display: 'Pyraminx', puzzle: 'pyraminx', pre_moves: '' },
		skewb: { display: 'Skewb', puzzle: 'skewb', pre_moves: '' },
		square1: { display: 'Square-1', puzzle: 'square1', pre_moves: '' },
		cross: { display: 'Cross', puzzle: '3x3x3', pre_moves: 'z2' },
		clock: { display: 'Clock', puzzle: 'clock', pre_moves: '' },
		oll: { display: 'OLL', puzzle: '3x3x3', pre_moves: 'z2' },
		pll: { display: 'PLL', puzzle: '3x3x3', pre_moves: 'z2' },
		cmll: { display: 'CMLL', puzzle: '3x3x3', pre_moves: 'z2' },
		lse: { display: 'LSE', puzzle: '3x3x3', pre_moves: 'z2' }
	};

export async function new_scramble(type: string) {
	scramble.set(new Scrambow().setType(type).get()[0].scramble_string);
}
