// Mock instrument library for the background layer (万物声场 plays it, 万物成曲 chooses who plays it): three instruments
// synthesised in the browser (no audio files, no licence needed). An instrument only changes who plays the background's
// notes; with none chosen the notes play in the original soft voice. Each instrument says which parts it is for, so
// several chosen split the work (rules: assignParts in @wanwu-v2/sound-rules/background). They stand in for the real
// library until the server provides licensed instruments through library.ts; more are shown as "coming".
import type {BackgroundPart} from '@wanwu-v2/sound-rules/background';

export type InstrumentRecipe='pad'|'bells'|'pulse';
export type Instrument={
 id:string;name:string;
 /** How it is made: `local-synth` is rendered in the browser from `recipe`; a server instrument will carry samples. */
 source:'local-synth';recipe:InstrumentRecipe;
 /** Parts it plays first; parts it can also cover when nobody leading them is chosen. */
 lead:readonly BackgroundPart[];can:readonly BackgroundPart[];
};

export const mockInstruments:readonly Instrument[]=[
 {id:'inst:local:organ',name:'风琴',source:'local-synth',recipe:'pad',lead:['chord','bass'],can:['melody']},
 {id:'inst:local:xylophone',name:'木琴',source:'local-synth',recipe:'bells',lead:['melody'],can:['chord','bass']},
 {id:'inst:local:drum',name:'小鼓',source:'local-synth',recipe:'pulse',lead:['rhythm'],can:[]},
];
/** Names of instruments planned for later, shown greyed as 即将开放 (not playable). */
export const comingInstruments=['钢琴','笛子','沙锤'] as const;
