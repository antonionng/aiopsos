/** Allow enough time for a network-family connection attempt on distant APIs. */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { setDefaultAutoSelectFamilyAttemptTimeout } =
      await import("node:net");
    setDefaultAutoSelectFamilyAttemptTimeout(2000);
  }
}
