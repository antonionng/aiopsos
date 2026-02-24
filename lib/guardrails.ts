const PII_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /\b\d{3}-\d{2}-\d{4}\b/, label: "SSN" },
  { pattern: /\b\d{16}\b/, label: "credit card" },
  { pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, label: "credit card" },
  { pattern: /\b[A-Z]{2}\d{6,8}\b/, label: "passport number" },
  { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/, label: "email address" },
  { pattern: /\b(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{4}\b/, label: "phone number" },
  { pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/, label: "IP address" },
  { pattern: /\b[A-Z]{1,2}\d{1,2}\s?\d[A-Z]{2}\b/i, label: "UK postcode" },
  { pattern: /\b\d{5}(-\d{4})?\b/, label: "US ZIP code" },
  { pattern: /\b\d{3}-\d{3}-\d{3}\b/, label: "national ID" },
];

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /you\s+are\s+now\s+/i,
  /system\s*:\s*/i,
  /\<\|im_start\|\>/i,
  /\[INST\]/i,
  /do\s+not\s+follow\s+(any\s+)?previous/i,
  /forget\s+(all\s+)?prior\s+(instructions|context)/i,
  /override\s+(your\s+)?(system|instructions)/i,
  /act\s+as\s+(if|though)\s+you\s+(have\s+)?no\s+restrictions/i,
  /jailbreak/i,
  /DAN\s+mode/i,
];

export interface GuardrailResult {
  passed: boolean;
  blocked: boolean;
  warnings: string[];
  redactedText?: string;
}

function redactPII(text: string): { redacted: string; found: string[] } {
  let redacted = text;
  const found: string[] = [];

  for (const { pattern, label } of PII_PATTERNS) {
    const globalPattern = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g");
    if (globalPattern.test(redacted)) {
      found.push(label);
      redacted = redacted.replace(globalPattern, `[REDACTED ${label.toUpperCase()}]`);
    }
  }

  return { redacted, found };
}

export function checkInput(text: string): GuardrailResult {
  const warnings: string[] = [];
  let blocked = false;

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(text)) {
      warnings.push("Potential prompt injection detected. This request has been blocked.");
      blocked = true;
      break;
    }
  }

  const { redacted, found } = redactPII(text);
  if (found.length > 0) {
    warnings.push(`PII detected and redacted: ${[...new Set(found)].join(", ")}.`);
  }

  return {
    passed: warnings.length === 0,
    blocked,
    warnings,
    redactedText: found.length > 0 ? redacted : undefined,
  };
}

export function checkOutput(text: string): GuardrailResult {
  const warnings: string[] = [];

  const { redacted, found } = redactPII(text);
  if (found.length > 0) {
    warnings.push(`AI response contained PII that was redacted: ${[...new Set(found)].join(", ")}.`);
  }

  return {
    passed: warnings.length === 0,
    blocked: false,
    warnings,
    redactedText: found.length > 0 ? redacted : undefined,
  };
}
