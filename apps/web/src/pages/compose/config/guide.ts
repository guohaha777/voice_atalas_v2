// 万物成曲 is led by the squirrel — it gathers what the forest made, the way the score gathers every sound.
// Reuses the home derivative (already cached). Lines are hand-written guidance, not generated.
import type {BackgroundUnavailable} from '@wanwu-v2/contracts/background';
import {homeLayer} from '../../../shared/scene/homeScene';

export const composeGuide={label:'小松鼠向导',variants:homeLayer('squirrel').variants};

export const guideLines={
 loading:'等我一下，曲谱马上就好～',
 example:'这是示例摆放的曲谱，先听听；回声场自己摆一首，再来保存吧。',
 empty:'声场里还没有声音，回声场摆几个吧。',
 idle:'点「播放」，看竖线走到哪个声音，它就会亮起来～',
 playing:'听，竖线走到哪里，哪个声音就在唱～',
 paused:'停在这里啦，再点「播放」接着听。',
 ended:'听完啦！可以换个长度、开关背景再听一遍。',
 span:(seconds:number)=>`变成 ${seconds} 秒啦，声音的先后都没变。`,
 spanBlocked:(name:string,seconds:number,span:number)=>`「${name}」要响 ${seconds} 秒，至少要 ${span} 秒才放得下。`,
 inspiration:'借来了课本的节奏，只给背景用，你的声音一点没变。',
 // The background card holds only controls: the squirrel says what was chosen.
 backgroundOn:(what:string)=>`背景开啦：${what}。`,
 backgroundOff:'背景关啦，现在只听自己的声音。',
 instruments:(who:string)=>`${who}。示例乐器是网页里合成的，再点一下就取消。`,
 instrumentsNone:'不选乐器，背景用原始的柔和声音。',
 instrumentsComing:(names:string)=>`${names}还在准备，暂未开放。`,
 // The AI chip. AI only offers a background; the child decides, and the local one is always one tap away.
 aiClosed:'AI 背景还没开放。开放后会先放本地背景，AI 做好了再问你要不要换上。',
 aiWorking:'AI 正在做背景，先听本地的；做好了我告诉你。',
 aiOn:(source:string)=>`换上了「${source}」的背景，不喜欢再点一下就换回本地。`,
 aiOff:'换回本地生成的背景啦。',
 aiReady:(source:string)=>`「${source}」的背景做好了，点「AI」换上听听？`,
 aiUnavailable:{
  'not-open':'AI 背景还没开放，先用本地背景。',
  offline:'现在没联网，先用本地背景。',
  quota:'今天的 AI 背景次数用完了，先用本地背景。',
  timeout:'AI 背景太慢了，先用本地背景。',
  failed:'AI 背景没做好，先用本地背景。',
 } satisfies Record<BackgroundUnavailable,string>,
 saved:'放进作品书架啦！只在这次打开期间保留，刷新就没了。',
};
