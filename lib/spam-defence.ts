/**
 * Silent bot defence for public forms.
 *
 * No CAPTCHA and no third-party service: nothing to sign up for, no keys to
 * rotate, and nothing for a real visitor to solve. The checks are layered so
 * that no single one has to be strict enough to hurt a genuine sender.
 *
 * The spam this was built against posts a random-string name and a random
 * -string message with a harvested corporate address, e.g.
 * "Myrdcjoj Hrwqyyuwd" / "nROPZJqUlqLIbmlNzuepZXC". The address is real, so
 * anything keyed on the email alone will not catch it - the giveaway is the
 * text.
 *
 * FALSE POSITIVES ARE THE EXPENSIVE FAILURE. A dropped enquiry is a lost
 * customer, and the sender is never told. So:
 *   - the character checks run only on Latin-script text, or a message in
 *     Chinese, Arabic, Greek or Hebrew would look vowel-less and score as junk
 *   - an unusual name is never enough on its own; plenty of real surnames are
 *     consonant-dense (Krzysztof, Nguyen, Dvorak)
 *   - short messages are not scored at all, because the statistics are
 *     meaningless over a few characters
 *   - blocking needs corroborating signals, not one
 */

/** A field real people never see, and never fill. */
export const HONEYPOT_FIELD = "company_website";

/** When the form was rendered, used to catch instant posts. */
export const FORM_TIMESTAMP_FIELD = "form_started_at";

/**
 * Nobody reads a page, types a name, an address and a message in under this.
 * Deliberately generous - a fast paste-and-send is ~3s, so the floor sits
 * below anything a human plausibly does.
 */
export const MIN_FILL_MS = 2500;

/** A form left open overnight is stale; more likely a replayed payload. */
export const MAX_FORM_AGE_MS = 12 * 60 * 60 * 1000;

const VOWELS = new Set(["a", "e", "i", "o", "u"]);

/**
 * Whether the character-level checks can say anything useful about this text.
 * Latin letters only: other scripts have entirely different vowel and
 * letter-run statistics and would be scored as gibberish.
 */
export function isLatinText(text: string): boolean {
  const letters = text.match(/\p{L}/gu) ?? [];
  if (letters.length === 0) return false;
  const latin = text.match(/[A-Za-z]/g) ?? [];
  return latin.length / letters.length > 0.85;
}

function vowelRatio(word: string): number {
  const letters = word.toLowerCase().match(/[a-z]/g) ?? [];
  if (letters.length === 0) return 1;
  const vowels = letters.filter((c) => VOWELS.has(c)).length;
  return vowels / letters.length;
}

function longestConsonantRun(word: string): number {
  let run = 0;
  let best = 0;
  for (const c of word.toLowerCase()) {
    if (!/[a-z]/.test(c)) {
      run = 0;
      continue;
    }
    // 'y' counts as a vowel here: treating it as a consonant flags ordinary
    // words like "rhythm" and names like "Krzysztof" far too eagerly.
    if (VOWELS.has(c) || c === "y") run = 0;
    else best = Math.max(best, ++run);
  }
  return best;
}

/**
 * Case that changes inside a word in a way typing does not produce -
 * "nROPZJqUlq". Title case, ALL CAPS and camelCase brand names are fine.
 */
function hasErraticCase(word: string): boolean {
  const letters = word.replace(/[^A-Za-z]/g, "");
  if (letters.length < 6) return false;
  if (!/[a-z]/.test(letters) || !/[A-Z]/.test(letters)) return false;

  let switches = 0;
  for (let i = 1; i < letters.length; i++) {
    const prevUpper = letters[i - 1] === letters[i - 1].toUpperCase();
    const currUpper = letters[i] === letters[i].toUpperCase();
    if (prevUpper !== currUpper) switches++;
  }
  // Title case has 1 switch, camelCase a couple. Random case has many.
  return switches >= 4;
}

/** Per-token junk signals. Returns how many fired. */
function tokenSignals(word: string): number {
  const letters = word.replace(/[^A-Za-z]/g, "");
  if (letters.length < 6) return 0;

  let signals = 0;
  if (vowelRatio(letters) < 0.26) signals++;
  if (longestConsonantRun(letters) >= 5) signals++;
  if (hasErraticCase(letters)) signals++;
  // A single unbroken run of letters this long is not a word.
  if (letters.length >= 16) signals++;
  // 'q' without a following 'u' is close to non-existent in English and in
  // European names, but common in random strings ("Hrwqyyuwd"). Qatar, Iraq
  // and Qi are the classic exceptions and are all shorter than the 6-letter
  // floor above, or carry no other signal.
  if (/q(?!u)/i.test(letters)) signals++;
  return signals;
}

/**
 * 0..1, higher is more likely machine-generated. 0 when the text is too short
 * or not Latin script to judge.
 */
export function gibberishScore(text: string): number {
  const trimmed = text.trim();
  if (trimmed.length < 6 || !isLatinText(trimmed)) return 0;

  const words = trimmed.split(/\s+/).filter((w) => /[A-Za-z]{3,}/.test(w));
  if (words.length === 0) return 0;

  const scored = words.map((w) => Math.min(tokenSignals(w), 3) / 3);
  return scored.reduce((s, v) => s + v, 0) / scored.length;
}

export interface SubmissionInput {
  name?: string;
  email?: string;
  message?: string;
  /** Value of the honeypot field, if the form posted one. */
  honeypot?: unknown;
  /** Client timestamp for when the form was rendered. */
  startedAt?: unknown;
  /** Server receipt time; injected for testing. */
  now?: number;
}

export interface SpamVerdict {
  spam: boolean;
  /** Machine-readable reasons, for the server log. */
  reasons: string[];
}

/**
 * Decide whether a submission is automated.
 *
 * The honeypot and the timing check are near-zero false positive, so either
 * alone is decisive. The text checks are not, so they need to agree: a
 * gibberish message on its own is enough only when it is unambiguous, and a
 * gibberish name is never enough by itself.
 */
export function assessSubmission(input: SubmissionInput): SpamVerdict {
  const reasons: string[] = [];

  // 1. Honeypot. A real browser never fills a hidden field.
  if (typeof input.honeypot === "string" && input.honeypot.trim().length > 0) {
    return { spam: true, reasons: ["honeypot"] };
  }

  // 2. Timing. Only judged when the client sent a usable timestamp, so an
  //    older cached page or a stripped field fails open rather than blocking.
  const startedAt = Number(input.startedAt);
  if (Number.isFinite(startedAt) && startedAt > 0) {
    const elapsed = (input.now ?? Date.now()) - startedAt;
    if (elapsed >= 0 && elapsed < MIN_FILL_MS) {
      return { spam: true, reasons: ["too_fast"] };
    }
    if (elapsed > MAX_FORM_AGE_MS) {
      return { spam: true, reasons: ["stale_form"] };
    }
  }

  // 3. Text. Scored together so one odd field cannot drop a real enquiry.
  const message = (input.message ?? "").trim();
  const name = (input.name ?? "").trim();

  // Below ~12 characters the statistics say nothing. Above it a real short
  // message ("Please call me") is made of real short words and scores ~0,
  // while a random string scores ~1 - so the floor can sit low enough to
  // catch a 23-character junk payload.
  const messageScore = message.length >= 12 ? gibberishScore(message) : 0;
  const nameScore = gibberishScore(name);

  if (messageScore >= 0.9) reasons.push("message_gibberish");
  if (messageScore >= 0.5 && nameScore >= 0.5) reasons.push("name_and_message_gibberish");

  return { spam: reasons.length > 0, reasons };
}
