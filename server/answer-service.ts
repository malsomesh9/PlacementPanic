import type { Answer, AnswerEvaluation } from "@shared/schema";
import { randomUUID } from "crypto";

/**
 * Answer Service - Handles answer submission and real-time evaluation
 * Provides AI-powered feedback generation and scoring
 */

export class AnswerEvaluator {
  /**
   * Evaluates an answer and provides real-time feedback
   * Simulates AI evaluation with scoring and suggestions
   */
  static async evaluateAnswer(
    answerText: string,
    questionText: string,
    difficulty: string,
    category: string,
    onProgress?: (progress: number) => void
  ): Promise<AnswerEvaluation> {
    const startTime = Date.now();

    // Simulate real-time evaluation with progress updates
    const totalSteps = 5;
    for (let i = 0; i < totalSteps; i++) {
      onProgress?.((((i + 1) / totalSteps) * 100) | 0);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Scoring logic based on answer quality
    const score = this.calculateScore(answerText, questionText, difficulty);
    const feedback = this.generateFeedback(
      answerText,
      questionText,
      score,
      category,
      difficulty
    );
    const { strengths, improvements } =
      this.analyzeAnswer(answerText, difficulty);
    const suggestions = this.generateSuggestions(
      category,
      difficulty,
      improvements
    );

    const evaluationTime = Date.now() - startTime;

    return {
      score,
      feedback,
      strengths,
      improvements,
      suggestions,
      evaluationTime,
    };
  }

  private static calculateScore(
    answerText: string,
    questionText: string,
    difficulty: string
  ): number {
    let score = 50;
    const wordCount = answerText.split(/\s+/).length;
    if (difficulty === "easy") {
      if (wordCount >= 30) score += 20;
      else if (wordCount >= 15) score += 10;
    } else if (difficulty === "medium") {
      if (wordCount >= 60) score += 20;
      else if (wordCount >= 40) score += 10;
    } else {
      if (wordCount >= 100) score += 20;
      else if (wordCount >= 70) score += 10;
    }

    const technicalTerms = this.countTechnicalTerms(answerText);
    score += Math.min(technicalTerms * 3, 15);

    if (
      answerText.includes("\n") ||
      answerText.includes(":") ||
      answerText.includes(";") ||
      answerText.includes(",")
    ) {
      score += 10;
    }

    const questionTerms = questionText
      .split(/\s+/)
      .filter((w) => w.length > 3);
    const relevantTerms = questionTerms.filter((term) =>
      answerText.toLowerCase().includes(term.toLowerCase())
    );
    if (relevantTerms.length > 0) {
      score += Math.min(relevantTerms.length * 5, 15);
    }

    return Math.min(Math.max(score, 0), 100);
  }

  private static countTechnicalTerms(text: string): number {
    const technicalKeywords = [
      "algorithm",
      "time complexity",
      "space complexity",
      "optimization",
      "database",
      "api",
      "async",
      "promise",
      "callback",
      "inheritance",
      "encapsulation",
      "polymorphism",
      "design pattern",
      "microservice",
      "cache",
      "index",
      "query",
      "transaction",
      "concurrency",
      "thread",
    ];

    let count = 0;
    const lowerText = text.toLowerCase();
    for (const keyword of technicalKeywords) {
      if (lowerText.includes(keyword)) count++;
    }
    return count;
  }

  private static generateFeedback(
    answerText: string,
    questionText: string,
    score: number,
    category: string,
    difficulty: string
  ): string {
    const wordCount = answerText.split(/\s+/).length;
    let feedback = "";

    if (score >= 80) {
      feedback = `Excellent answer! You provided a comprehensive response to the ${category} question. Your explanation demonstrates strong understanding.`;
    } else if (score >= 60) {
      feedback = `Good response! Your answer shows solid understanding of the topic.`;
    } else if (score >= 40) {
      feedback = `Your answer covers the basics but could be more detailed.`;
    } else {
      feedback = `Your answer needs improvement. Try including more technical depth and examples.`;
    }

    if (wordCount < 20 && difficulty !== "easy") {
      feedback +="Consider providing more details in your answer.";
    }

    return feedback;
  }

  private static analyzeAnswer(
    answerText: string,
    difficulty: string
  ): {
    strengths: string[];
    improvements: string[];
  } {
    const strengths: string[] = [];
    const improvements: string[] = [];

    if (
      answerText.includes("```") ||
      answerText.includes("{") ||
      answerText.includes("[")
    ) {
      strengths.push("Good: Included code examples or pseudo-code");
    } else if (difficulty !== "easy") {
      improvements.push("Consider adding code examples to illustrate concepts");
    }

    if (answerText.split("\n").length > 3) {
      strengths.push("Good: Well-structured and organized answer");
    } else {
      improvements.push("Try formatting your answer with line breaks for clarity");
    }

    if (
      answerText.toLowerCase().includes("algorithm") ||
      answerText.toLowerCase().includes("complexity") ||
      answerText.toLowerCase().includes("optimization")
    ) {
      strengths.push("Good: Used appropriate technical terminology");
    } else if (difficulty === "medium" || difficulty === "hard") {
      improvements.push("Use more technical terminology specific to the domain");
    }

    if (
      answerText.includes("because") ||
      answerText.includes("therefore") ||
      answerText.includes("this means")
    ) {
      strengths.push("Good: Clear explanations and reasoning");
    } else {
      improvements.push("Explain your reasoning behind key points");
    }

    if (strengths.length === 0) {
      strengths.push("Attempted to answer the question");
    }
    if (improvements.length === 0) {
      improvements.push("Keep practicing with similar questions");
    }

    return { strengths, improvements };
  }

  private static generateSuggestions(
    category: string,
    difficulty: string,
    improvements: string[]
  ): string[] {
    const suggestions: string[] = [];
    suggestions.push(`Practice more ${difficulty} level ${category} questions`);
    suggestions.push("Review resources and documentation for this topic");
    suggestions.push("Explain your answers out loud to practice communication");
    suggestions.push("Mock interviews help - they simulate real interview conditions");

    if (difficulty === "hard") {
      suggestions.push("Work through similar problems step by step");
      suggestions.push("Understand the core concepts before attempting harder variants");
    }

    return suggestions;
  }
}

export interface IAnswerStorage {
  saveAnswer(answer: Omit<Answer, "id" | "submittedAt">): Promise<Answer>;
  updateAnswerEvaluation(answerId: string, evaluation: AnswerEvaluation): Promise<Answer>;
  getAnswersByInterview(interviewId: string): Promise<Answer[]>;
  getAnswer(answerId: string): Promise<Answer | undefined>;
}

export class MemAnswerStorage implements IAnswerStorage {
  private answers: Map<string, Answer> = new Map();

  async saveAnswer(answer: Omit<Answer, "id" | "submittedAt">): Promise<Answer> {
    const id = randomUUID();
    const newAnswer: Answer = {
      ...answer,
      id,
      submittedAt: new Date(),
    };
    this.answers.set(id, newAnswer);
    return newAnswer;
  }

  async updateAnswerEvaluation(answerId: string, evaluation: AnswerEvaluation): Promise<Answer> {
    const answer = this.answers.get(answerId);
    if (!answer) throw new Error(`Answer ${answerId} not found`);

    const updated: Answer = {
      ...answer,
      feedback: evaluation.feedback,
      score: evaluation.score,
      evaluationStatus: "completed",
      evaluatedAt: new Date(),
    };
    this.answers.set(answerId, updated);
    return updated;
  }

  async getAnswersByInterview(interviewId: string): Promise<Answer[]> {
    return Array.from(this.answers.values()).filter(
      (a) => a.interviewId === interviewId
    );
  }

  async getAnswer(answerId: string): Promise<Answer | undefined> {
    return this.answers.get(answerId);
  }
}

export const answerStorage = new MemAnswerStorage();
