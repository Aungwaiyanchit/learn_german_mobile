import { Question, Vocabulary } from "@/types";

export class VocabQuestionService {
  private vocabItems: Vocabulary[];

  private static QUESTION_TEMPLATES = [
    {
      instruction: "Choose the correct translation",
      promptDetail: "Tap the option that best matches this word.",
    },
    {
      instruction: "Translate this vocabulary",
      promptDetail: "Select the meaning that fits the given term.",
    },
    {
      instruction: "Do you remember this one?",
      promptDetail: "Pick the translation you think is correct.",
    },
  ];

  constructor(vocabItems: Vocabulary[]) {
    this.vocabItems = vocabItems;
  }

  generateQuestion(type: string, correctItem: Vocabulary): Question | null {
    switch (type) {
      case "multiple_choice":
        return this.generateMultipleChoices(correctItem, "term_to_translation");
      default:
        return null;
    }
  }

  private generateMultipleChoices(correctItem: Vocabulary, direction: string): Question {
    const distractors = this.vocabItems
      .filter((item) => item.id !== correctItem.id)
      .map((item) =>
        direction === "term_to_translation" ? item.translation : item.term,
      );

    // Need at least 3 distractors to make a good multiple-choice question
    if (distractors.length < 3) {
      console.warn(
        "Not enough vocabulary items to generate multiple choice questions.",
      );
    }

    const shuffledDistractors = distractors.sort(() => 0.5 - Math.random());
    const selectedDistractors = shuffledDistractors.slice(0, 3);

    const options = [
      direction === "term_to_translation"
        ? correctItem.translation
        : correctItem.term,
      ...selectedDistractors,
    ].sort(() => 0.5 - Math.random());

    const correctAnswerIndex = options.findIndex(
      (option) =>
        option ===
        (direction === "term_to_translation"
          ? correctItem.translation
          : correctItem.term),
    );

    const template = VocabQuestionService.pickQuestionTemplate(direction);

    return {
      type: "multiple_choice",
      question: template.promptDetail,
      promptInstruction: template.instruction,
      promptWord:
        direction === "term_to_translation"
          ? correctItem.term
          : correctItem.translation,
      options,
      correctAnswerIndex,
    };
  }

  private static pickQuestionTemplate(direction: string) {
    const baseTemplates = VocabQuestionService.QUESTION_TEMPLATES;
    const randomIndex = Math.floor(Math.random() * baseTemplates.length);
    const template = baseTemplates[randomIndex];

    if (direction === "term_to_translation") {
      return {
        instruction: `${template.instruction} (English)`,
        promptDetail: template.promptDetail,
      };
    }

    return {
      instruction: `${template.instruction} (German)`,
      promptDetail: template.promptDetail,
    };
  }
}
