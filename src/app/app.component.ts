import { Component } from '@angular/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
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
      console.log('Event data', event.data);
      if (event?.data?.type === 'file_download') {
        console.log('File recieved, attempting to downloading file');
        this.fileDownloadService.downloadFile(event?.data.fileData, event?.data.fileName);
      }
    });
  }

}

interface FileDownloadMessageEvent {
  type: 'file_download';
  fileData: string;
  fileName: string;
}
