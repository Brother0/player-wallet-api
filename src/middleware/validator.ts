import { Request, Response, NextFunction } from "express";
import { Validator, ValidationError } from "express-json-validator-middleware";


export default function(error: ValidationError, request: Request, response: Response, next: NextFunction): void {
    response.locals = error;
    next();
    if (error instanceof ValidationError) {
        response.status(400).send(error.validationErrors);
        next();
    } else {
        next(error);
    }
}
