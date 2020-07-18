import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

export enum Buttons {
  Close,
  YesNo
}

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  @Input() message: string;
  @Input() button: Buttons = Buttons.Close;
  @Output() handler = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  onClose() {
    this.handler.emit(false);
  }

  onConfirm() {
    this.handler.emit(true);
  }

  isCloseButton() {
    return this.button === Buttons.Close;
  }
}
