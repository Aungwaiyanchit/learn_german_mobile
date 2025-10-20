import React, { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { PlatformPressable } from "@react-navigation/elements";
import { useSharedValue, withSpring } from "react-native-reanimated";
import Ionicons, {
  IoniconsIconName,
} from "@react-native-vector-icons/ionicons";

type Props = {
  onPress: () => void;
  onLongPress: () => void;
  href: string | undefined;
  isFocused: boolean;
  accessibilityLabel: string | undefined;
  label: string;
  testId?: string | undefined;
  routeName: string;
};

const icons: Record<string, IoniconsIconName> = {
  index: "home",
  setting: "settings",
  vocabulary: "book",
  grammar: "document-text",
  quiz: "school",
};

export default function TabBarButton({
  onPress,
  onLongPress,
  href,
  accessibilityLabel,
  isFocused,
  testId,
  routeName,
}: Props) {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, {
      duration: 350,
    });
  }, [isFocused, scale]);

  const iconName = isFocused
    ? icons[routeName]
    : (`${icons[routeName]}-outline` as IoniconsIconName);

  return (
    <PlatformPressable
      href={href}
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={accessibilityLabel}
      testID={testId}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabBarButton}
    >
      <View className="flex-row  gap-2 items-center ">
        <Ionicons
          size={23}
          name={iconName}
          color={!isFocused ? "#fff" : "#000"}
        />
      </View>
    </PlatformPressable>
  );
}

const styles = StyleSheet.create({
  tabBarButton: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
    height: 40,
  },
});
