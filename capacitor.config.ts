import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.AtomOne.app',
  appName: 'AtomOne',
  webDir: 'build',
  server: {
    cleartext: true
  }
};

export default config;