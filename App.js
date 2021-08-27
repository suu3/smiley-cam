import React from 'react';
import { ActivityIndicator, Dimensions } from "react-native";
import { Camera } from 'expo-camera' // Permission은 유저에게 허락받으려고
import styled from "styled-components/native";

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


export default class App extends React.Component {
  state = {
    hasPermission: null
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
    const { hasPermission } = this.state;
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
            type={Camera.Constants.Type.fronte} //앞을 보여준다...? vs back
          />
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
}
