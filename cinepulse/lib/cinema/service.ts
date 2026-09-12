import {DEMO_DATE,mockBoxOffice,shiftDate} from './mock';
import {DataError,kobisBoxOffice} from './kobis';
import type {Period} from './types';
export function yesterdayKst(){return shiftDate(new Date(Date.now()+9*3600000).toISOString().slice(0,10),-1)}
export function parseQuery(url:string){
 const q=new URL(url).searchParams,period=q.get('period')||'daily',source=q.get('source')||'mock',date=q.get('date')||(source==='mock'?DEMO_DATE:yesterdayKst());
 if(!['daily','weekly'].includes(period)||!['mock','kobis'].includes(source)||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date||date<'2026-01-01'||date>(source==='mock'?DEMO_DATE:yesterdayKst()))throw new DataError('조회 가능한 올바른 날짜와 집계 조건을 선택하세요.',400);
 return {period:period as Period,source:source as 'mock'|'kobis',date,history:q.get('history')==='true'};
}
export async function loadBoxOffice(url:string,key?:string){const q=parseQuery(url);return q.source==='mock'?mockBoxOffice(q.period,q.date):kobisBoxOffice(q.period,q.date,key,q.history)}
