import WebSocket from "ws";
import { NARRATION_MODEL, NARRATION_VOICE } from "../lib/wonderlab/narration.ts";

export function normaliseTranscript(text: string) {
  const small = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  return text.toLowerCase()
    .replace(/(\d)\s*[–-]\s*(?=\d)/g, "$1 to ")
    .replace(/\b\d{1,2}\b/g, (digits) => {
      const n = Number(digits);
      return n < 20 ? small[n] : `${tens[Math.floor(n / 10)]}${n % 10 ? ` ${small[n % 10]}` : ""}`;
    })
    .replace(/\b([ap])\.?\s*m\.?\b/g, "$1m")
    .replace(/['’‘]/g, "")
    .replace(/[^a-z0-9]+/g, " ").trim();
}

// Publishing only: the input is authored curriculum, never a child's information.
export function recordNarration(apiKey: string, text: string, young: boolean) {
  return new Promise<{ pcm: Buffer; transcript: string }>((resolve, reject) => {
    const socket = new WebSocket(
      `wss://api.openai.com/v1/realtime?model=${NARRATION_MODEL}`,
      { headers: { Authorization: `Bearer ${apiKey.trim()}` } },
    );
    const chunks: Buffer[] = [];
    let transcript = "";
    let settled = false;
    const finish = (error?: Error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      socket.close();
      if (error) reject(error);
      else resolve({ pcm: Buffer.concat(chunks), transcript });
    };
    const timer = setTimeout(() => {
      finish(new Error("Voice recording timed out"));
      socket.terminate();
    }, 90000);
    socket.on("error", () => finish(new Error("Voice connection failed")));
    socket.on("close", () => finish(new Error("Voice connection closed before completion")));
    socket.on("open", () => socket.send(JSON.stringify({
      type: "session.update",
      session: {
        type: "realtime",
        output_modalities: ["audio"],
        audio: { output: {
          voice: NARRATION_VOICE,
          format: { type: "audio/pcm", rate: 24000 },
        } },
      },
    })));
    socket.on("message", (raw) => {
      try {
        const event = JSON.parse(raw.toString());
        if (event.type === "session.updated") socket.send(JSON.stringify({
          type: "response.create",
          response: {
            conversation: "none",
            input: [],
            instructions: `You are recording narration for Wonderlab, a learning game. Use a warm, natural British English accent, clear diction and gentle enthusiasm. ${young ? "Speak to a child aged four to six at an unhurried pace, with short pauses between instructions and no baby talk." : "Speak conversationally at a steady pace. Do not sound babyish, theatrical or like an advertisement."} Read the supplied script verbatim. Do not answer questions in it, add words or introduce yourself.\n\nSCRIPT:\n${text}`,
          },
        }));
        if (event.type === "response.output_audio.delta")
          chunks.push(Buffer.from(event.delta, "base64"));
        if (event.type === "response.output_audio_transcript.done")
          transcript = event.transcript;
        if (event.type === "error")
          finish(new Error(`Voice API error: ${event.error?.code ?? "unknown"}`));
        if (event.type === "response.done") {
          if (event.response.status !== "completed" || !chunks.length)
            finish(new Error("Voice response did not complete"));
          else if (normaliseTranscript(transcript) !== normaliseTranscript(text))
            finish(new Error(`Narration differed from the script: ${JSON.stringify(transcript)}`));
          else finish();
        }
      } catch (error) {
        finish(error instanceof Error ? error : new Error("Invalid voice response"));
      }
    });
  });
}
