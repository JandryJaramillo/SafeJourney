import 'dotenv/config';
export default {
  "expo": {
    "name": "safe-journey",
    "slug": "safe-journey",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "scheme": "safeJourney",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.spocks.firebase",
      "googleServicesFile": "./GoogleService-Info.plist"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.spocks.firebase",
      "googleServicesFile": "./google-services.json",
      "permissions": [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-build-properties",
        {
          "ios": {
            "useFrameworks": "static"
          }
        }
      ],
      [
        "expo-location",
        {
          "locationWhenInUsePermission": "Show current location on map."
        }
      ],
      [
        "@rnmapbox/maps",
        {
          "RNMapboxMapsDownloadToken": "sk.eyJ1Ijoic3BvY2tzIiwiYSI6ImNtMWZ2OTIxdDBidXEyanB2aDNhZGN5eHAifQ.M2s10akkbnB-AvMyUr2WYA",
          "RNMapboxMapsVersion": "11.0.0"
        }
      ],
      "@react-native-firebase/app",
      "@react-native-firebase/auth"
    ],
    "extra": {
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTHDOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      measurementId: process.env.MEASUREMENT_ID,
      "eas": {
        "projectId": "d8ee0b52-e564-486c-83ca-dfecc17f3094"
      }
    },
    "owner": "jandryjaramillo"
  }
}
