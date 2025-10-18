import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { analyzeUrlSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface AnalysisFormProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export function AnalysisForm({ onAnalyze, isLoading }: AnalysisFormProps) {
  const [url, setUrl] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = analyzeUrlSchema.safeParse({ url });
    
    if (!result.success) {
      toast({
        title: "URL inválida",
        description: "Por favor, insira uma URL válida (ex: https://exemplo.com)",
        variant: "destructive",
      });
      return;
    }
    
    onAnalyze(url);
  };

  return (
    <Card className="shadow-lg border-card-border" data-testid="card-analysis-form">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4" data-testid="form-analyze">
          <div className="space-y-2">
            <label htmlFor="url-input" className="text-sm font-medium text-foreground">
              URL do Site
            </label>
            <div className="flex gap-3">
              <Input
                id="url-input"
                type="url"
                placeholder="Digite a URL do site para análise..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isLoading}
                className="flex-1 text-base"
                data-testid="input-url"
              />
              <Button 
                type="submit" 
                disabled={isLoading || !url.trim()}
                className="min-w-[120px]"
                data-testid="button-analyze"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" data-testid="icon-loading" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Analisar
                  </>
                )}
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground" data-testid="text-helper">
            Insira a URL completa de um site de notícias para verificar indicadores de credibilidade.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
