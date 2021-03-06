import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpEventType, HttpClient } from "@angular/common/http";
import { FileService } from '../_service/file.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  public progress: number;
  public message: string;
  @Output() public onUploadFinished = new EventEmitter();

  constructor(private fileService: FileService) { }

  ngOnInit(): void {
  }

  public uploadFile = (files) => {
    if (files.length == 0) {
      return;
    }


    /* single upload
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    */

    /* multiple upload */
    let filesToUpload: File[] = files;
    const formData = new FormData();

    Array.from(filesToUpload).map((file, index) => {
      return formData.append("file" + index, file, file.name)
    });

    this.fileService.upload(formData)
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total)
        } else if (event.type === HttpEventType.Response) {
          this.message = "Upload success"
          this.onUploadFinished.emit(event.body)
        }
      });
  }

}
