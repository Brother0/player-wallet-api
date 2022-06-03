import 'dotenv/config';
import { Application } from 'express';
import createServer from './server';

function startServer(): void {
    const app: Application = createServer();
    const port: number = parseInt(<string>process.env.PORT, 10);
    app.listen(port, () => {
        console.log(`server running on port ${port}`); // eslint-disable-line
    });
}

startServer();
