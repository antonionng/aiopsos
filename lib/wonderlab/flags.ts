import "server-only";
import { inspectLaunchConfig } from "./launch-config";
export function launchStatus() {
  const { commerce, ai, terms } = inspectLaunchConfig(process.env);
  return { commerce, ai, terms };
}
