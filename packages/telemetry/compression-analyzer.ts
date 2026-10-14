/**
 * Leveonas LM Compression Breakdown Analyzer
 *
 * Deconstructs the exact source of token and byte savings between standard
 * frontend representations and Leveonas Markup (LM).
 *
 * Quantifies savings across:
 * 1. Tag name abbreviations (div -> di, button -> bo, etc.)
 * 2. Attribute name abbreviations (class -> cs, href -> hr, etc.)
 * 3. Elimination of closing tags (</div> -> single closing paren ')')
 * 4. Framework boilerplate elimination (imports, decorators, setup boilerplate)
 * 5. Punctuation & delimiter compression (< > / " = -> ( : " ))
 */

export interface CompressionFactorMetrics {
  normalChars: number;
  leveonasChars: number;
  savedChars: number;
  savingsPercent: number;
  estimatedTokenSavings: number;
}

export interface CompressionBreakdown {
  tagSavings: CompressionFactorMetrics;
  closingTagSavings: CompressionFactorMetrics;
  attributeSavings: CompressionFactorMetrics;
  boilerplateSavings: CompressionFactorMetrics;
  delimiterSavings: CompressionFactorMetrics;
  totalSavings: {
    normalTotalBytes: number;
    leveonasTotalBytes: number;
    savedBytes: number;
    savingsPercent: number;
  };
  dominantFactors: string[];
}

export class LMCompressionAnalyzer {
  /**
   * Analyzes an equivalent pair of standard code vs LM code to produce a fine-grained
   * breakdown of where token/byte savings originate.
   */
  static analyze(normalCode: string, leveonasLM: string): CompressionBreakdown {
    const normalBytes = Buffer.byteLength(normalCode, 'utf8');
    const leveonasBytes = Buffer.byteLength(leveonasLM, 'utf8');

    // 1. Closing tag analysis
    const closingTagMatches = normalCode.match(/<\/[a-zA-Z0-9_-]+>/g) || [];
    const closingTagCharsNormal = closingTagMatches.reduce((acc, tag) => acc + tag.length, 0);
    // In LM, closing tags are replaced by single closing parentheses ')'
    const closingTagCharsLM = closingTagMatches.length; // 1 char ')' per closed block
    const closingTagSaved = Math.max(0, closingTagCharsNormal - closingTagCharsLM);

    // 2. Opening tag and abbreviation analysis
    const openingTagMatches = normalCode.match(/<([a-zA-Z0-9_-]+)[\s>]/g) || [];
    let tagCharsNormal = 0;
    let tagCharsLM = 0;
    for (const match of openingTagMatches) {
      const rawTag = match.replace(/[<\s>]/g, '');
      tagCharsNormal += rawTag.length;
      // Canonical LM abbreviations (div->di: 3->2, button->bo: 6->2, section->so: 7->2, etc.)
      if (['div', 'button', 'section', 'article', 'header', 'footer', 'nav', 'main', 'span', 'input', 'label', 'form', 'table'].includes(rawTag)) {
        tagCharsLM += 2;
      } else {
        tagCharsLM += rawTag.length;
      }
    }
    const tagSaved = Math.max(0, tagCharsNormal - tagCharsLM);

    // 3. Attribute abbreviation analysis
    const attrMatches = normalCode.match(/\b(class|className|href|src|type|placeholder|name|value|onClick|onChange)\s*=/g) || [];
    let attrCharsNormal = 0;
    let attrCharsLM = 0;
    for (const match of attrMatches) {
      attrCharsNormal += match.length;
      // In LM: class="..." -> cs:"..." (2 chars + colon vs 6-9 chars)
      attrCharsLM += 3;
    }
    const attrSaved = Math.max(0, attrCharsNormal - attrCharsLM);

    // 4. Framework boilerplate analysis
    const boilerplateMatches = normalCode.match(
      /(?:import\s+[\s\S]*?from\s+['"].*?['"];?|export\s+default\s+function[\s\S]*?\(.*?\)\s*\{|@Component\s*\(.*?\)|<script\s+setup.*?>|<\/script>|<style.*?>|<\/style>|const\s+\[.*?\]\s*,\s*set.*?=\s*useState\(.*?\);?)/g
    ) || [];
    const boilerplateCharsNormal = boilerplateMatches.reduce((acc, m) => acc + m.length, 0);
    // In LM: boilerplate is minimized to component(Name)(state(...) ...)
    const boilerplateCharsLM = Math.round(boilerplateCharsNormal * 0.22);
    const boilerplateSaved = Math.max(0, boilerplateCharsNormal - boilerplateCharsLM);

    // 5. Delimiters and syntax punctuation (< > " = vs ( : ))
    const normalDelims = (normalCode.match(/[<>\/="]/g) || []).length;
    const lmDelims = (leveonasLM.match(/[():"]/g) || []).length;
    const delimiterSaved = Math.max(0, normalDelims - lmDelims);

    const makeFactor = (normalChars: number, lmChars: number): CompressionFactorMetrics => {
      const saved = Math.max(0, normalChars - lmChars);
      return {
        normalChars,
        leveonasChars: lmChars,
        savedChars: saved,
        savingsPercent: normalChars > 0 ? Number(((saved / normalChars) * 100).toFixed(1)) : 0,
        estimatedTokenSavings: Math.round(saved / 3.8), // ~3.8 chars per token in code
      };
    };

    const savedBytes = Math.max(0, normalBytes - leveonasBytes);
    const savingsPercent = normalBytes > 0 ? Number(((savedBytes / normalBytes) * 100).toFixed(1)) : 0;

    const factors: { name: string; saved: number }[] = [
      { name: 'Elimination of HTML closing tags', saved: closingTagSaved },
      { name: 'Tag name abbreviations (div->di, button->bo)', saved: tagSaved },
      { name: 'Attribute abbreviations (class->cs, href->hr)', saved: attrSaved },
      { name: 'Framework boilerplate compression', saved: boilerplateSaved },
      { name: 'Punctuation & delimiter compactness', saved: delimiterSaved },
    ].sort((a, b) => b.saved - a.saved);

    const dominantFactors = factors.slice(0, 3).map((f) => f.name);

    return {
      tagSavings: makeFactor(tagCharsNormal, tagCharsLM),
      closingTagSavings: makeFactor(closingTagCharsNormal, closingTagCharsLM),
      attributeSavings: makeFactor(attrCharsNormal, attrCharsLM),
      boilerplateSavings: makeFactor(boilerplateCharsNormal, boilerplateCharsLM),
      delimiterSavings: makeFactor(normalDelims, lmDelims),
      totalSavings: {
        normalTotalBytes: normalBytes,
        leveonasTotalBytes: leveonasBytes,
        savedBytes,
        savingsPercent,
      },
      dominantFactors,
    };
  }
}
