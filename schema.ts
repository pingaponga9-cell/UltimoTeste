import { z } from "zod";

export const analysisIndicatorSchema = z.object({
  name: z.string(),
  present: z.boolean(),
  description: z.string(),
  weight: z.number()
});

export const analysisResultSchema = z.object({
  url: z.string().url(),
  trustScore: z.number().min(0).max(100),
  trustLevel: z.enum(["trusted", "questionable", "suspicious"]),
  indicators: z.array(analysisIndicatorSchema),
  sensationalistWords: z.array(z.string()),
  detailedFindings: z.array(z.object({
    category: z.string(),
    finding: z.string(),
    impact: z.enum(["positive", "negative", "neutral"])
  })),
  analyzedAt: z.string()
});

export const analyzeUrlSchema = z.object({
  url: z.string().url({ message: "URL inválida" })
});

export type AnalysisIndicator = z.infer<typeof analysisIndicatorSchema>;
export type AnalysisResult = z.infer<typeof analysisResultSchema>;
export type AnalyzeUrl = z.infer<typeof analyzeUrlSchema>;
