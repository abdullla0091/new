export function parseMessage(message: string): string[] {
  // First, normalize line breaks
  const normalizedMessage = message.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  // Split message into paragraphs (double newlines)
  let paragraphs: string[] = [];
  
  // Check if there are double newlines
  if (normalizedMessage.includes('\n\n')) {
    paragraphs = normalizedMessage.split('\n\n');
  } else {
    // Split by single newlines if no double newlines exist
    const lines = normalizedMessage.split('\n');
    
    // Group consecutive lines into paragraphs
    let currentParagraph = "";
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // If line starts with list marker, treat as new paragraph
      if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
        if (currentParagraph) {
          paragraphs.push(currentParagraph);
          currentParagraph = "";
        }
        paragraphs.push(trimmedLine);
      } 
      // Otherwise append to current paragraph
      else if (trimmedLine) {
        if (currentParagraph) {
          currentParagraph += " " + trimmedLine;
        } else {
          currentParagraph = trimmedLine;
        }
      }
    }
    
    // Add the last paragraph if not empty
    if (currentParagraph) {
      paragraphs.push(currentParagraph);
    }
  }
  
  // Filter out empty paragraphs and return
  return paragraphs
    .map(p => p.trim())
    .filter(p => p.length > 0);
} 