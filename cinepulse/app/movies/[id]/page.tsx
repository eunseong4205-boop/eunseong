import {MovieDetail} from '@/components/cinema/detail';
export default async function MoviePage({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{source?:string;date?:string}>}){
 const {id}=await params,q=await searchParams;
 return <MovieDetail id={id} source={q.source==='kobis'?'kobis':'mock'} date={q.date}/>;
}
