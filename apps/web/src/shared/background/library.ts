// Background port, shared by 万物声场 (listen while arranging) and 万物成曲 (choose instruments). The background has three
// steps of a chain (see docs/development/compose-acceptance.md): AI audio → AI notes → local notes → only the child's
// sounds. Only the local step exists: its notes come from @wanwu-v2/sound-rules/background (rules, no model), played by
// the instruments below. The AI steps are server work and not open; the page says which step is playing.
//
// Intended server endpoints (not implemented):
//   GET  /api/v1/instruments                           → Instrument[] (licensed, reviewed; more open over time)
//   POST /api/v1/works/{workId}/background             ← {plan input, instruments} → job → {backgroundUrl, source}
//        source: 'audio-ai' | 'notes-ai'; on failure or timeout the page keeps the local background.
import {comingInstruments,mockInstruments} from './instruments.ts';
import type {Instrument} from './instruments.ts';

/** `example` = made in the browser for this demo, not a licensed library. `coming`: names shown as not open yet. */
export type InstrumentList={origin:'example'|'library';instruments:readonly Instrument[];coming:readonly string[]};

export type BackgroundLibrary={list():Promise<InstrumentList>};

export const mockBackgroundLibrary:BackgroundLibrary={
 async list(){return {origin:'example',instruments:mockInstruments,coming:comingInstruments};},
};
