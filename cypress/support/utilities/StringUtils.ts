export class StringUtils {
  static generateRandomString(
    length: number,
    characters: string = "abcdefghijklmnopqrstuvwxyz"
  ): string {
    return Array.from({ length }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");
  }

  static getCurrentDateStringISOFormat() {
    const currentDate = new Date();
    return currentDate.toISOString().split("T")[0];
  }
}
