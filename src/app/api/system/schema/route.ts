import { NextResponse } from 'next/server';

export async function GET() {
  const llmDocumentation = `
# LLM API Interop Documentation
Welcome! You can interact and manipulate the core Notion + DB tables by fetching and pushing Markdown/JSON here.

## Base Endpoint
Dynamic Route: \`/api/pages/[type]\`
Valid Types: \`projects\`, \`now\`, \`architecture\`, \`case-studies\`

## Authentication
All \`GET\` and \`POST\` requests require the \`Authorization: Bearer <API_SECRET_KEY>\` header.
The key must match \`INTERNAL_API_KEY\` from the environment.

## GET Requests
Example: \`GET /api/pages/projects\`
Returns a clean JSON array of the latest mapped records from Notion.

## POST Requests
Example: \`POST /api/pages/projects\`
Content-Type: \`application/json\`

Payload expects flat metadata + \`content\` string representing Markdown the new document should hold. The payload will be dual-written to Notion (as native blocks) + local Postgres.

### Common Expected Fields
\`\`\`json
{
  "title": "LLM Generated Project",
  "description": "Short summary here...",
  "status": "In progress",
  "category": "Backend",
  "priority": "high",
  "content": "# Objective\\n\\nThis is a markdown blob translating to Notion blocks!"
}
\`\`\`

### Field Specifics
- **Projects**: \`status\` must be one of \`[ "Not started", "In progress", "Done" ]\`. \`priority\` one of \`[ "low", "medium", "high" ]\`.
- **Architecture**: \`type\` enum is \`'system-design' | 'infrastructure' | 'api-design' | 'data-model' | 'methodology'\`.
- **Case Studies**: \`industry\` enum is \`'tech' | 'finance' | 'healthcare' | 'retail' | 'gaming' | 'other'\`. \`type\` enum is \`'product-design' | 'system-design' | 'ux-research' | 'branding' | 'full-project'\`.
- **Now**: \`status\` defaults to \`'In progress'\`.
`;

  return NextResponse.json({
    message: "Use this documentation to structure your API requests.",
    documentation: llmDocumentation,
    version: "1.0",
  });
}
