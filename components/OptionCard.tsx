import Ionicons from "@react-native-vector-icons/ionicons";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  index: number;
  isSelected: boolean;
  option: string;
  handleAnswer: () => void;
  disabled?: boolean;
  accentColor?: string;
};

const OptionCard = ({
  index,
  isSelected,
  option,
  handleAnswer,
  disabled = false,
  accentColor,
}: Props) => {
  const label = String.fromCharCode(65 + index); // A, B, C...
  const accent = accentColor ?? "#111827";
  const baseBorder = "rgba(15, 23, 42, 0.1)";

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      disabled={disabled}
      className="mb-2 flex-row items-center rounded-2xl border px-4 py-4"
      style={{
        opacity: disabled ? 0.5 : 1,
        backgroundColor: isSelected ? accent : "#ffffff",
        borderColor: isSelected ? accent : baseBorder,
        shadowColor: "rgba(15, 23, 42, 0.12)",
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: isSelected ? 4 : 1,
      }}
      onPress={handleAnswer}
    >
      <View
        className="mr-3 h-9 w-9 items-center justify-center rounded-full"
        style={{
          backgroundColor: isSelected
            ? "rgba(255,255,255,0.16)"
            : "rgba(15, 23, 42, 0.08)",
        }}
      >
        <Text
          className="text-sm font-semibold"
          style={{ color: isSelected ? "#fff" : accent }}
        >
          {label}
        </Text>
      </View>
      <Text
        className="flex-1 text-sm"
        style={{
          color: isSelected ? "#fff" : "#0f172a",
          fontWeight: isSelected ? "600" : "500",
        }}
        numberOfLines={2}
      >
        {option}
      </Text>
      <Ionicons
        name={isSelected ? "checkmark-circle" : "ellipse-outline"}
        size={20}
        color={isSelected ? "#ffffff" : "rgba(15, 23, 42, 0.3)"}
      />
    </TouchableOpacity>
  );
};

export default OptionCard;
