import type {BoxOffice,Day,Movie,Period} from './types';
import {shiftDate} from './mock';
type Row=Record<string,string>;
type Payload={faultInfo?:unknown;boxOfficeResult?:{showRange:string;dailyBoxOfficeList?:Row[];weeklyBoxOfficeList?:Row[]};movieInfoResult?:{movieInfo:{movieNmEn?:string;genres?:{genreNm:string}[]}}};
const cache=new Map<string,{expires:number;value:Payload}>();
const pending=new Map<string,Promise<Payload>>();
export class DataError extends Error { constructor(message:string,public status=502){super(message)} }
async function requestKobis(path:string,params:Record<string,string>,key:string):Promise<Payload>{
 const identity=path+JSON.stringify(params),cached=cache.get(identity);
 if(cached&&cached.expires>Date.now())return cached.value;
 if(pending.has(identity))return pending.get(identity)!;
 const task=(async()=>{
  const url=new URL(`https://www.kobis.or.kr/kobisopenapi/webservice/rest/${path}.json`);
  url.search=new URLSearchParams({...params,key}).toString();
  try{
   const res=await fetch(url,{signal:AbortSignal.timeout(12000)});
   if(!res.ok)throw new DataError('KOBIS 응답이 지연되고 있습니다. 잠시 후 다시 시도하세요.');
   const value=await res.json() as Payload;
   if(value.faultInfo)throw new DataError('KOBIS API 키 또는 호출 한도를 확인하세요.');
   if(cache.size>=128)cache.delete(cache.keys().next().value!);
   cache.set(identity,{expires:Date.now()+300000,value});return value;
  }catch(e){if(e instanceof DataError)throw e;throw new DataError('KOBIS에 연결할 수 없습니다. 잠시 후 다시 시도하세요.');}
 })();pending.set(identity,task);
 try{return await task}finally{pending.delete(identity)}
}
async function mapLimit<T,R>(items:T[],fn:(v:T)=>Promise<R>):Promise<R[]>{
 const result:R[]=[];let next=0;
 await Promise.all(Array.from({length:Math.min(3,items.length)},async()=>{while(next<items.length){const index=next++;result[index]=await fn(items[index])}}));
 return result;
}
async function box(period:Period,date:string,key:string){
 const p=await requestKobis(`boxoffice/search${period==='daily'?'Daily':'Weekly'}BoxOfficeList`,{targetDt:date.replaceAll('-',''),itemPerPage:'10',...(period==='weekly'?{weekGb:'0'}:{})},key);
 if(!p.boxOfficeResult)throw new DataError('KOBIS 응답 형식을 확인할 수 없습니다.');
 return {rows:(period==='daily'?p.boxOfficeResult.dailyBoxOfficeList:p.boxOfficeResult.weeklyBoxOfficeList)||[],range:p.boxOfficeResult.showRange};
}
const number=(value:string|undefined)=>{const n=Number(value);return Number.isFinite(n)?n:0};
export async function kobisBoxOffice(period:Period,date:string,key:string|undefined,history=false):Promise<BoxOffice>{
 if(!key)throw new DataError('KOBIS API 키가 설정되지 않았습니다. 샘플 데이터로 둘러보거나 서버에 KOBIS_API_KEY를 설정하세요.',503);
 const b=await box(period,date,key);
 const movies:Movie[]=await mapLimit(b.rows,async(row)=>{
  const detail=await requestKobis('movie/searchMovieInfo',{movieCd:row.movieCd},key);
  const m=detail.movieInfoResult?.movieInfo;
  return {id:row.movieCd,title:row.movieNm,english:m?.movieNmEn||'KOREAN BOX OFFICE',genre:m?.genres?.[0]?.genreNm||'미분류',released:row.openDt||'',color:'#a396ee',audience:number(row.audiCnt),revenue:number(row.salesAmt),audienceChange:number(row.audiChange),revenueChange:number(row.salesChange),cumulative:number(row.audiAcc),reservation:null,rank:number(row.rank),history:[]};
 });
 if(history&&movies.length){
  const snapshots=await mapLimit(Array.from({length:14},(_,i)=>shiftDate(date,i-13)),async d=>({date:d,rows:(await box('daily',d,key)).rows}));
  for(const m of movies){
   // A TOP10 absence is unknown, never a zero audience. Only use a contiguous trailing history.
   const days:Day[]=[];
   for(const snapshot of snapshots){const row=snapshot.rows.find(r=>r.movieCd===m.id);if(!row){days.length=0;continue;}days.push({date:snapshot.date,audience:number(row.audiCnt),revenue:number(row.salesAmt)});}
   m.history=days;
  }
 }
 return {movies,source:'kobis',period,date,range:b.range,updatedAt:new Date().toISOString(),note:'KOBIS 전일·주간 집계 · 증감률은 API 제공 값 · 예매율 미제공 · 실적은 마감 후 정정될 수 있습니다.'};
}
