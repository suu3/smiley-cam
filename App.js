import React from 'react';
import { ActivityIndicator, Dimensions, TouchableOpacity } from "react-native";
import { Camera } from 'expo-camera';
import styled from "styled-components/native";
import { CameraType } from 'expo-camera/build/Camera.types';
import { MaterialIcons } from "@expo/vector-icons";
import * as FaceDetector from "expo-face-detector"; // 얼굴 인식
import * as FileSystem from "expo-file-system";

const { width, height } = Dimensions.get("window");

const CenterView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: cornflowerblue;
`;

const Text = styled.Text`
  color: white;
  font-size: 22px;
`;

const IconBar = styled.View`
  margin-top: 50px;
`;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPermission: null,
      cameraType: Camera.Constants.Type.front,
      smileDetected: false
    };
    this.cameraRef = React.createRef();
  }
  componentDidMount = async() => {
    const { status } = await Camera.requestPermissionsAsync();//카메라에 대한 허락을 물음
    if(status === "granted"){
      this.setState({hasPermission: true});
    } else{
      this.setState({hasPermission: false});
    }
  };
  render() {
    const { hasPermission, cameraType, smileDetected } = this.state;
    if (hasPermission === true) {
      return (
        <CenterView>
          <Camera
            style={{
              width: width - 40,
              height: height / 1.5,
              borderRadius: 10,
              overflow: "hidden"
            }}
            type={CameraType}
            onFacesDetected={smileDetected ? null : this.onFacesDetected}
            faceDetectionClassifications="all" //밑에가 안돼서 바꿨는데 될지모르겠네
            faceDetectionLandmarks="all"
/*            faceDetectorSettings={{ //smile detect를 위한 세팅
              detectLandmarks: FaceDetector.Constants.Landmarks.all,
              runClassifications: FaceDetector.Constants.Classifications.all
            }} */

            ref={this.cameraRef} //react의 reference
          />
          <IconBar>
            <TouchableOpacity onPress={this.switchCameraType}>
              <MaterialIcons
                name={
                  cameraType === Camera.Constants.Type.front
                    ? "camera-rear"
                    : "camera-front"
                }
                color="white"
                size={50}
              />
            </TouchableOpacity>
          </IconBar>
        </CenterView>
      );
    } else if (hasPermission === false) {
      return (
        <CenterView>
          <Text>Don't have permission for this</Text>
        </CenterView>
      );
    } else {
      return (
        <CenterView>
          <ActivityIndicator />
        </CenterView>
      );
    }
  }
  switchCameraType = () => { // 전면 후면 변경. 핸드폰 카메라 사용할 때
    const { cameraType } = this.state;
    if (cameraType === Camera.Constants.Type.front) {
      this.setState({
        cameraType: Camera.Constants.Type.back
      });
    } else {
      this.setState({
        cameraType: Camera.Constants.Type.front
      });
    }
  };
  onFacesDetected = ({ faces }) => {
    const face = faces[0];
    if (face) {
      if (face.smilingProbability > 0.7) {
        this.setState({
          smileDetected: true
        });
        this.takePhoto();
      }
    }
  };

  //사진 찍기
  takePhoto = async () => { //** 항상 await를 try & catch로 감싸줘야함 */
    try {
      if (this.cameraRef.current) {
        let { uri } = await this.cameraRef.current.takePictureAsync({
          quality: 1 // 1이 슈퍼퀄리티
        });
        if (uri) {
          this.savePhoto(uri);
        }
      }
    } catch (error) {
      alert(error);
      this.setState({
        smileDetected: false
      });
    }
  };

  //사진 저장
  savePhoto = async uri => {};
}
