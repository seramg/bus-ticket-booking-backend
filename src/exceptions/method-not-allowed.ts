import { ErrorCode, HttpException } from "./root";

export class MethodNotAllowed extends HttpException {
    constructor(message: string, errorCode:ErrorCode, errors?:any) {
        super(message, errorCode, 405, errors);
    }
}