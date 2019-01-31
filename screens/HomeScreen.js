import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Button,
  Alert,
  Icon
} from 'react-native';
import Expo, { Audio, FileSystem, WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  constructor(props)
  {
    super(props);
    this.recording = null;
    this.sound = null;
    this.state = ({
      permission: false,
      isrec : false,
      isloading : false,
      text : '',
    });
  }

  componenentDidMount()
  {
    async () => {
      const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
      this.setState({
        permission : response.status === 'granted',
      })
    }
  }

  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style = {styles.Container}>
        <TextInput
          style={styles.actualtext}
          onChangeText={(text) => this.setState({text})}
          placeholder= "How are you feeling today?"
          multiline = {true}
        />

        <TouchableHighlight style = {styles.VoiceButton} onPress = {this._onPress}>
        <Image  
          style = {styles.button}
          source={require('../assets/images/mic.png')}/>
        </TouchableHighlight>
      </View>
    );
  };

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };

  _onPress = () =>
  {
    if (this.state.isrec)
    {
      this._StopRecording();
    }
    else
    {
      this._BeginRecording();
    }
  }

  _recordingController = status =>
  {
    if (status.canRecord) {
      this.setState({
        isrec: status.isRecording,
        recordingDuration: status.durationMillis,
      });
    } else if (status.isDoneRecording) {
      this.setState({
        isrec: false,
        recordingDuration: status.durationMillis,
      });
      if (!this.state.isLoading) {
        this._StopRecording();
      }
    }
  }
  
  async _BeginRecording()
  {
    this.setState({
      isloading : true,
    })
    
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS : false,
      allowsRecordingIOS: false,
      interruptionModeIOS : Expo.Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      shouldDuckAndroid : true,
      interruptionModeAndroid : Expo.Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid : true
    });

    if (this.recording !== null) {
      this.recording.setOnRecordingStatusUpdate(null);
      this.recording = null;
    }

    const record = new Audio.Recording();
    await record.prepareToRecordAsync();
    await record.setOnRecordingStatusUpdate(this._recordingController);
    
    this.recording = record;
    await this.recording.startAsync();

    this.setState({
      isloading : false,
    })
  }

  async _StopRecording()
  {
    this.setState({
      isloading : true,
    })
    
    await this.recording.stopAndUnloadAsync();

    const info = await FileSystem.getInfoAsync(this.recording.getURI());
    console.log(`FILE INFO: ${JSON.stringify(info)}`);
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      playsInSilentLockedModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });

    const { sound, status } = await this.recording.createNewLoadedSound(
      {
        isLooping: true,
        isMuted: false,
        volume: 100,
        rate: 1,
        shouldCorrectPitch: true,
      },
      this._recordingController
    );
    this.sound = sound;

    this.setState({
      isloading : false,
    })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems:'center'
  },
  VoiceButton:
  {
    top : 550,
    alignItems : 'center',
  },
  actualtext:
  {
    height:40,
    top:200,
    alignItems : 'center',
    fontSize: 30
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
});
