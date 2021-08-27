import React from 'react';
import { ActivityIndicator, Dimensions, TouchableOpacity } from "react-native";
import { Camera } from 'expo-camera' // Permission은 유저에게 허락받으려고
import styled from "styled-components/native";
import { CameraType } from 'expo-camera/build/Camera.types';
import { MaterialIcons } from "@expo/vector-icons";

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
  state = {
    hasPermission: null,
    cameraType: Camera.Constants.Type.front
  };
  componentDidMount = async() => {
    const { status } = await Camera.requestPermissionsAsync();//카메라에 대한 허락을 물음
    if(status === "granted"){
      this.setState({hasPermission: true});
    } else{
      this.setState({hasPermission: false});
    }
  };
  render() {
    const { hasPermission, cameraType } = this.state;
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
            type={CameraType} //앞을 보여준다...? vs back
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
}
