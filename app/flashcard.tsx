import { useVocabulary } from "@/lib/hooks/useVocabulary";
import { Vocabulary } from "@/types";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  Platform,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Easing,
  runOnJS,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import FlashCard from "@/components/FlashCard";
import { useCallback, useEffect, useMemo, useState } from "react";

const MAX_VISIBLE_ITEMS = 3;
const MAX_DECK_SIZE = 30;
const DEFAULT_VOCABULARY_ID = "cmfmeuh9k0006gquqnditsmdf";

const FlashCardScreen = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const vocabularyId = (Array.isArray(id) ? id[0] : id) ?? DEFAULT_VOCABULARY_ID;
  const { data: vocabulary, isLoading } = useVocabulary(vocabularyId);

  const [deck, setDeck] = useState<Vocabulary[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [resetSignal, setResetSignal] = useState(false);

  const activeIndex = useSharedValue(0);
  const resetProgress = useSharedValue(0);

  const buildDeck = useCallback((source?: Vocabulary[]) => {
    if (!source || source.length === 0) return [];
    const limit = Math.min(MAX_DECK_SIZE, source.length);
    const selected: Vocabulary[] = [];
    const used = new Set<number>();

    while (selected.length < limit) {
      const idx = Math.floor(Math.random() * source.length);
      if (used.has(idx)) continue;
      used.add(idx);
      selected.push(source[idx]);
    }

    return selected;
  }, []);

  const hydrateDeck = useCallback(
    (payload?: Vocabulary[]) => {
      const nextDeck = buildDeck(payload);
      setDeck(nextDeck);
      setCurrentIndex(0);
      activeIndex.value = 0;
    },
    [buildDeck, activeIndex],
  );

  useEffect(() => {
    if (!vocabulary || vocabulary.length === 0) {
      setDeck([]);
      setCurrentIndex(0);
      return;
    }
    hydrateDeck(vocabulary);
  }, [vocabulary, hydrateDeck]);

  const handleDeckReset = useCallback(() => {
    if (!vocabulary || vocabulary.length === 0) {
      resetProgress.value = withTiming(0, {
        duration: 180,
        easing: Easing.out(Easing.quad),
      });
      return;
    }

    hydrateDeck(vocabulary);
    setResetSignal((prev) => !prev);
    resetProgress.value = withTiming(0, {
      duration: 260,
      easing: Easing.out(Easing.quad),
    });
  }, [hydrateDeck, resetProgress, vocabulary]);

  const onRestart = useCallback(() => {
    if (!vocabulary || vocabulary.length === 0) return;

    resetProgress.value = 0;
    resetProgress.value = withTiming(
      1,
      {
        duration: 160,
        easing: Easing.in(Easing.quad),
      },
      (finished) => {
        if (finished) {
          runOnJS(handleDeckReset)();
        }
      },
    );
  }, [handleDeckReset, resetProgress, vocabulary]);

  const visibleCards = useMemo(() => {
    if (deck.length === 0) return [];
    if (currentIndex >= deck.length) return [];
    const start = Math.max(0, currentIndex - 1);
    const end = Math.min(deck.length, currentIndex + MAX_VISIBLE_ITEMS);
    return deck.slice(start, end).map((item, offset) => ({
      item,
      index: start + offset,
    }));
  }, [deck, currentIndex]);

  const hasDeck = deck.length > 0;
  const isComplete = currentIndex >= deck.length;

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <StatusBar style="light" />
      <LinearGradient
        colors={["#0f172a", "#1e293b", "#0f172a"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
        pointerEvents="none"
      />

      <View
        style={{
          paddingTop: Platform.OS === "ios" ? 40 : 20,
          height: Platform.OS === "ios" ? 110 : 90,
        }}
        className="absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between px-4"
      >
        <View className="flex-row items-center gap-3 rounded-full bg-white/10 px-3 py-1.5">
          <TouchableOpacity
            className="rounded-full bg-white/15 p-1.5"
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text className="text-sm font-semibold text-white/90">
            Flashcards
          </Text>
        </View>
        <TouchableOpacity
          className="rounded-full bg-white/15 p-2"
          onPress={onRestart}
          disabled={!hasDeck}
        >
          <Ionicons name="refresh-outline" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 items-center justify-center">
        {isLoading && !hasDeck ? (
          <ActivityIndicator size="large" color="#a5b4fc" />
        ) : null}

        {hasDeck ? (
          <View className="relative mx-5 h-full w-full items-center justify-center">
            {visibleCards.map(({ item, index }) => (
              <FlashCard
                key={item.id}
                item={item}
                index={index}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                maxVisibleItems={MAX_VISIBLE_ITEMS}
                activeIndex={activeIndex}
                totalLength={deck.length}
                resetSignal={resetSignal}
                resetProgress={resetProgress}
              />
            ))}
            <View className="absolute bottom-16 left-0 right-0 items-center">
              <TouchableOpacity
                className="rounded-full bg-white/15 px-6 py-2"
                onPress={onRestart}
                disabled={!hasDeck}
              >
                <Text className="text-sm font-semibold text-white uppercase tracking-wide">
                  {isComplete ? "Restart Cards" : "Shuffle Deck"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {!isLoading && !hasDeck ? (
          <Text className="text-base text-white/70">
            No vocabulary found. Pull to refresh?
          </Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default FlashCardScreen;
