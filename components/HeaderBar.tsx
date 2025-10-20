import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@react-native-vector-icons/ionicons";
import { View, Text, TouchableOpacity } from "react-native";

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
};

const HeaderBar = ({ title, subtitle, onBack }: Props) => {
  return (
    <SafeAreaView className="flex-row items-center justify-between  px-4  bg-white">
      <View className="flex-row items-center justify-between gap-5">
        <TouchableOpacity
          className={`rounded-full bg-black/80 p-1`}
          onPress={onBack}
          disabled={!onBack}
          style={{ opacity: onBack ? 1 : 0.5 }}
        >
          <Ionicons name="chevron-back" size={20} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text className="text-black font-bold text-xl">{title}</Text>
          {subtitle && <Text className="text-gray text-sm">{subtitle}</Text>}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HeaderBar;
