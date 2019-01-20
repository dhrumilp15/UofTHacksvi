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
import { WebBrowser } from 'expo';

import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  constructor(props)
  {
    super(props);
    this.state = ({
      rec : false,
      text : ''
    });
    this.onPress = this.onPress.bind(this);
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
        />

        <TouchableHighlight style = {styles.VoiceButton} onPress = {this.onPress}>
        <Image
          style = {styles.button}
          source={require('../assets/images/mic.png')}/>
        </TouchableHighlight>
      </View>
    );
  };

/*
<View style={styles.container}>
  <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
=         <View style={styles.welcomeContainer}>
      <Image
        source={
          __DEV__ ? require('../assets/images/robot-dev.png') : require('../assets/images/robot-prod.png')
        }
        style={styles.welcomeImage}
      />
    </View>

    <View style = {styles.getStartedContainer}>
      <Text style = {styles.getStartedText}>Press the button when you're ready to speak.</Text>
    </View>
    <View style = {styles.Voicebutton}>
      <TouchableHighlight onPress={this._onPressButton}>*/
  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };

   async onPress()
  {
    axios.post("http:///localhost:3978/api/messages", this.state.text)
    .then(res => console.log(res))
    .catch(err => console.log(err))

      const { Permissions } = Expo;
      const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
      if (status === 'granted')
      {
        Expo.Audio.setAudioModeAsync({
          playsInSilentModeIOS : false,
          allowsRecordingIOS: false,
          interruptionModeIOS : Expo.Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          shouldDuckAndroid : true,
          interruptionModeAndroid : Expo.Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          playThroughEarpieceAndroid : true
        });


        const record = new Expo.Audio.Recording();
        if(this.state.rec === false)
        {

          try {
            await record.prepareToRecordAsync(Expo.Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            await record.startAsync();

          }
           catch (e) {
            console.log(e);
          }
        }
        else {

          try {
            await record.stopAndUnloadAsync();
          } catch (e) {
            console.log(e);
          } finally {
            record.setOnRecordingStatusUpdate(null);
          }

          var fileurl = record.getURI();
          play(fileurl);
        }
    }
    else {
      console.log("Didn't have permission")
    }
    this.setState(prevState => ({
      rec: !prevState.rec
    }));

  }

  async play(fileurl)
  {
    try {
       const { sound: soundObject, status } = await Expo.Audio.Sound.createAsync((fileurl), { shouldPlay : true});
    } catch (e) {
      console.log(e);
    } finally {

    }
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
