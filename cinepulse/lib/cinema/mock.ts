import type { BoxOffice, Movie, Period } from './types';
export const DEMO_DATE='2026-09-12';
export const shiftDate=(date:string,days:number)=>new Date(Date.parse(date+'T00:00:00Z')+days*86400000).toISOString().slice(0,10);
const seeds:[string,string,string,string,string,number,number,number][]=[
 ['인터스텔라','INTERSTELLAR','SF','2014-11-06','#a396ee',184520,18.6,29.4],
 ['듄: 파트 2','DUNE · PART TWO','SF','2024-02-28','#c5a679',142380,12.4,23.1],
 ['파묘','EXHUMA','미스터리','2024-02-22','#73a598',98650,-4.2,12.8],
 ['인사이드 아웃 2','INSIDE OUT 2','애니메이션','2024-06-12','#e2b66f',87240,8.7,10.5],
 ['범죄도시 4','THE ROUNDUP 4','액션','2024-04-24','#7fa4b8',67430,-8.3,7.2],
 ['괴물','MONSTER','드라마','2023-11-29','#90b38e',42810,34.8,5.6],
 ['웡카','WONKA','판타지','2024-01-31','#b982af',35820,6.1,4.2],
 ['서울의 봄','12.12: THE DAY','드라마','2023-11-22','#aa9480',28490,-12.5,3.1],
 ['스파이더맨: 어크로스 더 유니버스','ACROSS THE SPIDER-VERSE','애니메이션','2023-06-21','#d27c8b',21460,24.3,2.5],
 ['퍼펙트 데이즈','PERFECT DAYS','드라마','2024-07-03','#77a9bb',16720,42.6,1.6],
];
export function mockBoxOffice(period:Period='daily',date=DEMO_DATE):BoxOffice {
 const offset=Math.round((Date.parse(date)-Date.parse(DEMO_DATE))/86400000);
 const movies:Movie[]=seeds.map(([title,english,genre,released,color,base,change,reservation],i)=>{
  const history=Array.from({length:35},(_,n)=>{
   const d=shiftDate(date,n-34),age=n-34+offset;
   const weekend=[0,6].includes(new Date(d).getUTCDay())?1.2:.88;
   const audience=Math.max(100,Math.round(base*Math.exp(age*(change/1200))*weekend*(1+Math.sin((n+offset+i)*1.7)*.06)));
   return {date:d,audience,revenue:audience*(10400+i*100)};
  });
  const span=period==='daily'?1:7;
  const sum=(a:number,b:number)=>history.slice(a,b).reduce((s,d)=>s+d.audience,0);
  const audience=sum(35-span,35),previous=sum(35-span*2,35-span),delta=(audience/previous-1)*100;
  return {id:`demo-${i+1}`,title,english,genre,released,color,audience,revenue:audience*(10400+i*100),audienceChange:delta,revenueChange:delta,cumulative:sum(0,35)+base*18,reservation,rank:0,history};
 }).sort((a,b)=>b.audience-a.audience).map((m,i)=>({...m,rank:i+1}));
 return {movies,source:'mock',period,date,range:period==='daily'?date:`${shiftDate(date,-6)} ~ ${date}`,updatedAt:new Date().toISOString(),note:'가상 재상영 시나리오 · 실적, 예매율, 예측값 모두 샘플입니다.'};
}
