export type Alphabet = {
  letter: string;
  audio_url: string;
  pronunciation: string;
};

export type Chapter = {
  id: string;
  title: string;
  slug: string;
  colorTag: string;
};

export type Vocabulary = {
  id: string;
  chapterId: string;
  term: string;
  translation: string;
  article: string;
};

export type Grammar = {
  id: string;
  title: string;
  markdownContent: string;
  description: string;
  level: string;
  url: string;
};

export type Question = {
  type: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  promptWord?: string;
  promptInstruction?: string;
};
