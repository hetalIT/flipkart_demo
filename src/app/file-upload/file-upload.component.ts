import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { FileUploadService } from '../service/file-upload.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  fileToUpload: File = null;
  uploadedImageList: any=[];
  imgname: any = '../../assets/img/washing_machine.png';
  // baseUrl: string = "http://localhost:3000";
  // uploader: FileUploader=new FileUploader({url:'/api/upload', disableMultipart:false});
  // attachmentList:any=[];
  constructor(private fileUploadService: FileUploadService, private sanitizer: DomSanitizer,
    private renderer: Renderer2, private elementRef: ElementRef) { 
    // this.uploader.onCompleteItem=(item:any, response:any, status: any, headers: any)=>{
    //   this.attachmentList.push(JSON.parse(response));
    //   console.log(this.attachmentList);
    // };
  }

  ngOnInit() {
  }
  // onFileChange(){
  //   for(let item of this.uploader.queue){
  //     this.uploader.uploadItem(item);
  //   }
  // }
  onFileChange(files: FileList){
    const child= this.elementRef.nativeElement.querySelector("#imgResult").children;
    for(let c of child){
      this.renderer.removeChild(this.elementRef.nativeElement.querySelector("#imgResult"),c);
    }
    for(let i=0; i<files.length;i++){
      this.fileUploadService.postFile(files[i]).subscribe((data: any) => {
        // console.log(data);
        // this.uploadedImageList.push(data);
        // this.imgname= "../../../nodejs_backend/server/upload/"+this.uploadedImageList[0].uploadname;
        // console.log(this.uploadedImageList);
        if(data.uploadname)
          this.displayUploadedImage(data.uploadname);
        }, error => {
          console.log(error);
        });
    }
  }
  displayUploadedImage(imgname){
    
    this.fileUploadService.getFile(imgname).subscribe((res:any)=>{
      
      this.imgname= URL.createObjectURL(res);
      var img=this.renderer.createElement('img');
      this.renderer.setAttribute(img,'src',this.imgname);
      this.renderer.appendChild(this.elementRef.nativeElement.querySelector("#imgResult"),img
      );
      // this.renderer.setAttribute(this.elementRef.nativeElement.querySelector("#myimg"),'src',this.imgname);
      // document.getElementById('myimg').setAttribute('src', this.imgname);
      
      //==========================this is another way of doing the same thing as above==========//
      // var base64data;
      // var reader = new FileReader();
      // reader.readAsDataURL(res); 
      // reader.onloadend = function() {
      //   base64data = reader.result;   
      //   document.getElementById('myimg').setAttribute('src', base64data);
      // }
      //this.imgname=this.sanitizer.bypassSecurityTrustUrl(base64data);
    },err=>{
      console.log(err);
    });
  }
}
