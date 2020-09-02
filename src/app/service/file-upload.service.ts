import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {FileSelectDirective, FileUploader} from 'ng2-file-upload';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  baseUrl: string = "http://localhost:3000";
  constructor(private http: HttpClient) { 
  }

  postFile(fileToUpload): Observable<any> {
    const formData = new FormData();
    formData.set('myfile', fileToUpload, fileToUpload.name);
    return this.http.post(this.baseUrl+'/api/upload', formData);
  }
  getFile(imgname: string): Observable<any>{
    return this.http.post(this.baseUrl+'/api/getFile', {imgname}, {
        responseType: 'blob'
    });
  }
}
