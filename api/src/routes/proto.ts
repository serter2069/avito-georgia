import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();

/**
 * GET /api/proto/pages
 * Returns pageRegistry data as JSON for proto-canvas sync.
 * Reads the TS source file and extracts the array.
 */
router.get('/pages', (_req: Request, res: Response) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://protocanvas.smartlaunchhub.com');

  try {
    const registryPath = path.resolve(__dirname, '../../../../constants/pageRegistry.ts');
    const content = fs.readFileSync(registryPath, 'utf-8');

    // Extract just the array literal from "export const pageRegistry: PageEntry[] = [...];"
    const markerIdx = content.indexOf('export const pageRegistry');
    if (markerIdx === -1) {
      return res.status(500).json({ error: 'pageRegistry not found in source' });
    }

    // Skip past the '=' to avoid matching [] in the type annotation
    const eqIdx = content.indexOf('=', markerIdx);
    const bracketStart = content.indexOf('[', eqIdx);
    if (bracketStart === -1) {
      return res.status(500).json({ error: 'Array start not found' });
    }

    // Find matching closing bracket (respecting string literals)
    let depth = 0;
    let bracketEnd = -1;
    let inString = false;
    let strChar = '';
    for (let i = bracketStart; i < content.length; i++) {
      const c = content[i];
      if (inString) {
        if (c === '\\' && i + 1 < content.length) { i++; continue; }
        if (c === strChar) inString = false;
        continue;
      }
      if (c === "'" || c === '"' || c === '`') { inString = true; strChar = c; continue; }
      if (c === '[') depth++;
      else if (c === ']') {
        depth--;
        if (depth === 0) { bracketEnd = i; break; }
      }
    }

    if (bracketEnd === -1) {
      return res.status(500).json({ error: 'Array end not found' });
    }

    const arrayStr = content.slice(bracketStart, bracketEnd + 1);

    // Eval the array literal (it's plain JS objects, no TS types inside)
    const fn = new Function(`return ${arrayStr}`);
    const pages = fn();

    res.json(pages);
  } catch (err: any) {
    console.error('Proto pages error:', err.message);
    res.status(500).json({ error: 'Failed to load page registry' });
  }
});

export default router;
