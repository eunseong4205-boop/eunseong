import type { ForecastPoint,Horizon,Metric,Movie } from './types';
import {shiftDate} from './mock';
// Deterministic baseline for the demo; not a trained or calibrated AI model.
export function forecast(movie:Movie,horizon:Horizon,metric:Metric) {
 const history=movie.history,last=history.at(-1);
 if(!last||history.length<7)return null;
 const recent=history.slice(-7).reduce((s,d)=>s+d[metric],0)/7;
 const priorDays=history.slice(-14,-7);
 const prior=priorDays.length?priorDays.reduce((s,d)=>s+d[metric],0)/priorDays.length:recent;
 const slope=Math.max(-.035,Math.min(.025,Math.log(recent/Math.max(1,prior))/7));
 const points:ForecastPoint[]=history.slice(-14).map(d=>({date:d.date,actual:d[metric]}));
 points[points.length-1]={...points.at(-1)!,prediction:last[metric],band:[last[metric],last[metric]]};
 let total=0,lower=0,upper=0;
 for(let day=1;day<=horizon;day++){
  const date=shiftDate(last.date,day),weekend=[0,6].includes(new Date(date).getUTCDay())?1.18:.93;
  const prediction=Math.round(recent*Math.exp(slope*day)*weekend),width=.15+Math.sqrt(day)*.065;
  const band:[number,number]=[Math.round(prediction*(1-width)),Math.round(prediction*(1+width))];
  total+=prediction;lower+=band[0];upper+=band[1];points.push({date,prediction,band});
 }
 const threshold=1000000;
 const audienceTotal=metric==='audience'?total:total/(last.revenue/Math.max(1,last.audience));
 const probability=Math.round(100/(1+Math.exp(-((audienceTotal-threshold)/threshold)*1.8)));
 return {points,total,lower,upper,probability,threshold};
}
export const compact=(v:number)=>v>=100000000?`${(v/100000000).toFixed(1)}억`:v>=10000?`${(v/10000).toFixed(1)}만`:v.toLocaleString('ko-KR');
