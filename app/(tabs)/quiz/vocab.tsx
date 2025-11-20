import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  GestureResponderEvent,
} from "react-native";
import OptionCard from "@/components/OptionCard";
import ChapterSelector from "@/components/ChapterSelector";

import { useVocabQuestion } from "@/lib/hooks/useVocabQuestion";
import { fetchChapters } from "@/lib/services/api";
import { Chapter } from "@/types";
import { useQuery } from "@tanstack/react-query";

const COLORS = {
  screen: "#F6F7F9",
  surface: "#FFFFFF",
  surfaceAlt: "#F1F5F9",
  textPrimary: "#111827",
  textSecondary: "rgba(15,23,42,0.65)",
  textMuted: "rgba(15,23,42,0.45)",
  accent: "#0B1120",
  border: "rgba(15,23,42,0.1)",
  overlay: "rgba(246,247,249,0.94)",
};

type QuizStatus = "idle" | "begin" | "loading" | "completed";

const VocabQuizScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<QuizStatus>("idle");
  const touchStartX = useRef<number | null>(null);

  const { data: chapters, status: chapterStatus } = useQuery<Chapter[]>({
    queryKey: ["chapters"],
    queryFn: fetchChapters,
  });
  const [selectedChapter, setSelectedChapter] = useState<string>("");

  useEffect(() => {
    if (chapters?.length) {
      setSelectedChapter((prev) => prev || chapters[0].id);
    }
  }, [chapters]);

  const activeChapter = useMemo(() => {
    if (!selectedChapter || !chapters) return undefined;
    return chapters.find((chapter) => chapter.id === selectedChapter);
  }, [chapters, selectedChapter]);

  const returnToSelection = () => {
    setSelectedChapter("");
    setStatus("idle");
    setCurrentStep(0);
    setUserAnswers({});
    setScore(0);
  };

  const {
    questions,
    generateQuestions,
  } = useVocabQuestion(selectedChapter);

  const currentQuestion = questions[currentStep];

  const startQuiz = async () => {
    if (!selectedChapter) return;
    setStatus("loading");
    await generateQuestions();
    setScore(0);
    setCurrentStep(0);
    setUserAnswers({});
    setStatus("begin");
  };

  const handleAnswer = (index: number) => {
    setUserAnswers((prev) => ({ ...prev, [currentStep]: index }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleSubmit = () => {
    const finalScore = questions.reduce((acc, question, index) => {
      const userAnswer = userAnswers[index];
      return question.correctAnswerIndex === userAnswer ? acc + 1 : acc;
    }, 0);
    setScore(finalScore);
    setStatus("completed");
  };

  const totalQuestions = questions.length;
  const progressRatio = totalQuestions > 0 ? (currentStep + 1) / totalQuestions : 0;
  const allAnswered = typeof userAnswers[currentStep] === "number";
  const isLastQuestion = currentStep === totalQuestions - 1;

  const handleTouchStart = (event: GestureResponderEvent) => {
    touchStartX.current = event.nativeEvent.pageX;
  };

  const handleTouchEnd = (event: GestureResponderEvent) => {
    if (!allAnswered || touchStartX.current === null) {
      touchStartX.current = null;
      return;
    }
    const delta = event.nativeEvent.pageX - touchStartX.current;
    if (delta > 70) {
      if (isLastQuestion) {
        handleSubmit();
      } else {
        handleNext();
      }
    }
    touchStartX.current = null;
  };

  if (status === "completed") {
    return (
      <View className="flex-1 items-center justify-center px-5" style={{ backgroundColor: COLORS.screen }}>
        <View
          className="w-full rounded-3xl border p-8"
          style={{
            borderColor: COLORS.border,
            backgroundColor: COLORS.surface,
            shadowColor: "rgba(0,0,0,0.12)",
            shadowOpacity: 0.12,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 10 },
            elevation: 6,
          }}
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xs font-semibold uppercase tracking-wide" style={{ color: COLORS.textMuted }}>
                {activeChapter?.slug ?? "Vocabulary"}
              </Text>
              <Text className="text-sm" style={{ color: COLORS.textSecondary }}>
                {activeChapter?.title ?? "Great effort!"}
              </Text>
            </View>
            <View className="h-16 w-16 items-center justify-center rounded-2xl" style={{ backgroundColor: COLORS.surfaceAlt }}>
              <Text className="text-xl font-bold" style={{ color: COLORS.textPrimary }}>
                {score}
              </Text>
              <Text className="text-[11px] font-semibold" style={{ color: COLORS.textMuted }}>
                of {questions.length}
              </Text>
            </View>
          </View>

          <View className="mt-6">
            <View className="flex-row items-center justify-between">
              <Text className="text-xs font-semibold uppercase tracking-wide" style={{ color: COLORS.textMuted }}>
                Accuracy
              </Text>
              <Text className="text-lg font-semibold" style={{ color: COLORS.textPrimary }}>
                {questions.length ? Math.round((score / questions.length) * 100) : 0}%
              </Text>
            </View>
            <View className="mt-3 h-[6px] w-full rounded-full" style={{ backgroundColor: COLORS.border }}>
              <View
                className="h-full rounded-full"
                style={{
                  width: `${questions.length ? Math.round((score / questions.length) * 100) : 0}%`,
                  backgroundColor: COLORS.accent,
                }}
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={returnToSelection}
            activeOpacity={0.9}
            className="mt-10 w-full rounded-2xl px-4 py-4"
            style={{ backgroundColor: COLORS.accent }}
          >
           <Text className="text-center text-base font-semibold text-white">
             Choose another chapter
           </Text>
         </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (status === "idle") {
    return (
      <View className="flex-1 px-5 pt-5" style={{ backgroundColor: COLORS.screen }}>
        <Text className="text-2xl font-semibold" style={{ color: COLORS.textPrimary }}>
          Vocabulary Challenge
        </Text>
        <Text className="mt-1 text-base" style={{ color: COLORS.textSecondary }}>
          Pick a chapter and test your knowledge.
        </Text>
        <View className="mt-6 space-y-4">
          {chapterStatus === "pending" ? (
            <View
              className="items-center justify-center rounded-2xl border py-10"
              style={{
                borderColor: COLORS.border,
                backgroundColor: COLORS.surface,
              }}
            >
              <ActivityIndicator size="small" color={COLORS.accent} />
              <Text className="mt-2 text-sm" style={{ color: COLORS.textSecondary }}>
                Loading chapters...
              </Text>
            </View>
          ) : (
            <ChapterSelector
              chapters={chapters ?? []}
              selectedChapterId={selectedChapter}
              onSelect={setSelectedChapter}
            />
          )}
          <TouchableOpacity
            onPress={startQuiz}
            activeOpacity={0.85}
            disabled={!activeChapter}
            className="mt-4 w-full rounded-2xl px-4 py-4"
            style={{ backgroundColor: activeChapter ? COLORS.accent : COLORS.border }}
          >
            <Text
              className="text-center text-base font-semibold"
              style={{ color: activeChapter ? COLORS.surface : COLORS.textMuted }}
            >
              Start Quiz
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (status === "loading" || !currentQuestion) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: COLORS.screen }}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text className="mt-3 text-base" style={{ color: COLORS.textSecondary }}>
          Generating fresh questions...
        </Text>
      </View>
    );
  }

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: COLORS.screen }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 32,
          paddingBottom: 140,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          className="rounded-3xl border px-5 py-6"
          style={{
            borderColor: COLORS.border,
            backgroundColor: COLORS.surface,
            shadowColor: "rgba(0,0,0,0.06)",
            shadowOpacity: 0.06,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            elevation: 2,
          }}
        >
          <View className="flex-row items-start justify-between">
            {activeChapter ? (
              <View>
                <Text className="text-xs font-semibold uppercase tracking-wide" style={{ color: COLORS.textMuted }}>
                  {activeChapter.slug}
                </Text>
                <View className="mt-1 flex-row items-center gap-2">
                  <TouchableOpacity onPress={returnToSelection} activeOpacity={0.8}>
                    <Text className="text-[11px] font-semibold" style={{ color: COLORS.textMuted }}>
                      Change
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <Text className="text-sm" style={{ color: COLORS.textSecondary }}>
                Select a chapter
              </Text>
            )}
            <View className="flex-row items-center gap-2">
              <Text className="text-xs font-semibold" style={{ color: COLORS.textSecondary }}>
                {currentStep + 1}/{totalQuestions}
              </Text>
              <View className="h-[6px] w-20 rounded-full" style={{ backgroundColor: COLORS.border }}>
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.max(12, progressRatio * 100)}%`,
                    backgroundColor: COLORS.accent,
                  }}
                />
              </View>
            </View>
          </View>

          <View className="mt-4 rounded-2xl px-4 py-4" style={{ backgroundColor: COLORS.surfaceAlt }}>
            <Text className="text-xs font-medium uppercase tracking-wide" style={{ color: COLORS.textMuted }}>
              {currentQuestion.promptInstruction ?? "Translate this vocabulary"}
            </Text>
            <Text className="mt-2 text-2xl font-semibold" style={{ color: COLORS.textPrimary }}>
              {currentQuestion.promptWord ?? currentQuestion.question}
            </Text>
            {currentQuestion.promptWord && (
              <Text className="mt-2 text-sm" style={{ color: COLORS.textSecondary }}>
                {currentQuestion.question}
              </Text>
            )}
          </View>

          <View className="mt-4">
            {currentQuestion.options.map((option, index) => (
              <OptionCard
                key={index}
                index={index}
                option={option}
                isSelected={userAnswers[currentStep] === index}
                handleAnswer={() => handleAnswer(index)}
                accentColor={COLORS.accent}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: 16,
          paddingBottom: 32,
          paddingTop: 24,
          backgroundColor: COLORS.overlay,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          shadowColor: "rgba(0,0,0,0.15)",
          shadowOpacity: 0.15,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: -6 },
          elevation: 8,
        }}
      >
        <TouchableOpacity
          onPress={isLastQuestion ? handleSubmit : handleNext}
          activeOpacity={0.9}
          disabled={!allAnswered}
          className="w-full rounded-2xl px-4 py-4"
          style={{ backgroundColor: allAnswered ? COLORS.accent : COLORS.border }}
        >
          <Text
            className="text-center text-base font-semibold"
            style={{ color: allAnswered ? COLORS.surface : COLORS.textMuted }}
          >
            {allAnswered ? (isLastQuestion ? "Submit Quiz" : "Next") : "Choose an answer to continue"}
          </Text>
        </TouchableOpacity>
        
      </View>
    </View>
  );
};

export default VocabQuizScreen;
