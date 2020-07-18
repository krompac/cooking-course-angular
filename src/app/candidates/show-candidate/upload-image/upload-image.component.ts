import {Component, OnInit, Output} from '@angular/core';
import {Subject} from "rxjs";

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})
export class UploadImageComponent implements OnInit {
  @Output() imageUploaded = new Subject<string>();
  localUrl: string;

  constructor() { }

  ngOnInit() {
  }

  imageSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      reader.onload = this.setImageUrl.bind(this);

      reader.readAsBinaryString(event.target.files[0]);
    }
  }

  setImageUrl(e) {
    this.localUrl = btoa(e.target.result);
  }

  onSubmit() {
    this.imageUploaded.next(this.localUrl);
  }

  onCancel() {
    this.imageUploaded.next(null);
  }
}
