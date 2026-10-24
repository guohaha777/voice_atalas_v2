// 换几种样子: which two shapes of the textbook song's feature to offer next to “as it is”, chosen from the arrangement so
// each one meets the child's sounds differently — a busy arrangement gets the cell stretched (room to breathe), a
// sparse one gets it squeezed, otherwise half a beat late; and the melody moves away from where the child's sounds are
// (high sounds → lower, low → higher). Pure; the numbers for each shape are in background.v1.json (variations).
import type {Brightness,TextbookVariation} from '@wanwu-v2/contracts/textbook';
import type {WorkSummary} from './textbookMatch.ts';

export function suggestVariations(summary:Pick<WorkSummary,'density'|'register'>,track:{brightness:Brightness}):[TextbookVariation,TextbookVariation]{
 const rhythm:TextbookVariation=summary.density==='busy'?'stretch':summary.density==='sparse'?'squeeze':'offset';
 const register:TextbookVariation=summary.register==='high'?'lower':summary.register==='low'?'higher':track.brightness==='bright'?'lower':'higher';
 return [rhythm,register];
}
