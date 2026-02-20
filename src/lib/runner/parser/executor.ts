import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { genParserInterfaceString, genParserVarInit, type WebhookPayload } from './types';


export function executeSnippetWithPayload(
  userCode: string,
  webhookPayload: WebhookPayload,
  tempDir: string
): string {
  // Inject the payload with proper TypeScript typing
  const injectedCode = `
${genParserInterfaceString()}

${genParserVarInit(webhookPayload)}

${userCode}

console.log(''); // have a blank line from user stuff
console.log(JSON.stringify(result));
`;

  const snippetPath = path.join(tempDir, `snippet_${Date.now()}.ts`);
  fs.writeFileSync(snippetPath, injectedCode);

  try {
    const result = execSync(`deno run --allow-all ${snippetPath}`, { encoding: 'utf-8' });
    return result;
  } finally {
    fs.unlinkSync(snippetPath);
  }
}
