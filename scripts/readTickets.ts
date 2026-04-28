import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { globSync } from 'glob';

interface TicketData {
  id: string;
  title: string;
  status: string;
  priority: string;
  project: string;
  owner: string;
  updated: string;
  lease_until: string;
  estimate: string;
  depends_on: string;
  blocked_by: string;
  tags: string[];
  folder: string;
}

const ticketsDir = path.join(process.cwd(), 'docs', 'tickets');
const outputDir = path.join(process.cwd(), 'generated');
const outputFile = path.join(outputDir, 'tickets.json');

function generateTicketsJson() {
  console.log('Scanning tickets directory...');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = globSync(`${ticketsDir}/**/*.md`, { ignore: `${ticketsDir}/archive/**` });
  const tickets: TicketData[] = [];

  for (const file of files) {
    try {
      const fileContent = fs.readFileSync(file, 'utf8');
      const { data } = matter(fileContent);
      const folder = path.basename(path.dirname(file));

      // Basic validation or default mapping
      const ticket: TicketData = {
        id: data.id || path.basename(file, '.md'),
        title: data.title || 'Untitled',
        status: data.status || folder, // Default to folder name if not present
        priority: data.priority || 'medium',
        project: data.project || '',
        owner: data.owner || 'unassigned',
        updated: data.updated || new Date().toISOString(),
        lease_until: data.lease_until || '',
        estimate: data.estimate || '',
        depends_on: data.depends_on || '',
        blocked_by: data.blocked_by || '',
        tags: data.tags || [],
        folder: folder
      };
      tickets.push(ticket);
    } catch (err) {
      console.error(`Error processing file ${file}:`, err);
    }
  }

  fs.writeFileSync(outputFile, JSON.stringify(tickets, null, 2));
  console.log(`Generated ${tickets.length} tickets to ${outputFile}`);
}

generateTicketsJson();
