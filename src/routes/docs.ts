import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const router = Router();

const options = {
    definition: {
        "openapi": "3.0.0",
        "components": {
            "securitySchemes": {
                "basicAuth": {
                    "type": "http",
                    "scheme": "basic"
                }
            }
        },
        "security": [{
            "basicAuth": []
        }],
        "info": {
            "title": "Player wallet API",
            "description": "An API that stores balances for players and allows bets and wins inside play sessions.",
            "version": `${process.env.API_VERSION}`
        },
        "contact": {
            "name": "Tomaž Bratanič"
        },
        "servers": [
            {
                "url": `http://${process.env.SERVER_URL}/api/${process.env.API_VERSION}`
            }
        ],
        "schemas": [
            "http"
        ]
    },
    apis: ['./src/routes/*.ts'],
};

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerJSDoc(options)));

export default router;
