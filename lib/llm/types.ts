export interface LLMRequest {
  system: string;
  user: string;
  /** Suggested temperature 0..1 */
  temperature?: number;
  /** Maximum output tokens */
  maxTokens?: number;
}

export interface LLMResult {
  text: string;
  modelUsed: string;
}

export type LLMErrorCode = "quota" | "safety" | "missing_key" | "unknown";

export class LLMError extends Error {
  code: LLMErrorCode;
  cause?: unknown;
  constructor(code: LLMErrorCode, message: string, cause?: unknown) {
    super(message);
    this.code = code;
    this.cause = cause;
    this.name = "LLMError";
  }
}
