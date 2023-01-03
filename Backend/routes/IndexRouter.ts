import { Router } from "express";

export class IndexRouter {
    public router: Router;

    constructor(router: Router) {
        this.router = router;
    }
}
