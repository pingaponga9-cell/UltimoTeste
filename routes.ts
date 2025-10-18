import type { Express } from "express";
import { createServer, type Server } from "http";
import { analyzeUrl } from "./analyzer";
import { analyzeUrlSchema, analysisResultSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/analyze", async (req, res) => {
    try {
      // Validate request body
      const result = analyzeUrlSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          error: "URL inválida",
          details: result.error.errors 
        });
      }

      // Analyze the URL
      const analysis = await analyzeUrl(result.data.url);
      
      // Validate response against schema for type safety
      const validatedAnalysis = analysisResultSchema.parse(analysis);
      
      return res.json(validatedAnalysis);
    } catch (error) {
      console.error("Error analyzing URL:", error);
      return res.status(500).json({ 
        error: error instanceof Error ? error.message : "Erro ao analisar o site"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
