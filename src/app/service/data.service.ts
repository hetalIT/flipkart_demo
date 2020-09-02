import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DataService{
    constructor(private http: HttpClient){}
    private subsubcatId: string;
    set_subsubcatId(id: string){
        this.subsubcatId= id;
    }
    get_subsubcatId(){
        return this.subsubcatId;
    }
}