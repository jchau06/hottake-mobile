import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}

export function tabBarStyle(isDark: boolean) {
  return {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderTopWidth: 0,      // removes the black line
    elevation: 0,           // removes shadow on Android
    shadowOpacity: 0,       // removes shadow on iOS
    height: 60,
  };
}
