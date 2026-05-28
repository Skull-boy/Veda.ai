import { GoogleGenerativeAI } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';
import type {
  CreateAssignmentDTO,
  GeneratedPaper,
  GeneratedSection,
  GeneratedQuestion,
  Difficulty,
  QuestionType,
} from '../types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');

function buildPrompt(dto: CreateAssignmentDTO, fileContent?: string): string {
  const questionDetails = dto.questionConfigs
    .map(
      (q) =>
        `  - ${q.count} ${q.type} questions, ${q.marksPerQuestion} marks each`
    )
    .join('\n');

  const fileContext = fileContent
    ? `\n\nReference material (use this as source content for questions):\n---\n${fileContent.slice(0, 3000)}\n---`
    : '';

  return `You are an expert educator creating a formal examination paper.

Assignment Details:
- Title: ${dto.title}
- Subject: ${dto.subject}
- Grade/Class: ${dto.grade}
- Overall Difficulty: ${dto.difficulty}
- Topics: ${dto.topics ?? 'General curriculum topics for this subject and grade'}
- Additional Instructions: ${dto.additionalInstructions ?? 'None'}

Question Requirements:
${questionDetails}

${fileContext}

Generate a complete, well-structured examination paper. 

STRICT OUTPUT FORMAT:
Return ONLY a valid JSON object. No markdown, no explanation, no preamble. The JSON must follow this exact schema:

{
  "title": "string - examination title",
  "subject": "string",
  "grade": "string",
  "totalMarks": number,
  "duration": "string - estimated duration e.g. '2 Hours'",
  "sections": [
    {
      "id": "section-a",
      "title": "Section A",
      "instruction": "Attempt all questions",
      "questions": [
        {
          "id": "q1",
          "text": "Full question text here",
          "type": "mcq|short-answer|long-answer|true-false|fill-blank",
          "difficulty": "easy|medium|hard",
          "marks": number,
          "options": ["A. option1", "B. option2", "C. option3", "D. option4"],
          "answer": "correct answer"
        }
      ],
      "totalMarks": number
    }
  ],
  "generatedAt": "${new Date().toISOString()}"
}

Rules:
1. Group questions by type into sections (MCQ → Section A, Short Answer → Section B, etc.)
2. Each question must be educationally sound, grade-appropriate, and clearly worded
3. Difficulty must be exactly "easy", "medium", or "hard"  
4. Include "options" array only for MCQ and true-false questions
5. Total marks across all sections must equal ${dto.totalMarks}
6. Questions must be original and pedagogically valuable
7. DO NOT include any text outside the JSON object`;
}

export async function generateQuestionPaper(
  dto: CreateAssignmentDTO,
  fileContent?: string
): Promise<GeneratedPaper> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
    },
  });

  const prompt = buildPrompt(dto, fileContent);
  const result = await model.generateContent(prompt);
  const rawText = result.response.text().trim();

  // Extract the JSON object from the response — handles markdown fences and any extra prose
  let jsonText = rawText;
  // Try stripping markdown code fences first
  const fenceMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) {
    jsonText = fenceMatch[1].trim();
  } else {
    // Fall back: find the first { and last } to extract the JSON block
    const firstBrace = rawText.indexOf('{');
    const lastBrace = rawText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      jsonText = rawText.slice(firstBrace, lastBrace + 1).trim();
    } else {
      jsonText = rawText.trim();
    }
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error(`Failed to parse Gemini response as JSON: ${jsonText.slice(0, 200)}`);
  }

  return validateAndNormalizePaper(parsed, dto);
}

/**
 * Validate the parsed response and assign stable UUIDs,
 * ensuring we never pass raw AI data to the frontend without normalization.
 */
function validateAndNormalizePaper(
  raw: Record<string, unknown>,
  dto: CreateAssignmentDTO
): GeneratedPaper {
  if (!raw.sections || !Array.isArray(raw.sections)) {
    throw new Error('Invalid paper structure: missing sections');
  }

  const sections: GeneratedSection[] = (raw.sections as Record<string, unknown>[]).map(
    (sec, sIdx) => {
      const questions: GeneratedQuestion[] = (
        (sec.questions as Record<string, unknown>[]) ?? []
      ).map((q, qIdx) => {
        const difficulty = (['easy', 'medium', 'hard'] as Difficulty[]).includes(
          q.difficulty as Difficulty
        )
          ? (q.difficulty as Difficulty)
          : dto.difficulty;

        const type = (
          ['mcq', 'short-answer', 'long-answer', 'true-false', 'fill-blank'] as QuestionType[]
        ).includes(q.type as QuestionType)
          ? (q.type as QuestionType)
          : 'short-answer';

        return {
          id: uuidv4(),
          text: String(q.text ?? `Question ${qIdx + 1}`),
          type,
          difficulty,
          marks: Number(q.marks) || 1,
          options: Array.isArray(q.options)
            ? (q.options as string[]).map(String)
            : undefined,
          answer: q.answer ? String(q.answer) : undefined,
        };
      });

      const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

      return {
        id: uuidv4(),
        title: String(sec.title ?? `Section ${String.fromCharCode(65 + sIdx)}`),
        instruction: String(sec.instruction ?? 'Attempt all questions'),
        questions,
        totalMarks,
      };
    }
  );

  return {
    title: String(raw.title ?? dto.title),
    subject: String(raw.subject ?? dto.subject),
    grade: String(raw.grade ?? dto.grade),
    totalMarks: Number(raw.totalMarks ?? dto.totalMarks),
    duration: String(raw.duration ?? '2 Hours'),
    sections,
    generatedAt: new Date().toISOString(),
  };
}
