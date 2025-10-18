import { CheckCircle2, XCircle, AlertTriangle, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { AnalysisResult } from "@shared/schema";
import { cn } from "@/lib/utils";

interface ResultsDisplayProps {
  result: AnalysisResult;
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  const getTrustConfig = () => {
    if (result.trustLevel === "trusted") {
      return {
        color: "text-chart-2",
        bgColor: "bg-chart-2/10",
        label: "Confiável",
        icon: CheckCircle2,
      };
    } else if (result.trustLevel === "questionable") {
      return {
        color: "text-chart-3",
        bgColor: "bg-chart-3/10",
        label: "Questionável",
        icon: AlertTriangle,
      };
    } else {
      return {
        color: "text-chart-4",
        bgColor: "bg-chart-4/10",
        label: "Suspeito",
        icon: XCircle,
      };
    }
  };

  const config = getTrustConfig();
  const TrustIcon = config.icon;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Trust Score Header */}
      <Card className={cn("border-2", config.bgColor)}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <TrustIcon className={cn("h-8 w-8", config.color)} />
              <div>
                <CardTitle className="text-2xl" data-testid="text-trust-level">
                  {config.label}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Pontuação de Confiabilidade
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className={cn("text-5xl font-bold", config.color)} data-testid="text-trust-score">
                {result.trustScore ?? 0}%
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground" data-testid="text-analyzed-url">
            URL analisada: {result.url}
          </p>
        </CardContent>
      </Card>

      {/* Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(result.indicators || []).map((indicator, index) => (
          <Card 
            key={index} 
            className="hover-elevate transition-all"
            data-testid={`card-indicator-${index}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <CardTitle className="text-base font-semibold">
                    {indicator.name}
                  </CardTitle>
                </div>
                {indicator.present ? (
                  <CheckCircle2 className="h-6 w-6 text-chart-2 flex-shrink-0" />
                ) : (
                  <XCircle className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">
                {indicator.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sensationalist Words */}
      {result.sensationalistWords && result.sensationalistWords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-chart-3" />
              Palavras Sensacionalistas Detectadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2" data-testid="container-sensationalist-words">
              {result.sensationalistWords.map((word, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="text-sm"
                  data-testid={`badge-word-${index}`}
                >
                  {word}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Findings */}
      {result.detailedFindings && result.detailedFindings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Análise Detalhada</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {result.detailedFindings.map((finding, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger 
                    className="hover:no-underline"
                    data-testid={`accordion-trigger-${index}`}
                  >
                    <div className="flex items-center gap-2 text-left">
                      {finding.impact === "positive" && (
                        <CheckCircle2 className="h-4 w-4 text-chart-2 flex-shrink-0" />
                      )}
                      {finding.impact === "negative" && (
                        <XCircle className="h-4 w-4 text-chart-4 flex-shrink-0" />
                      )}
                      {finding.impact === "neutral" && (
                        <AlertTriangle className="h-4 w-4 text-chart-3 flex-shrink-0" />
                      )}
                      <span className="font-medium">{finding.category}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground pl-6">
                      {finding.finding}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
