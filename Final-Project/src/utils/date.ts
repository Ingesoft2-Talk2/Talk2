/*
 * This file contains utility functions for date formatting.
 * It provides methods to convert dates into ISO strings or readable formats.
 */

/**
 * Formats a given date input into a specified string format.
 *
 * @param input - The date to format, can be a Date object, string, or undefined.
 * @param format - The desired output format, either "iso" or "readable". Defaults to "readable".
 * @returns The formatted date string, or an empty string if input is undefined.
 */
export function formatDate(
  input: Date | string | undefined,
  format: "iso" | "readable" = "readable",
) {
  if (!input) return "";

  const date = input instanceof Date ? input : new Date(input);

  if (format === "iso") {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const h = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${d}T${h}:${min}`;
  }

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hourCycle: "h12",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
}
