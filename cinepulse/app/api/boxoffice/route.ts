import {loadBoxOffice} from '@/lib/cinema/service';
import {DataError} from '@/lib/cinema/kobis';
export async function GET(request:Request){
 try{return Response.json(await loadBoxOffice(request.url,process.env.KOBIS_API_KEY),{headers:{'Cache-Control':'private, max-age=60'}})}
 catch(e){return Response.json({error:e instanceof DataError?e.message:'데이터를 불러오지 못했습니다.'},{status:e instanceof DataError?e.status:500})}
}
