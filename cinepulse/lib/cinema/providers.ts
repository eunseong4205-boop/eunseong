import {forecast} from './forecast';
import type {Horizon,Metric,Movie} from './types';
// Replace this contract with a server-side trained forecasting service. No client API secrets.
export interface ForecastProvider {name:string;calibrated:boolean;predict(movie:Movie,horizon:Horizon,metric:Metric):Promise<ReturnType<typeof forecast>>}
export const demoForecastProvider:ForecastProvider={name:'trend-baseline-demo-v1',calibrated:false,async predict(movie,horizon,metric){return forecast(movie,horizon,metric)}};
