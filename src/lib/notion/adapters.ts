import { BlockObjectRequest } from '@notionhq/client/build/src/api-endpoints';

/**
 * A lightweight adapter that parses basic Markdown strings into an array of
 * compatible Notion Block objects suitable for `notion.blocks.children.append`.
 * 
 * Supports:
 * - Headings (H1, H2, H3)
 * - Lists (ul, ol)
 * - Code blocks
 * - Paragraphs
 */
export function markdownToNotionBlocks(markdown: string): BlockObjectRequest[] {
  if (!markdown) return [];

  const lines = markdown.split('\\n');
  const blocks: BlockObjectRequest[] = [];
  
  let inCodeBlock = false;
  let currentCodeLanguage = 'plain text';
  let currentCodeContent: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Code block toggles
    if (line.startsWith('\`\`\`')) {
      if (inCodeBlock) {
        // End code block
        blocks.push({
          object: 'block',
          type: 'code',
          code: {
            language: (currentCodeLanguage as any) || 'plain text',
            rich_text: [{ type: 'text', text: { content: currentCodeContent.join('\\n').substring(0, 2000) } }],
          },
        });
        inCodeBlock = false;
        currentCodeContent = [];
        currentCodeLanguage = 'plain text';
      } else {
        // Start code block
        inCodeBlock = true;
        const lang = line.slice(3).trim();
        currentCodeLanguage = lang || 'plain text';
      }
      continue;
    }

    if (inCodeBlock) {
      currentCodeContent.push(lines[i]); // Keep original spacing for code
      continue;
    }

    if (!line) {
      continue; // Skip empty lines outside code blocks
    }

    // Headings
    if (line.startsWith('# ')) {
      blocks.push({
        object: 'block',
        type: 'heading_1',
        heading_1: { rich_text: [{ type: 'text', text: { content: line.slice(2) } }] },
      });
    } else if (line.startsWith('## ')) {
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: [{ type: 'text', text: { content: line.slice(3) } }] },
      });
    } else if (line.startsWith('### ')) {
      blocks.push({
        object: 'block',
        type: 'heading_3',
        heading_3: { rich_text: [{ type: 'text', text: { content: line.slice(4) } }] },
      });
    }
    // Unordered List
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: { rich_text: [{ type: 'text', text: { content: line.slice(2) } }] },
      });
    }
    // Ordered List (basic assumption if starts with number dot space)
    else if (/^\\d+\\.\\s/.test(line)) {
      blocks.push({
        object: 'block',
        type: 'numbered_list_item',
        numbered_list_item: { rich_text: [{ type: 'text', text: { content: line.replace(/^\\d+\\.\\s/, '') } }] },
      });
    }
    // Blockquote
    else if (line.startsWith('> ')) {
      blocks.push({
        object: 'block',
        type: 'quote',
        quote: { rich_text: [{ type: 'text', text: { content: line.slice(2) } }] },
      });
    }
    // Default Paragraph fallback
    else {
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: { rich_text: [{ type: 'text', text: { content: line } }] },
      });
    }
  }

  return blocks;
}
