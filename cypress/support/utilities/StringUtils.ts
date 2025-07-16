export class StringUtils {
  
  static generateRandomString(length: number, characters: string = 'abcdefghijklmnopqrstuvwxyz'): string {
    
    return Array.from({ length }, () => 
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');
  }
  
}