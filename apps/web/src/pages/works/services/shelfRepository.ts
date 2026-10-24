// Repository port for 作品书架. The implementation is chosen in app/services.ts — today the mock in
// mocks/shelfRepository.ts (the in-memory shelf of this visit; a refresh empties it). Later: the child's works from the
// server, filtered by account and visibility on the server.
//
// Intended server endpoints (not implemented; the server owns auth and visibility):
//   GET /api/v1/works?owner=me        → SavedWork[] (validated with parseSavedWork)
//   GET /api/v1/works/{workId}        → SavedWork
//   PATCH /api/v1/works/{workId}      ← {title} → SavedWork
//   DELETE /api/v1/works/{workId}     → 204 (the server keeps nothing the child took off)
import type {SavedWork} from '@wanwu-v2/contracts/work';

/** The shelf, newest first. */
export type ShelfSnapshot=readonly SavedWork[];

export type ShelfRepository={
 list():ShelfSnapshot;
 subscribe(listener:()=>void):()=>void;
 /** Id of the piece being made now (null when none). */
 currentId():string|null;
 /** The current piece is the child's own, has sounds, and its current form is not on the shelf. */
 hasUnsavedCurrent():boolean;
 /** Make a shelved work the current piece (万物成曲 then opens it). */
 open(work:SavedWork):void;
 /** Take a work off the shelf. */
 remove(id:string):boolean;
 /** Give a work a new name; null when the name is empty. */
 rename(id:string,title:string):SavedWork|null;
};
