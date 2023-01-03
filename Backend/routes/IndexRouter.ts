import { Request, Response, Router } from "express";
import SecurityController from "../controllers/SecurityController";
import registerData from "../interfaces/registerData";
import authResponse from "../interfaces/authResponse";

export class IndexRouter {
    public router: Router;
    private securityController = new SecurityController();

    constructor(router: Router) {
        this.router = router;

        this.router.post('/register', async (req: Request, res: Response): Promise<void> => {
            const body: registerData = req.body;
            const response: authResponse = await this.securityController.register_user(body);
            res.json(response);
        });
    }
}
