import { Injectable } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';

@Injectable({ providedIn: 'root' })
export class FileDownloadService {
    constructor() { }

    /*
     * Download file to device storage or open to display the content of the file
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

        console.log('file saved', Directory.Documents, fileSaved);
    }
}
