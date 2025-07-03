import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sipena.app',
  appName: 'SipenaApp',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#003b6f",
      showSpinner: false,
      androidSpinnerStyle: "small",
      iosSpinnerStyle: "small",
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;