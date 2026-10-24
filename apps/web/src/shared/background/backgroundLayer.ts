// What the local background is made from, derived from the work only — the same arrangement data the field, the score
// and the playback read, so the melody's gaps line up with the child's sounds on both pages.
import type {Arrangement} from '@wanwu-v2/contracts/arrangement';
import type {TextbookTrack} from '@wanwu-v2/contracts/textbook';
import type {Inspiration} from '@wanwu-v2/contracts/work';
import type {BackgroundInput} from '@wanwu-v2/sound-rules/background';
import {pieceSeconds,timedEvents} from '../creation/arrangementTiming.ts';
import {presetMood} from '../creation/moodCopy.ts';

/** The textbook card an inspiration points to (teaching music is not analysed yet, so it lends nothing). */
export function inspirationTrack(inspiration:Inspiration,tracks:readonly TextbookTrack[]){
 return inspiration.kind==='textbook'?tracks.find(track=>track.id===inspiration.entryId)??null:null;
}

/** Plan input: the piece's real length, when the child's sounds are heard, the mood and the chosen textbook song. */
export function backgroundInput(arrangement:Arrangement,inspiration:Inspiration,tracks:readonly TextbookTrack[]):BackgroundInput{
 return {
  seconds:pieceSeconds(arrangement),
  sounding:timedEvents(arrangement).map(({start,end})=>({start,end})),
  mood:presetMood(arrangement.mood),
  textbook:inspirationTrack(inspiration,tracks),
  seed:arrangement.id,
 };
}
