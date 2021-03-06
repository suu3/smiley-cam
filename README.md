# ๐ Smiley Cam (2021.8)
<img src="https://img.shields.io/badge/React Native-61DAFB?style=flat-square&logo=React&logoColor=white"/> <img src="https://img.shields.io/badge/Expo-000020?style=flat-square&logo=Expo&logoColor=white"/>  
์์ผ๋ฉด ์ฌ์ง์ ์ฐ๋ ์นด๋ฉ๋ผ ์ฑ.  
(expo-permissions -> expo-image-picker ๋ก ๋์ฒด)
### ๋ธ๋ง๋ ์ฝ๋ React Native ๋ณด๋์ค ๊ฐ์(smiley-cam) ๊ณต๋ถํ ๋ด์ฉ
## 1. Camera
### <a href="https://docs.expo.dev/versions/latest/sdk/camera/">Camera Expo Documentation</a>
~~~
expo install expo-camera
~~~
์ฌ์ฉ์ ์์ ๋ผ์ด๋ธ๋ฌ๋ฆฌ ์ค์น๊ฐ ํ์ํจ.
> ### 1๏ธโฃ Camera permission
> ๋ ๋๋ง ์ ํ๋ฒ ํธ์ถ๋๋ componentDidMount๋ฅผ ์ฌ์ฉํ๋ค. (์ฌ์ฉ ๊ถํ์ ๋ฌผ์ด๋ณผ ๋ ์ฌ์ฉํ์.)
> ~~~
> constructor(props) {
>   super(props);
>   this.state = {
>     hasPermission: null,
>  };
>  this.cameraRef = React.createRef();
>}
> ~~~
> hasPermission์ ์ฌ์ฉ ๊ถํ ์ํ๋ฅผ ์ ์ฅํ๋ค. 
> * <b>React.createRef()</b></br>
>   ํด๋์คํ ์ปดํฌ๋ํธ๋ createRef()๋ฅผ, ํจ์ํ ์ปดํฌ๋ํธ๋ useRef()์ ์ฌ์ฉํ๋ค. (์ฌ๊ธฐ์  ํด๋์คํ ์ปดํฌ๋ํธ๋ฅผ ์ฌ์ฉํจ.)  
>   DOM์ ์ง์  ๊ฑด๋๋ ค์ผํ  ๋ ์ฌ์ฉํ๋ฉฐ, ์ฌ๊ธฐ์๋ ์นด๋ฉ๋ผ ์์์ ์ ๊ทผํด์ผํ๊ธฐ ๋๋ฌธ์ ์ฌ์ฉํจ.  
>   camera documentation์ ๋ณด๋ฉด ref์ ๋ง๋ค์ด์ 
>   ~~~
>   let photo = await this.camera.takePictureAsync();
>   ~~~
>   ์ผ๋ก ์ฌ์ฉํ๋ผ๊ณ  ์จ์์.  
>   ๋ฐ๋ผ์ ์ฌ์ง ์ฐ๋ ํจ์(takePictureAsync())๋ฅผ ์ฌ์ฉํ๊ธฐ ์ํด ref๋ฅผ ๋ง๋ค์ด์ค.
>   
> ~~~  
> componentDidMount = async() => {
>   const { status } = await Camera.requestPermissionsAsync();
>   if(status === "granted"){
>     this.setState({hasPermission: true});
>   } else{
>     this.setState({hasPermission: false});
>   }
>};
> ~~~
> ### 2๏ธโฃ ์ ๋ฉด ํ๋ฉด ๋ณ๊ฒฝ
> ~~~
> switchCameraType = () => { 
>   const { cameraType } = this.state;
>   if (cameraType === Camera.Constants.Type.front) {
>     this.setState({
>       cameraType: Camera.Constants.Type.back
>     });
>   } else {
>     this.setState({
>       cameraType: Camera.Constants.Type.front
>     });
>   }
> };
> ~~~
> ### 3๏ธโฃ ์ฌ์ง ์ฐ๊ธฐ
> ์นด๋ฉ๋ผ๊ฐ ์๋ค๋ฉด ์ฌ์ง์ ์ฐ๋๋ค.  
> takePictureAsync()๋ { uri, width, height, exif, base64 } ๊ฐ์ฒด๋ฅผ ๋ฆฌํดํ๋๋ฐ, savePhoto๋ฅผ ์ํด ๊ทธ ์ค uri๋ฅผ ๋ฐ์์จ๋ค.
> ~~~
> takePhoto = async () => { /* ํญ์ await๋ฅผ try & catch๋ก ๊ฐ์ธ์ค์ผํจ */
>    try {
>     if (this.cameraRef.current) {
>       let { uri } = await this.cameraRef.current.takePictureAsync({
>         quality: 1 // 1์ด ์ํผํ๋ฆฌํฐ
>       });
>       if (uri) {
>         this.savePhoto(uri); //์ฌ์ง ์ ์ฅ
>       }
>     }
>   } catch (error) {
>     alert(error);
>     this.setState({
>       smileDetected: false
>     });
>   }
> };
> ~~~
>
## 2. ์ฌ์ง ์ ์ฅ
### <a href="https://docs.expo.dev/versions/latest/sdk/media-library/">MediaLibrary Expo Documentation</a> <br/> <a href="https://docs.expo.dev/versions/latest/sdk/imagepicker/">ImagePicker Expo Documentation</a>
~~~
expo install expo-media-library
expo install expo-image-picker
~~~
์ฌ์ฉ์ ์์ ๋ผ์ด๋ธ๋ฌ๋ฆฌ ์ค์น๊ฐ ํ์ํจ.
> ~~~
> savePhoto = async uri => {
>   try {
>     const { status } = await ImagePicker.requestCameraRollPermissionsAsync(); // ๊ฐค๋ฌ๋ฆฌ ์ ๊ทผ ๊ถํ
>     if (status === "granted") {
>       const asset = await MediaLibrary.createAssetAsync(uri);
>       let album = await MediaLibrary.getAlbumAsync(ALBUM_NAME); //ALBUM_NAME: ์ง์  ์ง์ 
>       if (album === null) { //๊ฐค๋ฌ๋ฆฌ์ ์จ๋ฒ X
>         album = await MediaLibrary.createAlbumAsync(ALBUM_NAME, asset);
>       } else { //๊ฐค๋ฌ๋ฆฌ์ ์จ๋ฒ O
>         await MediaLibrary.addAssetsToAlbumAsync([asset], album.id);
>       }
>       setTimeout(() => this.setState({ smileDetected: false }), 2000);
>     } else {
>       this.setState({ hasPermission: false });
>     }
>   } catch (error) {
>     console.log(error);
>   }
> };
> ~~~


## 2. Face Detector
### <a href="https://docs.expo.dev/versions/v44.0.0/sdk/facedetector/">FaceDetector Expo Documentation</a>
~~~
expo install expo-face-detector
~~~
์ฌ์ฉ์ ์์ ๋ผ์ด๋ธ๋ฌ๋ฆฌ ์ค์น๊ฐ ํ์ํจ.  
์ผ๊ตด ์ธ์ + ์ผ๊ตด ๋๋๋งํฌ ์ขํ์ smilingProbability(boolean์๋. 0~1 ์์น๋ก ๋์ด.)๊น์ง ์ ๊ณตํด์ค๋ค.
~~~
<Camera
  faceDetectorSettings={{
    detectLandmarks: FaceDetector.Constants.Landmarks.all,
    runClassifications: FaceDetector.Constants.Classifications.all
  }}
  ref={this.cameraRef}
/>
~~~
## โถ ๊ฒฐ๊ณผ๋ฌผ
![smiley-cam](https://user-images.githubusercontent.com/71166763/147491805-4fc65bd7-55dd-4a01-bc78-4162c9cb65b8.png)


