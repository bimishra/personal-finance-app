/**
 * Custom rule: no-duplicate-page-roots
 * Prevent having both a root page file (e.g. src/pages/Foo.tsx) and a nested canonical page (src/pages/Foo/Foo.tsx)
 * unless the root is a pure alias (single export re-export) with no other statements.
 */
import fs from 'node:fs';
import path from 'node:path';

function isAliasOnly(code) {
  // Allow comments + a single export re-export statement
  const cleaned = code
    .split(/\n/)
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('//'));
  if (cleaned.length !== 1) return false;
  return /^export\s+\{\s*default\s+\}\s+from\s+['"].+['"];?$/.test(cleaned[0]);
}

export const rules = {
  'no-duplicate-page-roots': {
    meta: {
      type: 'problem',
      docs: {
        description: 'Disallow duplicate page implementations; enforce single canonical page with optional alias',
      },
      schema: [],
      messages: {
        duplicate: 'Duplicate page detected: "{{base}}" has both a root file and a nested implementation. Convert root to a pure alias or remove it.',
        rootNotAlias: 'Root page file for "{{base}}" should be a pure alias export when a nested implementation exists.'
      },
    },
    create(context) {
      const filename = context.getFilename();
      if (!filename.replace(/\\/g,'/').includes('/src/pages/')) return {};
      if (!/\.(t|j)sx?$/.test(filename)) return {};

      const pagesDir = path.join(process.cwd(), 'src', 'pages');
      const rel = path.relative(pagesDir, filename);
      if (rel.startsWith('..')) return {};

      // Ignore index files inside folders
      if (/index\.(t|j)sx?$/.test(path.basename(filename))) return {};

      const baseName = path.basename(filename).replace(/\.(t|j)sx?$/, '');
      const nestedPath = path.join(pagesDir, baseName, `${baseName}.tsx`);
      if (fs.existsSync(nestedPath)) {
        // We are either the root or the nested implementation
        const isRootFile = path.dirname(filename) === pagesDir;
        if (isRootFile) {
          const code = context.getSourceCode().text;
          if (!isAliasOnly(code)) {
            context.report({ node: context.getSourceCode().ast, messageId: 'rootNotAlias', data: { base: baseName } });
          }
        } else {
          // We are nested; check if root exists and is not alias only
          const rootFileTsx = path.join(pagesDir, `${baseName}.tsx`);
          const rootFileTs = path.join(pagesDir, `${baseName}.ts`);
          const rootExists = fs.existsSync(rootFileTsx) || fs.existsSync(rootFileTs);
          if (rootExists) {
            const rootPath = fs.existsSync(rootFileTsx) ? rootFileTsx : rootFileTs;
            const rootCode = fs.readFileSync(rootPath, 'utf8');
            if (!isAliasOnly(rootCode)) {
              context.report({ node: context.getSourceCode().ast, messageId: 'duplicate', data: { base: baseName } });
            }
          }
        }
      }
      return {};
    }
  }
};

export default { rules };
