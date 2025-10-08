import React from 'react';
import {View, Text, ActivityIndicator} from 'react-native';

export default function LoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#000" />
    </View>
  );
}
