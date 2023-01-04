import * as strength from 'strength';
import { User } from "../entity/User";
import registerData from "../interfaces/registerData";
import authResponse from "../interfaces/authResponse";
import { UserI } from "../interfaces/userI";
import loginData from "../interfaces/loginData";
import responseStatus from "../interfaces/responseStatus";
import signJWT from "../jwt/signJWT";

const bcrypt = require('bcrypt');

export default class SecurityController {
    private passwordMinimalStrength: number = 2.5; // Describe password strength from 0 to 5
    private passwordMinimalLength: number = 6; // Minimal password length

    public validateToken(token):{status:boolean} {
        return {status:token.exp>Math.floor(new Date().getTime()/1000)};
    }

    public async login_user(login_data: loginData): Promise<authResponse> {
        let token: string | undefined;
        if (!login_data.email || !login_data.password)
            return this.setErrorResponseForAuth('Enter email and password');
        const user = await User.findOne({where: {email: login_data.email}});
        if (!user || await this.checkPassword(login_data.password, user.password)) {
            return this.setErrorResponseForAuth('User does not exist');
        }
        token = await signJWT(user, ((err, token) => {
            if (err) console.log('Unable to authorize');
        }))
        return this.setSuccessResponseForAuth(user, token);
    }

    public async register_user(register_data: registerData): Promise<authResponse> {
        if (!register_data.email || !register_data.password || !register_data.repeatPassword)
            return this.setErrorResponseForAuth('Enter all data');
        if (!this.emailIsValid(register_data.email))
            return this.setErrorResponseForAuth('Entered email is not valid');
        if (register_data.password !== register_data.repeatPassword)
            return this.setErrorResponseForAuth('Repeat password is not the same');
        if (!this.passwordIsStrong(register_data.password))
            return this.setErrorResponseForAuth('New password is too weak');
        return await this.createUser(register_data);
    }

    public async delete_user(email: string): Promise<responseStatus> {
        const user = await User.findOne({where: {email}});
        if (!user)
            return this.setErrorResponse('User does not exist');
        await User.remove(user);
        return this.setSuccessResponse();
    }

    private setErrorResponse(error: string): responseStatus {
        return {status: 'error', errors: [error]};
    }

    private setSuccessResponse(): responseStatus {
        return {status: 'success', errors: []}
    }

    private setErrorResponseForAuth(error: string): authResponse {
        return {status: 'error', errors: [error], email: null, token: null};
    }

    private setSuccessResponseForAuth(user: UserI, token: string | undefined): authResponse {
        return {status: 'success', errors: [], email: user.email, token: token}
    }

    private emailIsValid(email): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    private async createUser(register_data: registerData): Promise<authResponse> {
        const user = new User();
        user.password = await bcrypt.hash(register_data.password, 10);
        user.email = register_data.email;
        console.log(user);
        try {
            await User.save(user);
            let token;
            console.log(user);
            token = await signJWT(user, ((err, token) => {
                if (err) console.log('Unable to authorize');
            }));
            return this.setSuccessResponseForAuth(user, token);
        } catch (error) {
            console.log(error);
            return this.setErrorResponseForAuth('Email is not unique');
        }
    }

    private passwordIsStrong(password: string): boolean {
        return !(strength(password) < this.passwordMinimalStrength || password.length < this.passwordMinimalLength);
    }

    private async checkPassword(enteredPassword: string, databasePassword: string): Promise<boolean> {
        return !await bcrypt.compare(enteredPassword, databasePassword);
    }
}
