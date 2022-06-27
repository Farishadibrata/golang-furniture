// @ts-nocheck
import { WebView } from 'react-native-webview';
import { StyleSheet } from 'react-native';
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import Constants from 'expo-constants';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: Constants.statusBarHeight,
    },
  });
  
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <WebView 
      style={styles.container}
      source={{ uri: 'http://192.168.18.22:3000/' }}
    />
    );
  }
}
