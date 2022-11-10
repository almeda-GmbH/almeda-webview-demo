# almeda webview demo with ionic

Integration of the Almeda joinLink with angular and ionic (capacitor). 

1. Use the appointment URL as the `src` of `iFrame`
    ```
    <iframe [src]="getUrl()" frameborder="0" style="width:100%;height:100%" scrolling="yes" allow="camera *;microphone *;"></iframe>
    ```

    Join link should be santized before using on iFrame
    ```
    getUrl() {
        return this.sanitizer.bypassSecurityTrustResourceUrl('https://demo.almeda.de/joinlink');
    }
    ```
    
    > `camera` and `microhphone` should be allowed on the `iFrame`

    > If appointment webiew is reloading, disable the change the detection in the component where `iFrame` is used.

2. Handle file downloads from `iFrame`
    Mobile devices cannot download files from `iFrame`. In this case, it will send a `message` to the parent window when an event is triggered. With file name and file data in `base64` format. Mobile devices can use this method for saving or opening files. 
    Following example shows how to handle and save to device storage system.
    ```
    // interface of file event on message
    interface FileDownloadMessageEvent {
      type: 'file_download';
      fileData: string;
      fileName: string;
    }
    
    // add listener to listen for `file_download` message from child window
    window.addEventListener('message', (event: MessageEvent<FileDownloadMessageEvent>) => {
      if (event?.data?.type === 'file_download') {
        console.log('File recieved, attempting to downloading file');
        this.downloadFile(event?.data.fileData, event?.data.fileName);
      }
    });
    
    // download and save file storage
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
    ```


3. To enable the webview's UI and features, append useragent with `almeda/webview`
    In `capacitor.config.json` append the value for both iOS and Android
    ```
    {
    	...
    	"appendUserAgent": "almeda/webview",
    	...
    }
    ```

4. Add permissions to allow camera, microphone, storage for Android to `AndroidManifest.xml`
    ```
    <?xml version="1.0" encoding="utf-8"?>
    <manifest xmlns:android="http://schemas.android.com/apk/res/android"
        package="io.ionic.starter">
        
        ...
    
        <!-- Permissions -->
        <uses-permission android:name="android.permission.INTERNET" />
        <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
        <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
        <uses-permission android:name="android.permission.RECORD_AUDIO" />
        <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
        <uses-permission android:name="android.permission.CAMERA" />
    
        ...
    </manifest>
    ```

5. Add permissions to allow camera, microphone, storage for iOS to `info.pilst`
    ```
    ...
    <key>NSMicrophoneUsageDescription</key>
    <string>If you want to use the microphone, you have to give permission.</string>
    <key>NSCameraUsageDescription</key>
    <string>If you want to use the camera, you have to give permission.</string>
    ...
    ```
