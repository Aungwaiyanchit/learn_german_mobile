import { initLlama, LlamaContext } from "llama.rn";
import FS from "react-native-fs2/src";

const DOWNLOAD_URL =
  "https://huggingface.co/lmstudio-community/DeepSeek-R1-Distill-Qwen-1.5B-GGUF/resolve/main/DeepSeek-R1-Distill-Qwen-1.5B-Q3_K_L.gguf";
const MODEL_FILENAME = "llama-model.gguf";
const MODEL_PATH = `${FS.DocumentDirectoryPath}/${MODEL_FILENAME}`;

class LlamaService {
  private context: LlamaContext | null = null;

  private async downloadModel() {
    try {
      const exists = await FS.exists(MODEL_PATH);
      if (exists) return;
      const { promise } = await FS.downloadFile({
        fromUrl: DOWNLOAD_URL,
        toFile: MODEL_PATH,
        progress: (status) => {
          const progress = status.bytesWritten / status.contentLength;
          console.debug("Download progress:", progress);
        },
      });
      await promise;
    } catch (error) {
      console.error("Error downloading Model: ", error);
    }
  }

  private async generateResponse(prompt: string) {
    if (!this.context) {
      console.error("AIService: Model is not ready. Cannot generate.");
      return null;
    }
    try {
      const res = await this.context.completion({
        prompt,
      });
      console.log(res);
    } catch (error) {
      console.error(
        "AIService: Failed to generate or parse JSON response.",
        error,
      );
      return null;
    }
  }

  async initalize() {
    try {
      await this.downloadModel();
      this.context = await initLlama({
        model: MODEL_PATH,
        use_mlock: true,
        n_ctx: 2048,
        n_gpu_layers: 1,
      });
    } catch (error) {
      console.error("Error initializing Model:", error);
    }
  }

  async generateFlashCard(text: string) {
    const prompt = `CONTEXT: You are an expert tutor creating a flashcard from the provided text.\nTEXT: "${text}"\nTASK: Identify a key term, person, or concept and create a flashcard for it.\nFORMAT: Respond with a single JSON object only. No other text.\nJSON FORMAT:\n{\n  "term": "The key term or concept",\n  "definition": "A clear and concise definition of the term."\n}`;
    return this.generateResponse(prompt);
  }

  async cleanup() {
    await this.context?.release();
  }
}

export default new LlamaService();
