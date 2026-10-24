import {useCallback,useEffect,useMemo,useReducer,useRef,useState} from 'react';
import type {SpanSeconds} from '@wanwu-v2/contracts/arrangement';
import type {Inspiration} from '@wanwu-v2/contracts/work';
import type {TextbookTrack} from '@wanwu-v2/contracts/textbook';
import {spanHolds} from '../../../shared/creation/arrangementTiming';
import {mockInspirationCatalog} from '../../../shared/inspiration/catalog';
import type {InspirationCatalog} from '../../../shared/inspiration/catalog';
import {inspirationMatches} from '../../../shared/inspiration/matches';
import type {Instrument} from '../../../shared/background/instruments';
import {mockBackgroundLibrary} from '../../../shared/background/library';
import type {BackgroundLibrary} from '../../../shared/background/library';
import {useBackgroundLayer} from '../../../shared/background/useBackgroundLayer';
import {mockComposeRepository} from '../services/composeRepository';
import type {ComposeRepository} from '../services/composeRepository';
import {composeReducer,initialCompose,isShelved,shelfEntry} from './composeState';
import type {ComposeNoticeKey} from './composeState';
import {findDiscoveries} from './discoveries';
import {scoreLayout} from './scoreLayout';
import {usePiecePlayback} from './usePiecePlayback';

/** 万物成曲: listen to the work as a piece, set its length, inspiration and background, then put it on the shelf.
 *  The playback clock lives in usePiecePlayback and the background layer (shared with 万物声场) in useBackgroundLayer. */
export function useCompose(repository:ComposeRepository=mockComposeRepository,backgrounds:BackgroundLibrary=mockBackgroundLibrary,inspirations:InspirationCatalog=mockInspirationCatalog){
 const [state,dispatch]=useReducer(composeReducer,initialCompose);
 const [shelfCount,setShelfCount]=useState(0);
 const [instruments,setInstruments]=useState<readonly Instrument[]>([]);
 const [comingInstruments,setComing]=useState<readonly string[]>([]);
 const [entries,setEntries]=useState<readonly TextbookTrack[]>([]);
 const latest=useRef(state);latest.current=state;
 const notify=useCallback((key:ComposeNoticeKey,tone:'info'|'error'='error')=>dispatch({type:'notice',notice:{tone,key}}),[]);

 useEffect(()=>{
  let live=true;
  void Promise.all([repository.load(),backgrounds.list(),inspirations.list()]).then(([current,library,catalogue])=>{
   if(!live)return;
   setInstruments(library.instruments);setComing(library.coming);setEntries(catalogue.entries);setShelfCount(current.shelfCount);
   dispatch({type:'loaded',arrangement:current.arrangement,settings:current.settings,shelved:current.shelved});
  });
  return()=>{live=false;};
 },[repository,backgrounds,inspirations]);

 // Length changes go back to the same work 万物声场 edits; an untouched example is not stored.
 useEffect(()=>{
  const arrangement=state.arrangement;
  if(arrangement?.origin==='child')void repository.saveArrangement(arrangement);
 },[state.arrangement,repository]);
 useEffect(()=>{if(latest.current.arrangement)void repository.saveSettings(state.settings);},[state.settings,repository]);

 // ----- derived: score, background, discoveries -----
 const layout=useMemo(()=>state.arrangement?scoreLayout(state.arrangement):null,[state.arrangement]);
 const music=useBackgroundLayer(state.settings,instruments,entries);
 /** 帮我找找: the textbook songs most like this arrangement (local rules). */
 const matches=useMemo(()=>inspirationMatches(state.arrangement,entries),[state.arrangement,entries]);
 /** What the background is made of right now (mood colour, borrowed rhythm), for the card. */
 const backgroundPlan=useMemo(()=>state.arrangement?music.plan(state.arrangement):null,
 // The plan only changes with the arrangement and what the background borrows.
 [state.arrangement,music.key]);
 const discoveries=useMemo(()=>state.arrangement?findDiscoveries(state.arrangement):[],[state.arrangement]);
 const playback=usePiecePlayback(latest,notify,music,layout);

 // ----- settings -----
 /** A new length restarts the piece; a length too short for the longest sound is only explained (playback goes on). */
 const setSpan=(spanSeconds:SpanSeconds)=>{
  const work=latest.current.arrangement;
  if(work&&spanHolds(work,spanSeconds))playback.reset();
  dispatch({type:'span',spanSeconds,now:new Date()});
 };
 const setInspiration=(next:Inspiration)=>dispatch({type:'inspiration',inspiration:next});

 // ----- shelf and sharing -----
 /** Whether this piece can go on the shelf; says why not (empty, or the untouched example). */
 const canSave=()=>{
  const arrangement=latest.current.arrangement;
  if(!arrangement?.events.length){notify('need-event','info');return false;}
  if(arrangement.origin==='example'){notify('example-save','info');return false;}
  return true;
 };
 const saveWork=async(title:string)=>{
  const current=latest.current;
  if(!canSave())return false;
  const work=shelfEntry(current,title,new Date());
  if(!work)return false;
  const result=await repository.saveWork(work);
  if(result.status==='failed'){notify('save-failed');return false;}
  if(!current.shelved)setShelfCount(count=>count+1);
  dispatch({type:'saved',work});
  return true;
 };
 const share=async()=>{const result=await repository.share(latest.current.arrangement?.id??'');if(result.status==='unavailable')notify('share-off','info');};
 const startNew=async()=>{playback.pause();await repository.startNew();};

 return {
  state,layout,discoveries,instruments,comingInstruments,chosen:music.chosen,parts:music.parts,entries,entry:music.track,matches,backgroundPlan,
  playing:playback.playing,preparing:playback.preparing,ended:playback.ended,
  /** The one playback time (seconds) the playhead, progress bar and highlights read. */
  now:playback.now,total:playback.total,sounding:playback.sounding,
  shelved:isShelved(state),shelfCount,
  togglePlay:playback.togglePlay,restart:playback.restart,playFrom:playback.playFrom,scrubTo:playback.scrubTo,endScrub:playback.endScrub,
  setSpan,setInspiration,
  setBackgroundEnabled:(enabled:boolean)=>dispatch({type:'background-enabled',enabled}),
  setBackgroundVolume:(volume:number)=>dispatch({type:'background-volume',volume}),
  toggleInstrument:(id:string)=>dispatch({type:'instrument',id}),
  canSave,saveWork,share,startNew,
  clearNotice:()=>dispatch({type:'notice',notice:null}),
 };
}
export type Compose=ReturnType<typeof useCompose>;
