import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Camera, Permissions } from "expo"; // Permission은 유저에게 허락받으려고
export default class App extends React.Component {
  state = {
    hasPermission: null
  };
  componentDidMount = async() => {
    const {status} = await Permissions.askAsync(Permission.CAMERA);//카메라에 대한 허락을 물음
    console.log(status);
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
        <View>
          <Text>Has permissions</Text>
        </View>
      );
    } else if (hasPermission === false) {
      return (
        <View>
          <Text>Don't have permission for this</Text>
        </View>
      );
    } else {
      return <ActivityIndicator />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
