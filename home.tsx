import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Shield, AlertCircle } from "lucide-react";
import { Header } from "@/components/header";
import { AnalysisForm } from "@/components/analysis-form";
import { ResultsDisplay } from "@/components/results-display";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiRequest } from "@/lib/queryClient";
import type { AnalysisResult } from "@shared/schema";

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest("POST", "/api/analyze", { url });
      console.log("API Response:", response);
      return response as AnalysisResult;
    },
    onSuccess: (data) => {
      console.log("Analysis result:", data);
      setResult(data);
    },
  });

  const handleAnalyze = (url: string) => {
    setResult(null);
    analyzeMutation.mutate(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-12 md:py-16" data-testid="section-hero">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center space-y-4 mb-8">
              <div className="flex justify-center mb-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" data-testid="icon-shield" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground" data-testid="heading-title">
                Detector de Fake News
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-description">
                Ferramenta educacional para análise de credibilidade e detecção de possíveis 
                desinformações em sites de notícias
              </p>
            </div>

            <AnalysisForm 
              onAnalyze={handleAnalyze} 
              isLoading={analyzeMutation.isPending}
            />
          </div>
        </section>

        {/* Results Section */}
        <section className="py-12 md:py-16" data-testid="section-results">
          <div className="container mx-auto px-4 max-w-4xl">
            {analyzeMutation.isError && (
              <Alert variant="destructive" className="mb-6" data-testid="alert-error">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Erro ao analisar o site. Verifique se a URL está acessível e tente novamente.
                </AlertDescription>
              </Alert>
            )}

            {result && <ResultsDisplay result={result} />}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-muted/30 mt-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-sm text-foreground">
                  Aviso Educacional
                </h3>
                <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
                  Esta ferramenta utiliza indicadores básicos de credibilidade e não substitui 
                  uma análise profunda de fact-checking. Os resultados são educacionais e devem 
                  ser usados como ponto de partida para verificação crítica de informações.
                </p>
              </div>
              <div className="text-center text-xs text-muted-foreground">
                <p>© 2025 Colégio Educallis - Projeto Educacional</p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
