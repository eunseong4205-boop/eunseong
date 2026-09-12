import {Skeleton} from '@/components/ui/skeleton';
export default function Loading(){return <main className="dashboard" aria-label="화면 불러오는 중"><Skeleton className="h-10 w-64 mb-10"/><div className="kpi-grid">{[1,2,3,4].map(i=><Skeleton key={i} className="h-36"/>)}</div><Skeleton className="h-96"/></main>}
