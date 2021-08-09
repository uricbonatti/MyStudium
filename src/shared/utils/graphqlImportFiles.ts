import fs from 'fs';
import path from 'path';
import glob from 'fast-glob';
import { DocumentNode } from 'graphql';
import { mergeTypeDefs } from 'graphql-tools';

export function loadFile(pathFile: string): string {
  return fs.readFileSync(path.join(process.cwd(), pathFile), 'utf8');
}

export function loadFiles(pathFiles: string): DocumentNode {
  const files = glob.sync(pathFiles);
  const schema = files.map(file =>
    fs.readFileSync(path.join(process.cwd(), file), 'utf8'),
  );
  return mergeTypeDefs(schema);
}

export default { loadFile, loadFiles };
