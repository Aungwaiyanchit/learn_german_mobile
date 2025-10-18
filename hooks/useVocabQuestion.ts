import { VocabQuestionService } from "@/services/VocabQuestionService";
import { useVocabulary } from "@/hooks/useVocabulary";
import { useState } from "react";
import { Question } from "@/types";

export const useVocabQuestion = (id: string | undefined) => {
  const { status, isFetching, refetch } = useVocabulary(id, { enabled: false });
  const [questions, setQuestions] = useState<Question[]>([]);

  const generateQuestions = async () => {
    if (!id) {
      setQuestions([]);
      return;
    }

    setQuestions([]);

    const result = await refetch();
    const list = result.data || [];
    if (list.length === 0) {
      setQuestions([]);
      return;
    }

    const vocabService = new VocabQuestionService(list);
    const randomVocab = [...list]
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);
    const questions = randomVocab.map(
      (vocab) =>
        vocabService.generateQuestion("multiple_choice", vocab) as Question,
    );
    setQuestions(questions);
  };

  return {
    status,
    isFetching,
    questions,
    generateQuestions,
  };
};
