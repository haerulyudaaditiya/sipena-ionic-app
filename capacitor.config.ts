import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'SipenaApp',
  webDir: 'www',
  plugins: {
    App: {
      urlScheme: 'sipena',  // Custom scheme for your app (myapp://)
    },
  },
};

export default config;