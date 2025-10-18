import * as cheerio from "cheerio";
import type { AnalysisResult, AnalysisIndicator } from "@shared/schema";

// Lista de palavras sensacionalistas em português
const SENSATIONALIST_WORDS = [
  "chocante", "bombástico", "escândalo", "urgente", "inacreditável",
  "polêmico", "exclusivo", "revelado", "exposto", "denúncia",
  "vergonha", "absurdo", "surpreendente", "atenção", "alerta",
  "cuidado", "perigo", "golpe", "fraude", "mentira",
  "destruído", "arrasado", "explodiu", "devastador", "catastrófico"
];

// Padrões de data em português
const DATE_PATTERNS = [
  /\d{1,2}\/\d{1,2}\/\d{2,4}/,  // 01/01/2024
  /\d{1,2}\s+de\s+\w+\s+de\s+\d{4}/i,  // 1 de janeiro de 2024
  /\w+\s+\d{1,2},\s+\d{4}/i,  // Janeiro 1, 2024
];

export async function analyzeUrl(url: string): Promise<AnalysisResult> {
  try {
    // Fetch the URL content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove script and style elements
    $('script, style, noscript').remove();

    // Extract text content
    const bodyText = $('body').text().toLowerCase();
    const title = $('title').text() || $('h1').first().text();
    
    // Initialize indicators
    const indicators: AnalysisIndicator[] = [];

    // 1. Check for author presence
    const hasAuthor = checkForAuthor($);
    indicators.push({
      name: "Autoria Identificada",
      present: hasAuthor,
      description: hasAuthor 
        ? "O artigo possui informação de autoria identificada."
        : "Não foi possível identificar a autoria do conteúdo.",
      weight: 25
    });

    // 2. Check for publication date
    const hasDate = checkForDate($, bodyText);
    indicators.push({
      name: "Data de Publicação",
      present: hasDate,
      description: hasDate
        ? "O artigo possui data de publicação identificada."
        : "Não foi possível identificar a data de publicação.",
      weight: 20
    });

    // 3. Check for cited sources
    const hasSources = checkForSources($);
    indicators.push({
      name: "Fontes Citadas",
      present: hasSources,
      description: hasSources
        ? "O artigo cita fontes ou referências externas."
        : "Não foram identificadas citações ou referências a fontes.",
      weight: 30
    });

    // 4. Detect sensationalist language
    const sensationalistWords = detectSensationalistWords(bodyText + ' ' + title.toLowerCase());
    const hasSensationalism = sensationalistWords.length > 3;
    indicators.push({
      name: "Linguagem Equilibrada",
      present: !hasSensationalism,
      description: hasSensationalism
        ? `Detectadas ${sensationalistWords.length} palavras sensacionalistas no conteúdo.`
        : "A linguagem utilizada parece equilibrada e factual.",
      weight: 25
    });

    // Calculate trust score
    const trustScore = calculateTrustScore(indicators);
    const trustLevel = getTrustLevel(trustScore);

    // Generate detailed findings
    const detailedFindings = generateDetailedFindings($, bodyText, indicators);

    return {
      url,
      trustScore,
      trustLevel,
      indicators,
      sensationalistWords: sensationalistWords.slice(0, 10), // Limit to 10 words
      detailedFindings,
      analyzedAt: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Falha ao analisar o site: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}

function checkForAuthor($: cheerio.CheerioAPI): boolean {
  // Check for common author meta tags and elements
  const authorSelectors = [
    'meta[name="author"]',
    'meta[property="article:author"]',
    '[rel="author"]',
    '.author',
    '.byline',
    '.post-author',
    '[itemprop="author"]'
  ];

  for (const selector of authorSelectors) {
    const element = $(selector);
    if (element.length > 0) {
      const content = element.attr('content') || element.text();
      if (content && content.trim().length > 2) {
        return true;
      }
    }
  }

  // Check for common author text patterns
  const bodyText = $('body').text();
  const authorPatterns = [
    /por\s+[A-Z][a-z]+\s+[A-Z][a-z]+/i,
    /escrito\s+por\s+[A-Z][a-z]+/i,
    /autor:\s*[A-Z][a-z]+/i
  ];

  return authorPatterns.some(pattern => pattern.test(bodyText));
}

function checkForDate($: cheerio.CheerioAPI, bodyText: string): boolean {
  // Check for date meta tags
  const dateSelectors = [
    'meta[property="article:published_time"]',
    'meta[name="publish-date"]',
    'meta[name="date"]',
    'time[datetime]',
    '.publish-date',
    '.post-date',
    '[itemprop="datePublished"]'
  ];

  for (const selector of dateSelectors) {
    const element = $(selector);
    if (element.length > 0) {
      return true;
    }
  }

  // Check for date patterns in text
  return DATE_PATTERNS.some(pattern => pattern.test(bodyText));
}

function checkForSources($: cheerio.CheerioAPI): boolean {
  // Check for external links (excluding social media)
  const links = $('a[href^="http"]');
  const externalLinks = links.filter((_, el) => {
    const href = $(el).attr('href') || '';
    // Exclude social media and common non-source links
    return !href.match(/(facebook|twitter|instagram|youtube|linkedin|whatsapp|telegram)/i);
  });

  if (externalLinks.length > 2) {
    return true;
  }

  // Check for blockquote or citation elements
  const citations = $('blockquote, cite, q, [itemprop="citation"]');
  return citations.length > 0;
}

function detectSensationalistWords(text: string): string[] {
  const foundWords: string[] = [];
  const words = text.toLowerCase().split(/\s+/);
  
  for (const word of words) {
    for (const sensWord of SENSATIONALIST_WORDS) {
      if (word.includes(sensWord) && !foundWords.includes(sensWord)) {
        foundWords.push(sensWord);
      }
    }
  }
  
  return foundWords;
}

function calculateTrustScore(indicators: AnalysisIndicator[]): number {
  let totalWeight = 0;
  let earnedWeight = 0;

  for (const indicator of indicators) {
    totalWeight += indicator.weight;
    if (indicator.present) {
      earnedWeight += indicator.weight;
    }
  }

  return Math.round((earnedWeight / totalWeight) * 100);
}

function getTrustLevel(score: number): "trusted" | "questionable" | "suspicious" {
  if (score >= 70) return "trusted";
  if (score >= 40) return "questionable";
  return "suspicious";
}

function generateDetailedFindings(
  $: cheerio.CheerioAPI,
  bodyText: string,
  indicators: AnalysisIndicator[]
): Array<{ category: string; finding: string; impact: "positive" | "negative" | "neutral" }> {
  const findings: Array<{ category: string; finding: string; impact: "positive" | "negative" | "neutral" }> = [];

  // Check for HTTPS
  const metaOg = $('meta[property="og:url"]').attr('content') || '';
  if (metaOg.startsWith('https://')) {
    findings.push({
      category: "Segurança",
      finding: "O site utiliza conexão segura (HTTPS).",
      impact: "positive"
    });
  }

  // Check for contact information
  const hasContact = $('a[href^="mailto:"]').length > 0 || 
                     bodyText.includes('contato') || 
                     bodyText.includes('email');
  if (hasContact) {
    findings.push({
      category: "Transparência",
      finding: "Informações de contato foram identificadas no site.",
      impact: "positive"
    });
  } else {
    findings.push({
      category: "Transparência",
      finding: "Não foram identificadas informações de contato facilmente acessíveis.",
      impact: "negative"
    });
  }

  // Check for about page
  const hasAbout = $('a[href*="about"], a[href*="sobre"]').length > 0;
  if (hasAbout) {
    findings.push({
      category: "Credibilidade",
      finding: "O site possui uma página 'Sobre' ou 'About'.",
      impact: "positive"
    });
  }

  // Check content length
  const wordCount = bodyText.split(/\s+/).length;
  if (wordCount > 500) {
    findings.push({
      category: "Profundidade",
      finding: `O conteúdo é substancial com aproximadamente ${wordCount} palavras.`,
      impact: "positive"
    });
  } else if (wordCount < 200) {
    findings.push({
      category: "Profundidade",
      finding: "O conteúdo parece ser muito breve para um artigo jornalístico completo.",
      impact: "negative"
    });
  }

  return findings;
}
