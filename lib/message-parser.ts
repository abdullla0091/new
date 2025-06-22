export function parseMessage(message: string): string[] {
  // Split message into paragraphs and filter out empty lines
  return message
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
} 