export type Period = 'daily' | 'weekly';
export type Horizon = 7 | 14 | 30;
export type Metric = 'audience' | 'revenue';
export interface Day { date: string; audience: number; revenue: number }
export interface Movie {
 id:string;title:string;english:string;genre:string;released:string;color:string;
 audience:number;revenue:number;audienceChange:number;revenueChange:number;
 cumulative:number;reservation:number|null;rank:number;history:Day[];
}
export interface BoxOffice {
 movies:Movie[];source:'mock'|'kobis';period:Period;date:string;range:string;updatedAt:string;note:string;
}
export interface ForecastPoint {date:string;actual?:number;prediction?:number;band?:[number,number]}
