import { Vocabulary } from "@/types";
import { useEffect } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
  item: Vocabulary;
  index: number;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  maxVisibleItems: number;
  activeIndex: SharedValue<number>;
  totalLength: number;
  resetSignal: boolean;
  resetProgress: SharedValue<number>;
};

const FlashCard = (props: Props) => {
  const {
    item,
    index,
    activeIndex,
    currentIndex,
    setCurrentIndex,
    maxVisibleItems,
    totalLength,
    resetSignal,
    resetProgress,
  } = props;

  const { width } = useWindowDimensions();
  const cardWidth = width * 0.85;
  const panExitOffset = cardWidth + 60;
  const isCurrentItem = index === currentIndex;

  const translateX = useSharedValue(0);
  const direction = useSharedValue(0);
  const flip = useSharedValue(0);

  const baseStyle = useAnimatedStyle(() => {
    const stackOpacity = interpolate(
      activeIndex.value,
      [index - 1, index, index + 1],
      [1 - 1.25 / maxVisibleItems, 1, 1],
    );

    const stackTranslateY = interpolate(
      activeIndex.value,
      [index - 1, index, index + 1],
      [24, 0, 0],
    );

    const stackScale = interpolate(
      activeIndex.value,
      [index - 1, index, index + 1],
      [0.96, 1, 1],
    );

    const rotation = interpolate(Math.abs(translateX.value), [0, cardWidth], [0, 12]);
    const resetFade = interpolate(resetProgress.value, [0, 1], [1, 0.18]);
    const resetLift = interpolate(resetProgress.value, [0, 1], [0, -18]);
    const resetScale = interpolate(resetProgress.value, [0, 1], [1, 0.92]);

    return {
      zIndex: totalLength - index,
      position: "absolute",
      opacity: stackOpacity * resetFade,
      transform: [
        { translateX: translateX.value },
        { translateY: stackTranslateY + resetLift },
        { scale: stackScale * resetScale },
        { rotateZ: `${isCurrentItem ? direction.value * rotation : 0}deg` },
      ],
    };
  });

  const frontFaceStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${interpolate(flip.value, [0, 1], [0, 180])}deg` },
    ],
  }));

  const backFaceStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${interpolate(flip.value, [0, 1], [-180, 0])}deg` },
    ],
  }));

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      if (!isCurrentItem) return;
      direction.value = event.translationX > 0 ? 1 : -1;
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (!isCurrentItem) return;
      const shouldDismiss =
        Math.abs(event.translationX) > 150 || Math.abs(event.velocityX) > 1000;

      if (!shouldDismiss) {
        translateX.value = withSpring(0);
        activeIndex.value = withTiming(currentIndex, { duration: 450 });
        return;
      }

      translateX.value = withTiming(
        panExitOffset * direction.value,
        {},
        () => {
          scheduleOnRN(setCurrentIndex, currentIndex + 1);
        },
      );
      activeIndex.value = withTiming(index + 1);
    });

  const tap = Gesture.Tap()
    .maxDuration(220)
    .maxDistance(12)
    .requireExternalGestureToFail(pan)
    .onEnd(() => {
      if (!isCurrentItem) return;
      flip.value = withTiming(flip.value === 1 ? 0 : 1, { duration: 320 });
    });

  const gestures = Gesture.Simultaneous(tap, pan);

  useEffect(() => {
    cancelAnimation(translateX);
    cancelAnimation(flip);
    translateX.value = 0;
    direction.value = 0;
    flip.value = 0;
  }, [resetSignal, translateX, direction, flip]);

  return (
    <GestureDetector gesture={gestures}>
      <Animated.View style={[styles.cardWrapper, baseStyle]}>
        <Animated.View style={[styles.cardFace, frontFaceStyle]}>
          <LinearGradient
            colors={["#2563eb", "#7c3aed"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.cardContent}>
            <View style={styles.topRow}>
              <View style={styles.chip}>
                <Text style={styles.articleText}>{item.article || "—"}</Text>
              </View>
              <View style={styles.progressChip}>
                <Text style={styles.progressText}>
                  {index + 1} / {totalLength}
                </Text>
              </View>
            </View>
            <View style={styles.termBlock}>
              <Text style={styles.termText}>{item.term}</Text>
            </View>
            <View style={styles.sectionDivider}>
              <View style={styles.sectionLine} />
              <Text style={styles.sectionLabel}>Vocabulary</Text>
              <View style={styles.sectionLine} />
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.cardFace, styles.cardBackFace, backFaceStyle]}>
          <LinearGradient
            colors={["#f97316", "#ec4899"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.cardContent}>
            <View style={styles.topRow}>
              <Text style={styles.translationLabel}>Translation</Text>
              <View style={styles.progressChip}>
                <Text style={styles.translationBadge}>Keep Learning</Text>
              </View>
            </View>
            <View style={styles.translationBlock}>
              <Text style={styles.backTerm}>{item.term}</Text>
              <Text style={styles.translationText}>{item.translation}</Text>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: "85%",
    height: 360,
    borderRadius: 28,
    overflow: "visible",
    shadowColor: "#0f172a",
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 14 },
    elevation: 20,
    backgroundColor: "transparent",
  },
  cardFace: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 28,
    backfaceVisibility: "hidden",
    overflow: "hidden",
  },
  cardBackFace: {
    transform: [{ rotateY: "180deg" }],
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  chip: {
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.28)",
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  progressChip: {
    borderRadius: 999,
    backgroundColor: "rgba(15, 23, 42, 0.35)",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  articleText: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.6,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.92)",
  },
  progressText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.72)",
  },
  termBlock: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
  },
  termText: {
    fontSize: 36,
    fontWeight: "700",
    letterSpacing: -0.5,
    color: "#ffffff",
    textAlign: "center",
  },
  tipText: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.76)",
  },
  tipDivider: {
    width: StyleSheet.hairlineWidth,
    height: 14,
    backgroundColor: "rgba(255,255,255,0.28)",
    marginHorizontal: 12,
  },
  sectionDivider: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  sectionLabel: {
    marginHorizontal: 12,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 3,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.6)",
  },
  translationBlock: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
  },
  translationLabel: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.82)",
  },
  translationBadge: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.8)",
  },
  backTerm: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 2.4,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
  },
  translationText: {
    marginTop: 10,
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -0.4,
    lineHeight: 36,
    textAlign: "center",
    color: "#ffffff",
  },
  footerText: {
    fontSize: 12,
    lineHeight: 18,
    color: "rgba(255,255,255,0.72)",
  },
});

export default FlashCard;
