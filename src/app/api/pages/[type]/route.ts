import { NextResponse } from 'next/server';
import { validateApiKey, unauthorizedResponse } from '@/lib/auth/api-key';
import { getProjects } from '@/lib/notion/projects';
import { getArchitectureDocs } from '@/lib/notion/architecture';
import { getCaseStudies } from '@/lib/notion/case-studies';
import { getNowPageData } from '@/lib/notion/now';
import { notion } from '@/lib/notion/client';
import { markdownToNotionBlocks } from '@/lib/notion/adapters';
import { db } from '@/lib/db';
import { projects, nowPages, architectureDocs, caseStudies } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

type PageType = 'projects' | 'now' | 'architecture' | 'case-studies';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  if (!validateApiKey(request)) return unauthorizedResponse();

  const resolvedParams = await params;
  const type = resolvedParams.type as PageType;
  
  try {
    let data;
    switch (type) {
      case 'projects':
        data = await getProjects();
        break;
      case 'architecture':
        data = await getArchitectureDocs();
        break;
      case 'case-studies':
        data = await getCaseStudies();
        break;
      case 'now':
        data = await getNowPageData();
        break;
      default:
        return NextResponse.json({ error: 'Invalid type. Allowed: projects, now, architecture, case-studies' }, { status: 400 });
    }
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  if (!validateApiKey(request)) return unauthorizedResponse();

  const resolvedParams = await params;
  const type = resolvedParams.type as PageType;
  const body = await request.json();

  if (!body.title) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 });
  }
  
  const contentTokens = markdownToNotionBlocks(body.content || '');

  try {
    let notionResponse;
    let databaseId = '';
    let props: any = {
      Name: { title: [{ text: { content: body.title } }] },
    };

    if (type === 'projects' || type === 'now') {
      databaseId = process.env.NOTION_PROJECTS_DATABASE_ID!;
      props = {
        'Project name': { title: [{ text: { content: body.title } }] },
        'Slug': { rich_text: [{ text: { content: body.slug || body.title.toLowerCase().replace(/\+/g, '-') } }] },
        'Description': { rich_text: [{ text: { content: body.description || '' } }] },
        'Status': { status: { name: body.status || (type === 'now' ? 'In progress' : 'Not started') } },
        'Category': { select: { name: body.category || 'Other' } },
        'Priority': { select: { name: body.priority || 'medium' } },
      };
    } else if (type === 'architecture') {
      databaseId = process.env.NOTION_ARCHITECTURE_DATABASE_ID!;
      props['Slug'] = { rich_text: [{ text: { content: body.slug || body.title.toLowerCase().replace(/\+/g, '-') } }] };
      props['Description'] = { rich_text: [{ text: { content: body.description || '' } }] };
      props['Type'] = { select: { name: body.type || 'system-design' } };
    } else if (type === 'case-studies') {
      databaseId = process.env.NOTION_CASE_STUDIES_DATABASE_ID!;
      props['Slug'] = { rich_text: [{ text: { content: body.slug || body.title.toLowerCase().replace(/\+/g, '-') } }] };
      props['Description'] = { rich_text: [{ text: { content: body.description || '' } }] };
      props['Industry'] = { select: { name: body.industry || 'tech' } };
      props['Type'] = { select: { name: body.type || 'full-project' } };
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    if (!databaseId) throw new Error(`Database ID for ${type} not configured`);

    // 1. Create in Notion
    notionResponse = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: props,
      children: contentTokens as any,
    });

    const notionId = notionResponse.id;
    const commonSlug = body.slug || body.title.toLowerCase().replace(/\+/g, '-');

    // 2. Dual Write to Postgres
    if (type === 'projects') {
      await db.insert(projects).values({
        id: uuidv4(),
        slug: commonSlug,
        title: body.title,
        description: body.description,
        status: body.status || 'Not started',
        category: body.category || 'Other',
        content: body.content,
        priority: body.priority || 'medium',
        source: 'notion',
        notionId,
      }).onConflictDoNothing();
    } else if (type === 'now') {
      await db.insert(nowPages).values({
        id: uuidv4(),
        slug: commonSlug,
        title: body.title,
        description: body.description,
        status: body.status || 'In progress',
        category: body.category,
        content: body.content,
        source: 'notion',
        notionId,
      }).onConflictDoNothing();
    } else if (type === 'architecture') {
      await db.insert(architectureDocs).values({
        id: uuidv4(),
        slug: commonSlug,
        title: body.title,
        description: body.description,
        type: body.type || 'system-design',
        content: body.content,
        source: 'notion',
        notionId,
      }).onConflictDoNothing();
    } else if (type === 'case-studies') {
      await db.insert(caseStudies).values({
        id: uuidv4(),
        slug: commonSlug,
        title: body.title,
        description: body.description,
        industry: body.industry || 'tech',
        type: body.type || 'full-project',
        content: body.content,
        source: 'notion',
        notionId,
      }).onConflictDoNothing();
    }

    return NextResponse.json({
      message: `Successfully created ${type} item`,
      notionId,
      slug: commonSlug,
    });
  } catch (error: any) {
    console.error('Notion API/DB error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
