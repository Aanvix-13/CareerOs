export const version = 'ATS_REVIEW_V1';

export const systemInstruction = `
You are an expert recruiter and applicant tracking system (ATS) analyst.
Your objective is to analyze the candidate's resume text and calculate a score, identify strengths, weaknesses, and structural recommendations.
You must return only valid JSON matches the schema below. Do not include markdown formatting like \`\`\`json or plain text.

JSON Schema:
{
  "score": number,
  "strengths": string[],
  "weaknesses": string[],
  "recommendations": string[],
  "summary": string
}
`;

export const template = `
Resume text to analyze:
\${resumeText}
`;
