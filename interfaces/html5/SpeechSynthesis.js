declare class SpeechSynthesis {
  getVoices(): Array<any>;
  speak(utterance: SpeechSynthesisUtterance): void;
};
