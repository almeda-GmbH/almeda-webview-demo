import { Component } from '@angular/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {

    window.addEventListener('message', (event: MessageEvent<FileDownloadMessageEvent>) => {
      console.log('Event data', event.data);
      if (event?.data?.type === 'file_download') {
        console.log('Downloading file');
        this.downloadFile(event?.data.fileData, event?.data.fileName);
      }
    });
  }

  async downloadFile(data: string, name: string) {
    console.log('Permission for files', await Filesystem.checkPermissions());
    const permission = await Filesystem.requestPermissions();
    if (permission.publicStorage === 'denied') {
      console.error('Permission denied to save file');
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
