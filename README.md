# 😁 Smiley Cam (2021.8)
<img src="https://img.shields.io/badge/React Native-61DAFB?style=flat-square&logo=React&logoColor=white"/> <img src="https://img.shields.io/badge/Expo-000020?style=flat-square&logo=Expo&logoColor=white"/>  
웃으면 사진을 찍는 카메라 앱
### 노마드 코더 React Native 보너스 강의(smiley-cam) 공부한 내용
## 1. Camera
### <a href="https://docs.expo.dev/versions/latest/sdk/camera/">Camera Expo Documentation</a>
~~~
expo install expo-camera
~~~
사용에 앞서 라이브러리 설치가 필요함.
> ### 1️⃣ Camera permission
> 렌더링 시 한번 호출되는 componentDidMount를 사용한다. (사용 권한을 물어볼 때 사용하자.)
> ~~~
> constructor(props) {
>   super(props);
>   this.state = {
>     hasPermission: null,
>  };
>  this.cameraRef = React.createRef();
>}
> ~~~
> hasPermission에 사용 권한 상태를 저장한다. 
> * <b>React.createRef()</b></br>
>   클래스형 컴포넌트는 createRef()를, 함수형 컴포넌트는 useRef()을 사용한다. (여기선 클래스형 컴포넌트를 사용함.)  
>   DOM을 직접 건드려야할 때 사용하며, 여기서는 카메라 요소에 접근해야하기 때문에 사용함.  
>   camera documentation에 보면 ref을 만들어서 
>   ~~~
>   let photo = await this.camera.takePictureAsync();
>   ~~~
>   으로 사용하라고 써있음.  
>   따라서 사진 찍는 함수(takePictureAsync())를 사용하기 위해 ref를 만들어줌.
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
> ### 2️⃣ 전면 후면 변경
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
> ### 3️⃣ 사진 찍기
> 카메라가 있다면 사진을 찍는다.  
> takePictureAsync()는 { uri, width, height, exif, base64 } 객체를 리턴하는데, savePhoto를 위해 그 중 uri를 받아온다.
> ~~~
> takePhoto = async () => { /* 항상 await를 try & catch로 감싸줘야함 */
>    try {
>     if (this.cameraRef.current) {
>       let { uri } = await this.cameraRef.current.takePictureAsync({
>         quality: 1 // 1이 슈퍼퀄리티
>       });
>       if (uri) {
>         this.savePhoto(uri); //사진 저장
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
## 2. 사진 저장
### <a href="https://docs.expo.dev/versions/latest/sdk/media-library/">MediaLibrary Expo Documentation</a>
~~~
expo install expo-media-library
~~~
사용에 앞서 라이브러리 설치가 필요함.
> ~~~
> savePhoto = async uri => {
>   try {
>     const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL); //갤러리 접근 권한
>     if (status === "granted") {
>       const asset = await MediaLibrary.createAssetAsync(uri);
>       let album = await MediaLibrary.getAlbumAsync(ALBUM_NAME); //ALBUM_NAME: 직접 지정
>       if (album === null) { //갤러리에 앨범 X
>         album = await MediaLibrary.createAlbumAsync(ALBUM_NAME, asset);
>       } else { //갤러리에 앨범 O
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
사용에 앞서 라이브러리 설치가 필요함.  
얼굴 인식 + 얼굴 랜드마크 좌표와 smilingProbability(boolean아님. 0~1 수치로 나옴.)까지 제공해준다.
~~~
<Camera
  faceDetectorSettings={{
    detectLandmarks: FaceDetector.Constants.Landmarks.all,
    runClassifications: FaceDetector.Constants.Classifications.all
  }}
  ref={this.cameraRef}
/>
~~~
## 결과물
![smiley-cam](https://user-images.githubusercontent.com/71166763/147415660-cd9bab03-95de-45cd-9bfc-50bad301cb3c.png)

