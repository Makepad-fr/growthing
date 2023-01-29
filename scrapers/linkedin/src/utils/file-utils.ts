import { existsSync } from 'fs';

/**
 * Check if a given file exists or not
 * @param filePath The path of the file to check
 * @return true if the given file exists, false if not
 */
export function isFileExists(filePath: string): boolean {
  return existsSync(filePath);
}
