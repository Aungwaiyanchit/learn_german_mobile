import React from 'react';
import { View, Text } from 'react-native';

export default function Header({ title }: { title: string } ) {
  return (
      <View className="py-5">
          <Text className="text-2xl font-semibold">{title}</Text>
      </View>
  );
}
