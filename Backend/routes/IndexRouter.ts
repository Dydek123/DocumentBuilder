import { Request, Response, Router, NextFunction } from "express";
import SecurityController from "../controllers/SecurityController";
import registerData from "../interfaces/registerData";
import authResponse from "../interfaces/authResponse";
import loginData from "../interfaces/loginData";
import extractJWT from "../jwt/extractJWT";

export class IndexRouter {
    public router: Router;
    private securityController = new SecurityController();

    constructor(router: Router) {
        this.router = router;

        this.router.get('/validateToken', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            const token = extractJWT(req, res, next)
            res.json(this.securityController.validateToken(token));
        });

        this.router.post('/login', async (req: Request, res: Response): Promise<void> => {
            const body: loginData = req.body;
            const response: authResponse = await this.securityController.login_user(body);
            res.json(response);
        });

        this.router.post('/register', async (req: Request, res: Response): Promise<void> => {
            const body: registerData = req.body;
            const response: authResponse = await this.securityController.register_user(body);
            res.json(response);
        });
    }
}
