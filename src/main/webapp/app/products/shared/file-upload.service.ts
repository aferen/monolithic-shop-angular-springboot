import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SERVER_API_URL } from '@app/app.constants';

@Injectable()
export class FileUploadService {

  // Progress monitoring
  public percentage$: Observable<number>;

  public snapshot: Observable<any>;

  // Download URL
  public downloadURL: Observable<string>;

  constructor(private http: HttpClient) {}

  public startUpload(files: Object, url) {
      const formData: FormData = new FormData();
      var resultArray = Object.keys(files).map(function(index){
        let item = files[index];
        return item;
      });
      resultArray.forEach((file) => {
        formData.append('file', file, file.name);   
      })
      return this.http.post(SERVER_API_URL+url, formData)
  }

  public deleteFile(files: string[], url: string) {
    if (files) {
      return files.map((fileName) => {
        this.http.delete(SERVER_API_URL+`${url}/${fileName}`).subscribe((s) => {
        });
      });
     
    }
  }
  // Determines if the upload task is active
  public isActive(snapshot) {
    return (
      snapshot.state === 'running' &&
      snapshot.bytesTransferred < snapshot.totalBytes
    );
  }
}
