import React from "react";
import { View } from "react-native";

interface SkeletonItemProps {
  showLevelBadge?: boolean;
}

const SkeletonItem = ({ showLevelBadge = false }: SkeletonItemProps) => (
  <View className={`bg-gray mt-2 p-3 border-l-2 border-gray-300 flex justify-between items-center gap-2 flex-row`}>
    <View className="flex-1">
      <View className="h-6 bg-gray-300 rounded w-3/4 mb-2" />
      <View className="h-4 bg-gray-300 rounded w-1/2" />
    </View>
    {showLevelBadge && (
      <View className="bg-gray-300 rounded-md p-1">
        <View className="h-3 bg-gray-400 rounded w-8" />
      </View>
    )}
  </View>
);

export default SkeletonItem;
