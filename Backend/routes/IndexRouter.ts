import { Request, Response, Router, NextFunction } from "express";
import SecurityController from "../controllers/SecurityController";
import CvController from "../controllers/CvController";
import registerData from "../interfaces/registerData";
import authResponse from "../interfaces/authResponse";
import responseStatus from "../interfaces/responseStatus";
import loginData from "../interfaces/loginData";
import updateData from "../interfaces/updateData";
import detailsI from "../interfaces/detailsI";
import experienceI from "../interfaces/experienceI";
import stylesI from "../interfaces/stylesI";
import templateI from "../interfaces/templateI";
import extractJWT from "../jwt/extractJWT";

export class IndexRouter {
    public router: Router;
    private securityController = new SecurityController();
    private cvController: any = new CvController();

    constructor(router: Router) {
        this.router = router;

        // user
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

        this.router.delete('/removeUser', async (req: Request, res: Response): Promise<void> => {
            const {email} = req.body;
            const response: responseStatus = await this.securityController.delete_user(email);
            res.json(response);
        });

        this.router.put('/updatePassword', async (req: Request, res: Response): Promise<void> => {
            const body: updateData = req.body;
            const response: responseStatus = await this.securityController.updatePassword(body);
            res.json(response);
        });

        // details
        this.router.post('/addDetails', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            const body: detailsI = req.body;
            console.log(body);
            const token = extractJWT(req,res,next);
            console.log(token);
            const response: responseStatus = await this.securityController.add_user_details(body, token.email);
            res.json(response);
        })

        this.router.put('/editDetails/:id', async (req: Request, res: Response): Promise<void> => {
            const body: detailsI = req.body;
            const {id} = req.params;
            const response: responseStatus = await this.securityController.edit_user_details(body, Number(id));
            res.json(response);
        })

        this.router.delete('/deleteDetails/:id', async (req: Request, res: Response): Promise<void> => {
            const {id} = req.params;
            const response: responseStatus = await this.securityController.deleteDetail(Number(id));
            res.json(response);
        })


        this.router.get('/getUserDetails', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            const token = extractJWT(req,res,next);
            res.json(await this.securityController.getListOfUserDetails(token.email));
        })

        this.router.get('/getUserDetails/:id', async (req: Request, res: Response): Promise<void> => {
            const {id} = req.params;
            res.json(await this.securityController.getUserDetail(Number(id)));
        })

        this.router.get('/detailsExists/:id', async (req: Request, res: Response, next:NextFunction): Promise<void> => {
            const {id} = req.params;
            const token = extractJWT(req,res,next);
            res.json(await this.securityController.detailsExist(Number(id), token.email));
        })

        // experience
        this.router.get('/getExperience/:id', async (req: Request, res: Response): Promise<void> => {
            const {id} = req.params
            res.json(await this.securityController.getExperience(Number(id)));
        })

        this.router.post('/addExperience/:id', async (req: Request, res: Response): Promise<void> => {
            const body: experienceI = req.body;
            const {id} = req.params;
            const response: responseStatus = await this.securityController.addNewExperience(body, Number(id));
            res.json(response);
        })

        this.router.put('/editExperience/:id', async (req: Request, res: Response): Promise<void> => {
            const body: experienceI = req.body;
            const {id} = req.params;
            const response: responseStatus = await this.securityController.editExperience(body, Number(id));
            res.json(response);
        })

        this.router.delete('/deleteExperience/:id', async (req: Request, res: Response): Promise<void> => {
            const {id} = req.params;
            const response: responseStatus = await this.securityController.deleteExperience(Number(id));
            res.json(response);
        })

        // styles
        this.router.get('/getStyles', async (req: Request, res: Response): Promise<void> => {
            res.json(await this.cvController.getStyles());
        })

        this.router.post('/newStyle', async (req: Request, res: Response): Promise<void> => {
            const body: stylesI = req.body;
            const response: responseStatus = await this.cvController.createStyle(body);
            res.json(response);
        })

        //Template
        this.router.get('/getTemplates', async (req: Request, res: Response): Promise<void> => {
            res.json(await this.cvController.getTemplates());
        })

        this.router.get('/getTemplate/:id', async (req: Request, res: Response): Promise<void> => {
            const id: number = +req.params.id;
            res.json(await this.cvController.getTemplate(id));
        })

        this.router.post('/newTemplate', async (req: Request, res: Response): Promise<void> => {
            const body: templateI = req.body;
            const response: responseStatus = await this.cvController.createTemplate(body);
            res.json(response);
        })
    }
}
