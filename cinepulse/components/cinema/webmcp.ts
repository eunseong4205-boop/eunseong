'use client';
import {useEffect} from 'react';
import {flushSync} from 'react-dom';
type Filters={search:string;genre:string;horizon:7|14|30};
type Context={registerTool:(tool:{name:string;description:string;inputSchema:object;annotations:object;execute:(input:unknown)=>unknown},options:{signal:AbortSignal})=>void|Promise<void>};
export function useDashboardTool(genres:string[],apply:(filters:Filters)=>void){
 useEffect(()=>{
  const context=(document as Document&{modelContext?:Context}).modelContext;
  if(!context?.registerTool)return;
  const lifecycle=new AbortController();
  const tool={name:'configure_movie_dashboard',description:'영화 대시보드의 검색어, 장르, 예측 기간을 변경합니다. 외부 데이터는 수정하지 않습니다.',inputSchema:{type:'object',properties:{search:{type:'string',maxLength:100},genre:{type:'string',enum:['all',...genres]},horizon:{type:'number',enum:[7,14,30]}},required:['search','genre','horizon'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input:unknown){
   if(!input||typeof input!=='object')throw new Error('필터 객체가 필요합니다.');
   const v=input as Record<string,unknown>;
   if(Object.keys(v).some(k=>!['search','genre','horizon'].includes(k))||typeof v.search!=='string'||v.search.length>100||typeof v.genre!=='string'||!['all',...genres].includes(v.genre)||![7,14,30].includes(Number(v.horizon))||typeof v.horizon!=='number')throw new Error('유효하지 않은 필터입니다.');
   const filters=v as Filters;flushSync(()=>apply(filters));return {applied:true,...filters};
  }};
  try{void Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{})}catch{}
  return()=>lifecycle.abort();
 },[genres,apply]);
}
