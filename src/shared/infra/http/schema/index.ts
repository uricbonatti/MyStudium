import path from 'path';
import { loadFiles } from '@shared/utils/graphqlImportFiles';

export default loadFiles('src/**/infra/http/schema/*.gql');
