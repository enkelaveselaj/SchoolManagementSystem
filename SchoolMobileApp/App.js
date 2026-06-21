import './src/shim';
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import App from './src/App.jsx';

// Register the main component
registerRootComponent(App);
