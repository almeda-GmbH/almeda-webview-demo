import { Component } from '@angular/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {

    /*
      Add the event listener to listen to "file_download" events to receive files from iFrame
    */
    window.addEventListener('message', (event: MessageEvent<FileDownloadMessageEvent>) => {
      console.log('Event data', event.data);
      if (event?.data?.type === 'file_download') {
        console.log('File recieved, attempting to downloading file');
        this.downloadFile(event?.data.fileData, event?.data.fileName);
      }
    });
  }

  /*
    Download file to device storage or open to display the content of the file
  */
  async downloadFile(data: string, name: string) {
    console.log('Permission for files', await Filesystem.checkPermissions());
    const permission = await Filesystem.requestPermissions();
    if (permission.publicStorage === 'denied') {
      console.error('Permission denied to save file');
      return;
    }
    const fileSaved = await Filesystem.writeFile({
      path: name,
      data,
      directory: Directory.Documents,
    });

    console.log('file saved', fileSaved);
  }

}

interface FileDownloadMessageEvent {
  type: 'file_download';
  fileData: string;
  fileName: string;
}
