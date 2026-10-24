// 课本讲解 (local template): four short sentences about the textbook song and this piece — its feature, the shape it took
// this time, what happened when it met the child's sounds, and one thing to try right away. Hand-written templates
// filled from the song's feature card and the rules' findings (no model); an AI may polish the wording later.
// No music terms a non-specialist teacher would have to look up, and nothing that judges the child.
import type {TextbookTrack,TextbookVariation} from '@wanwu-v2/contracts/textbook';
import type {Meeting} from '@wanwu-v2/sound-rules/background';
import {metreNames} from './copy.ts';

/** The rhythm cell as children can clap it: 嘀 = half a beat, 嗒 = one beat, 嗒— = longer (e.g. [2,1] → 嗒— 嗒). */
export function rhythmWords(cell:readonly number[]){
 return cell.map(beats=>beats<.75?'嘀':beats<1.5?'嗒':'嗒—').join(' ');
}

export const variationNames={original:'原样',stretch:'拉长',squeeze:'压短',offset:'错开半拍',higher:'换到高处',lower:'换到低处'} satisfies Record<TextbookVariation,string>;

const shapes={
 original:'这次背景用的是它原来的样子。',
 stretch:'这次把它的节奏拉长了一倍，背景听起来更悠闲。',
 squeeze:'这次把它的节奏压短了一半，背景听起来更急。',
 offset:'这次让它晚半拍才出来，像在和你捉迷藏。',
 higher:'这次把它搬到了高处，背景更亮了。',
 lower:'这次把它搬到了低处，背景更稳了。',
} satisfies Record<TextbookVariation,string>;

const meetings={
 together:(name:string|null)=>name?`你的「${name}」正好落在拍子上，和背景一起用力。`:'你的声音落在拍子上，和背景一起用力。',
 answer:()=>'你的声音停下来，背景的旋律就接上，像一问一答。',
 fill:()=>'背景的旋律补在你的声音的空隙里。',
 under:()=>'你的声音一直在响，背景在下面轻轻托着。',
} satisfies Record<Meeting['kind'],(name:string|null)=>string>;

const tasks={
 together:'试试把一个声音往后挪一点，听听还会不会一起用力。',
 answer:'试试在两个声音之间多留一点空，听背景会不会接得更长。',
 fill:'试试把声音挪到前面，听听它们会不会撞在一起。',
 under:'试试拿掉一个声音，让背景出来唱一唱。',
} satisfies Record<Meeting['kind'],string>;

/** 跟着课本: what the guide says first about a song, before the child arranges. */
export function songFeature(track:Pick<TextbookTrack,'title'|'meter'|'rhythmCell'|'childLine'>){
 return `「${track.title}」是${metreNames[track.meter]}，节奏是「${rhythmWords(track.rhythmCell)}」，${track.childLine}。`;
}

export type TextbookTalk={feature:string;shape:string;meeting:string;task:string};
export function textbookTalk(track:Pick<TextbookTrack,'title'|'meter'|'rhythmCell'|'childLine'>,variation:TextbookVariation,meeting:Meeting,exampleName:string|null):TextbookTalk{
 return {feature:songFeature(track),shape:shapes[variation],meeting:meetings[meeting.kind](exampleName),task:tasks[meeting.kind]};
}
