import type {MoodId} from '@wanwu-v2/contracts/arrangement';
import type {Density,Level,Metre,TextbookTrack} from '@wanwu-v2/contracts/textbook';
import type {Inspiration} from '@wanwu-v2/contracts/work';
import type {MatchField} from '@wanwu-v2/sound-rules/textbook-match';
import {moodLabels} from '../creation/moodCopy';

const minutes=(ms:number)=>{const s=Math.round(ms/1000);return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;};
export const metreNames:Record<Metre,string>={2:'二拍子',3:'三拍子',4:'四拍子'};

/** Why a song is like the child's arrangement, in a child's words (the song's value for the field that matched). */
const reasons={
 density:{sparse:'都是稀稀的，留了很多空',medium:'疏密都差不多',busy:'都很热闹，一个接一个'} satisfies Record<Density,string>,
 repetition:{low:'都很少重复',medium:'都有一些重复',high:'都喜欢重复'} satisfies Record<Level,string>,
 register:{low:'都在低低的地方',medium:'都在不高不低的地方',high:'都在高高的地方'} satisfies Record<Level,string>,
};

export const inspirationCopy={
 title:'课本灵感',
 description:'选一首课本歌曲，或上传老师的教学音乐。它只给背景带来节奏和气质，不改你的声音和摆放，也不照搬旋律。',
 tabs:{match:'帮我找找',examples:'课本歌曲',upload:'教学音乐'},
 example:'示例',
 catalogueNote:'课本曲库还没有接入，下面是示例歌曲的特点。',
 matchNote:'按你摆的声音找最像的三首：比疏密、重复、高低和心情，在这台设备上算，不用联网。',
 matchEmpty:'先在声场里摆几个声音，再来找找最像哪首歌。',
 use:'用这个',using:'正在用',none:'先不用',done:'好了',
 listen:'听一听',stopListen:'停止',
 /** The second line of a song: its beat and what it is like. */
 feel:(track:TextbookTrack)=>`${metreNames[track.meter]} · ${track.childLine}`,
 reason:(field:MatchField,value:string)=>field==='mood'?`心情都有点「${moodLabels[value as MoodId]}」`:reasons[field][value as never],
 upload:{
  pick:'选一段教学音乐',repick:'换一段',
  hint:'建议由老师选：课本配套音乐或课堂上唱的歌，音频文件，最长 10 分钟。',
  picked:(ms:number)=>`时长 ${minutes(ms)}`,
  listen:'试听',stop:'停',
  local:'只在这台设备上，还没有上传。',
  flowTitle:'接上后台以后会这样：',
  flow:['上传到后台（老师账号，确认可以使用）','后台分析它的速度、拍子、调式和情绪','结合孩子摆放的声音，生成一段对应的背景'],
  off:'上传和分析还没有开放；现在背景先跟着心情生成。',
  errors:{'not-audio':'这不是音频文件，换一个试试。','too-large':'文件太大了（最大 30MB）。','too-long':'音乐太长了，最长 10 分钟。','unreadable':'这段音频读不出来，换一个试试。'},
 },
 /** One line describing the current choice, for the cards that open the dialog. */
 summary:(value:Inspiration,entries:readonly TextbookTrack[])=>{
  if(value.kind==='textbook'){const entry=entries.find(item=>item.id===value.entryId);return entry?`借了「${entry.title}」的节奏`:'课本节奏';}
  if(value.kind==='teaching-music')return `教学音乐「${value.name}」`;
  return '先不用';
 },
} as const;
