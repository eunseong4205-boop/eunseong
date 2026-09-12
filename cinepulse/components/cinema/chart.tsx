'use client';
import { Area,CartesianGrid,ComposedChart,Line,ResponsiveContainer,Tooltip,XAxis,YAxis,ReferenceLine } from 'recharts';
import type {ForecastPoint,Metric} from '@/lib/cinema/types';
import {compact} from '@/lib/cinema/forecast';
export function ForecastChart({points,metric='audience',cutoff}:{points:ForecastPoint[];metric?:Metric;cutoff:string}){
return <div className="chart" role="img" aria-label={`실적과 예측 ${metric==='audience'?'관객수':'매출'} 비교. 보라색 영역은 시뮬레이션 구간입니다.`}><ResponsiveContainer width="100%" height="100%"><ComposedChart data={points} margin={{top:20,right:12,left:0,bottom:8}}>
<defs><linearGradient id="predictionFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9c83ff" stopOpacity={.3}/><stop offset="100%" stopColor="#9c83ff" stopOpacity={.025}/></linearGradient></defs>
<CartesianGrid stroke="#28242e" vertical={false} strokeDasharray="3 5"/><XAxis dataKey="date" tickFormatter={v=>v.slice(5).replace('-','.')} minTickGap={38} axisLine={false} tickLine={false} tick={{fill:'#97899f',fontSize:12}} dy={12}/><YAxis tickFormatter={compact} axisLine={false} tickLine={false} tick={{fill:'#97899f',fontSize:12}} width={52}/>
<Tooltip contentStyle={{background:'#201b29',border:'1px solid #46374f',borderRadius:10,color:'#eee'}} formatter={(v,name)=>[Array.isArray(v)?`${compact(Number(v[0]))} ~ ${compact(Number(v[1]))}`:compact(Number(v))+(metric==='audience'?'명':'원'),name]}/>
<ReferenceLine x={cutoff} stroke="#796887" strokeDasharray="4 5"/><Area dataKey="band" name="시뮬레이션 구간" stroke="none" fill="url(#predictionFill)" isAnimationActive={false}/><Line type="monotone" dataKey="actual" name="실적" stroke="#d6d2e5" strokeWidth={2.5} dot={false} activeDot={{r:5}}/><Line type="monotone" dataKey="prediction" name="예측" stroke="#ac91ff" strokeWidth={2.7} dot={false} strokeDasharray="5 4" activeDot={{r:5}}/>
</ComposedChart></ResponsiveContainer></div>;
}
