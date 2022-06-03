import  { QueryFile } from 'pg-promise';
import path from 'path';

export default function executeQueryFromSqlFile(filePath: string): QueryFile {
    const options = {
        minify: true,
        noWarnings: true
    };

    const qf = new QueryFile(filePath, options);

    if (qf.error) {
        console.error(qf.error); // eslint-disable-line
    }

    return qf;
}
