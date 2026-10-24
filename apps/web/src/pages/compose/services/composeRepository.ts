// Repository port for 万物成曲. The page only talks to this interface; the implementation is chosen in app/services.ts
// (today the mock in mocks/composeRepository.ts: the in-memory work of this visit and the in-memory 作品书架). A server
// adapter implements the same interface later — the page won't change.
//
// Intended server endpoints (not implemented; listed so the adapter has a target, the server owns auth and visibility):
//   GET  /api/v1/works/current                         → {arrangement, settings} (validated with parseArrangement / parseComposeSettings)
//   PUT  /api/v1/works/{workId}/arrangement            ← Arrangement, If-Match: updatedAt (same endpoint 万物声场 uses)
//   PUT  /api/v1/works/{workId}/compose-settings       ← ComposeSettings
//   PUT  /api/v1/works/{workId}                        ← SavedWork → {status:'saved',version}  (needs an account)
//   POST /api/v1/works/{workId}/share                  ← {visibility} → share link after review (needs an account)
import type {Arrangement} from '@wanwu-v2/contracts/arrangement';
import type {ComposeSettings,SavedWork} from '@wanwu-v2/contracts/work';
import type {SaveResult} from '../../../shared/creation/workSession';

/** `shelved`: this work's version on the shelf, if any; `shelfCount`: how many works the shelf holds (for a default title). */
export type CurrentWork={arrangement:Arrangement;settings:ComposeSettings;shelved:SavedWork|null;shelfCount:number};
/** Sharing needs an account, a class space and review; none exist yet. */
export type ShareResult={status:'unavailable';reason:'needs-account'};

export type ComposeRepository={
 load():Promise<CurrentWork>;
 saveArrangement(arrangement:Arrangement):Promise<SaveResult>;
 saveSettings(settings:ComposeSettings):Promise<SaveResult>;
 /** Puts the work on the shelf. `session` = this visit only (not an account). */
 saveWork(work:SavedWork):Promise<SaveResult>;
 share(workId:string):Promise<ShareResult>;
 /** 再来一首: the next work starts empty; shelved works stay on the shelf. */
 startNew():Promise<void>;
};
