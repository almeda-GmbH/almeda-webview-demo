# almeda webview demo with ionic



Integration of the Almeda joinLink with angular and ionic (capacitor).

Demo of the integration using iFrame and in-app-browser can be found at https://github.com/almeda-GmbH/almeda-webview-demo

## Using iFrame

1. Use the appointment URL as the src of iFrame

   ```html
   <iframe [src]="getUrl()" frameborder="0" style="width:100%;height:100%" scrolling="yes" allow="camera *;microphone *;"></iframe>
   ```

   Join link should be santized before using on iFrame

   ```tsx
   getUrl() {
   	return this.sanitizer.bypassSecurityTrustResourceUrl('https://demo.almeda.de/joinlink');
   }
   ```

   *camera* *and* *microhphone* *should be allowed on the* *iFrame

   > If appointment webiew is reloading, disable the change the detection in the component where iFrame is used.

2. Handle file downloads from `iFrame` Mobile devices cannot download files from `iFrame` . In this case, it will send a `message` to the parent window when an event is triggered. With file name and file data in `base64` format. Mobile devices can use this method for saving or opening files. Following example shows how to handle and save to device storage system.

   ```tsx
   // interface of file event on message
   interface FileDownloadMessageEvent {
      type: 'file_download';
      fileData: string;
      fileName: string;
   }
   
   // add listener to listen for `file_download` message from child window
   window.addEventListener('message', (event:
   MessageEvent<FileDownloadMessageEvent>) => {
      if (event?.data?.type === 'file_download') {
        console.log('File recieved, attempting to downloading file');
        this.downloadFile(event?.data.fileData, event?.data.fileName);
   } });
   
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



## Using cordova in-app-browser



> Official cordova in-app-browser `cordova-plugin-inappbrowser` has issue with android camera and microphone permissions. For this reason use will have to make the changes shown here https://github.com/083chandan-shl/cordova-plugin-inappbrowser/commit/338cb8a9689845043f5280d0f3d1d7a4752bc83c
>
> or use the following repository to install the plugin which is the fork of official plugin
>
> https://github.com/083chandan-shl/cordova-plugin-inappbrowser.git



1. Install the cordova using forked library.

   ```powershell
   npm install https://github.com/083chandan-shl/cordova-plugin-inappbrowser.git
   ```

2. Add the in app browser snippet to open the join link.

   Use `message` event on the browser instance to receive file data in form of `base64` 

   These message events will be fired when user clicks on file to download in the chat.

   ```tsx
   // interface of file event on message
   interface FileDownloadMessageEvent {
      type: 'file_download';
      fileData: string;
      fileName: string;
   }
   
   private startAppointmentInAB(url: string) {
       const browser = this.iab.create(url, '_blank', {
         location: 'no',
         hideurlbar: 'yes',
         hidenavigationbuttons: 'yes',
         mediaPlaybackRequiresUserAction: 'no',
         zoom: 'no'
       });
   
       browser.on('loadstart').subscribe(event => {
         console.log('In app browser loaded');
         this.initPermissions();
       });
       browser.on('loadstop').subscribe(event => {
         console.log('In app browser loaded');
         this.initPermissions();
       });
   
       browser.on('message').subscribe((eventData: any) => {
         // you will get the file eventData here
         console.log('In app browser new message', JSON.stringify(eventData));
         
         if (eventData?.data?.type === 'file_download') {
           eventData = eventData.data;
           console.log('File recieved, attempting to downloading file');
           this.fileDownloadService.downloadFile(eventData.fileData, eventData.fileName);
         }
       });
   
   
       // browser.close();
     }
   }
   ```





3. To enable the webview's UI and features, append useragent with `almeda/webview` In `capacitor.config.json` append the value for both iOS and Android

   ```json
   {
   	...
     "appendUserAgent": "almeda/webview",
   	... 
   }
   ```

4. Add permissions to allow camera, microphone, storage for Android to `AndroidManifest.xml`

   ```xml
   <?xml version="1.0" encoding="utf-8"?>
   <manifest xmlns:android="http://schemas.android.com/apk/res/android"
        package="io.ionic.starter">
        ...
        <!-- Permissions -->
        <uses-permission android:name="android.permission.INTERNET" />
        <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"
   />
        <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"
   />
        <uses-permission android:name="android.permission.RECORD_AUDIO" />
        <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS"
   />
        <uses-permission android:name="android.permission.CAMERA" />
        ...
   </manifest>
   ```

   

5. Add permissions to allow camera, microphone, storage for iOS to `info.pilst`

   ```xml
   ...
    <key>NSMicrophoneUsageDescription</key>
    <string>If you want to use the microphone, you have to give permission.
   </string>
    <key>NSCameraUsageDescription</key>
    <string>If you want to use the camera, you have to give permission.</string>
    ...
   ```



