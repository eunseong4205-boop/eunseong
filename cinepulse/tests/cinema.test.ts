import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mockBoxOffice} from '../lib/cinema/mock';
import {forecast} from '../lib/cinema/forecast';
import {loadBoxOffice,parseQuery} from '../lib/cinema/service';
import {kobisBoxOffice} from '../lib/cinema/kobis';
test('daily and weekly totals reconcile with their daily histories',()=>{for(const period of ['daily','weekly'] as const){const data=mockBoxOffice(period);assert.equal(data.movies.length,10);for(const m of data.movies){const days=m.history.slice(period==='daily'?-1:-7);assert.equal(m.audience,days.reduce((s,d)=>s+d.audience,0));assert.equal(m.revenue,days.reduce((s,d)=>s+d.revenue,0));assert.ok(m.rank>=1&&m.rank<=10)}}});
test('date selection changes historical data deterministically',()=>{const a=mockBoxOffice('daily','2026-09-01'),b=mockBoxOffice('daily','2026-09-02');assert.notEqual(a.movies[0].audience,b.movies[0].audience);assert.deepEqual(a.movies,mockBoxOffice('daily','2026-09-01').movies)});
test('horizons include exact future days with valid expanding bounds',()=>{const m=mockBoxOffice().movies[0];for(const h of [7,14,30] as const){const f=forecast(m,h,'audience')!;const future=f.points.filter(p=>p.actual===undefined);assert.equal(future.length,h);assert.equal(f.total,future.reduce((s,p)=>s+p.prediction!,0));assert.ok(f.lower<f.total&&f.total<f.upper);for(const p of future)assert.ok(p.band![0]<=p.prediction!&&p.prediction!<=p.band![1]);assert.ok(f.probability>=0&&f.probability<=100)}});
test('missing history does not invent forecasts',()=>{const m=mockBoxOffice().movies[0];assert.equal(forecast({...m,history:m.history.slice(-6)},7,'revenue'),null)});
test('invalid dates, unsupported periods, and future queries are rejected',()=>{for(const query of ['date=2026-02-30','date=garbage','period=monthly','source=untrusted','date=2099-01-01'])assert.throws(()=>parseQuery(`https://app.test/?${query}`))});
test('mock needs no credential and live mode fails clearly without one',async()=>{assert.equal((await loadBoxOffice('https://app.test/?source=mock')).source,'mock');await assert.rejects(loadBoxOffice('https://app.test/?source=kobis'),/API 키/)});
test('KOBIS adapter preserves separate sales change and omits reservation rate',async()=>{
 const original=globalThis.fetch;
 globalThis.fetch=async(input)=>{const url=String(input);return Response.json(url.includes('searchMovieInfo')?{movieInfoResult:{movieInfo:{movieNmEn:'TEST',genres:[{genreNm:'SF'}]}}}:{boxOfficeResult:{showRange:'20260912~20260912',dailyBoxOfficeList:[{movieCd:'12345678',movieNm:'테스트',openDt:'2026-09-01',rank:'1',audiCnt:'1500',salesAmt:'16500000',audiChange:'12.5',salesChange:'10.3',audiAcc:'15000'}]}})};
 try{const data=await kobisBoxOffice('daily','2026-09-12','test-key');assert.equal(data.movies[0].audience,1500);assert.equal(data.movies[0].revenueChange,10.3);assert.equal(data.movies[0].reservation,null);assert.equal(data.movies[0].genre,'SF')}finally{globalThis.fetch=original}
});
