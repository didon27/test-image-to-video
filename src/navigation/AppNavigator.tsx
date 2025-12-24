import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { colors } from '@/constants';
import {
  ImageSelectionScreen,
  ExportSettingsScreen,
  RenderingScreen,
  ResultScreen,
} from '@/screens';
import { RootStackParamList } from '@/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ImageSelection"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.primary,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="ImageSelection"
          component={ImageSelectionScreen}
          options={{
            title: 'Image to Video',
            headerLargeTitle: false,
          }}
        />
        <Stack.Screen
          name="ExportSettings"
          component={ExportSettingsScreen}
          options={{
            title: 'Settings',
          }}
        />
        <Stack.Screen
          name="Rendering"
          component={RenderingScreen}
          options={{
            title: 'Creating Video',
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={{
            title: 'Preview',
            headerBackVisible: false,
            gestureEnabled: false,
            headerStyle: {
              backgroundColor: colors.backgroundDark,
            },
            headerTintColor: colors.textWhite,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
