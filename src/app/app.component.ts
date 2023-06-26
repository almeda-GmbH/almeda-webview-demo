import { Component } from '@angular/core';
import { FileDownloadService } from './services/file-download.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private fileDownloadService: FileDownloadService
  ) {

    /*
      Add the event listener to listen to "file_download" events to receive files from iFrame
    */
    window.addEventListener('message', (event: MessageEvent<FileDownloadMessageEvent>) => {
      console.log('Event data', JSON.stringify(event.data));
      if (event?.data?.type === 'file_download') {
        console.log('File recieved, attempting to downloading file');
        this.fileDownloadService.downloadFile(event?.data.fileData, event?.data.fileName);
      }
      if (event?.data?.type === 'closeIFrame') {
        console.log('Close Iframe');
      }
    });
  }

}

interface FileDownloadMessageEvent {
  type: 'file_download' | 'closeIFrame';
  fileData: string;
  fileName: string;
}
