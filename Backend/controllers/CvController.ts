import responseStatus from "../interfaces/responseStatus";
import { Style } from "../entity/Style";
import { Template } from "../entity/Template";
import stylesI from "../interfaces/stylesI";
import templateI from "../interfaces/templateI";


export default class CvController {
    public async getStyle(id: number): Promise<stylesI> {
        return Style.findOne({where: {id_style: id}});
    }

    public async getStyles(): Promise<stylesI[]> {
        return Style.find();
    }

    public async createStyle(style: stylesI): Promise<responseStatus> {
        const newStyle = new Style();
        newStyle.font = style.font;
        newStyle.main_color = style.main_color;
        try {
            await Style.save(newStyle);
            return this.setSuccessResponse();
        } catch (e) {
            console.log(e);
            return this.setErrorResponse('Error while adding new style');
        }
    }

    // templates
    public async getTemplates(): Promise<templateI[]> {
        return Template.find();
    }

    public async getTemplate(id:number): Promise<templateI> {
        return Template.findOne({where: {id_template: id}});
    }

    public async createTemplate(template: templateI): Promise<responseStatus> {
        const newTemplate = new Template();
        newTemplate.type = template.type;
        newTemplate.preview = template.preview;
        newTemplate.file = template.file;
        try {
            await Template.save(newTemplate);
            return this.setSuccessResponse();
        } catch (e) {
            console.log(e);
            return this.setErrorResponse('Error while adding new template');
        }
    }

    //Private
    private setErrorResponse(error: string): responseStatus {
        return {status: 'error', errors: [error]};
    }

    private setSuccessResponse(): responseStatus {
        return {status: 'success', errors: []}
    }
}
