import { Chapter, Vocabulary, Grammar } from "@/types";

const GET = (url: string) => {
  const URL = "https://learn-german-web-9tno.vercel.app/api" + url;
  return fetch(URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });
};

export const fetchChapters = async (): Promise<Chapter[]> => {
  console.log('fetching')
  const response = await GET("/chapters");
  if (!response.ok) {
    throw new Error("Failed to fetch chapters " + response.statusText);
  }
  const result = await response.json();
  return result;
};

export const fetchVocabulary = async (
  chapterId: string,
): Promise<Vocabulary[]> => {
  if (!chapterId) throw new Error("Failed to fetch");
  const response = await GET(`/vocabulary/${chapterId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch vocabulary " + response.statusText);
  }
  const result = await response.json();
  return result;
};

export const fetchGrammar = async (): Promise<Grammar[]> => {
  const response = await GET("/grammar");
  if (!response.ok) {
    throw new Error("Failed to fetch grammar " + response.statusText);
  }
  const result = await response.json();
  return result;
};
