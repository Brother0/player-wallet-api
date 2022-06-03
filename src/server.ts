import 'dotenv/config';
import express, { Application } from 'express';
import routes from './routes';
import logger from './middleware/logger';
import validator from './middleware/validator';



export default function createServer(): Application {
    const app: Application = express();

    app.use(logger);
    app.use(express.json());     
    app.use(routes);
    app.use('*',(req, res) => {
        res.status(404).send({
            "info": "Page does not exist try opening the documentation",
            "links": [{
                href: `http://${process.env.SERVER_URL}/api/${process.env.API_VERSION}/docs`
            }]
        })
    });
    app.use(validator);


    return app;
}
