import { Observable, of } from 'rxjs';

export class ApiCallMockService{
    constructor(){}
    getData(): Observable<{}[]>{
        return of([
           { "name": 'book',
            "price": '125'}
        ]);
    }

    /* getData(): Promise<any>{
        var promise= new Promise((resolve, reject)=>{
            setTimeout(() => {
                resolve([
                    { "name": 'book',
                     "price": '125'}
                 ]);
            }, 3000);
        });
        return promise;
        // var data=[];
        // setTimeout(() => {
            // data= [
            //     { "name": 'book',
            //      "price": '125'}
            //  ];
        //      return of(data);     
        // }, 3000);
        
    } */
}