import { Controller, Post, Body, Res, HttpStatus, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors';
import { diskStorage } from 'multer';
import { EmailService } from './email.service';
import * as fs from 'fs';

@Controller('api')
export class EmailController {
    constructor(private readonly emailService: EmailService) {}

    @Post('sendEmail')
    @UseInterceptors(FileInterceptor('attachment',{
        storage: diskStorage({
            destination: './tmp',
            filename:(req, attachment, cb)=>{
                const fileNameSplit = attachment.originalname.split(".");
                const fileExt = fileNameSplit[fileNameSplit.length-1];
                cb(null, `${fileNameSplit[fileNameSplit.length-2]}-${Date.now()}.${fileExt}`);
            }
        }),
    }),
    )
    async sendEmail(@UploadedFile() file, @Body() body, @Res() response): Promise<any>{
        try{
            console.log("EmailController|sendEmail|Request|file:", JSON.stringify(file));
            console.log("EmailController|sendEmail|Request|body:", JSON.stringify(body));
            if(body.emailSubject && body.emailBody && body.emailTo)
            {
                let emailSubject : string = body.emailSubject;
                let emailBody : string = body.emailBody;
                let emailTo : string = body.emailTo;
                let attachmentPath: string = "";
                if(file !== undefined)
                {
                    attachmentPath = file.filename;
                }
                let sendEmailStatus = await this.emailService.sendEmail(emailSubject, emailBody, emailTo, attachmentPath);
                if(file) 
                    fs.unlinkSync(`./tmp/${attachmentPath}`)
                if(sendEmailStatus.status)
                {
                    response.status(HttpStatus.OK)
                    .send(sendEmailStatus); 
                } 
                else{
                    response.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .send(sendEmailStatus); 
                }
            }
            else{
                if(file && file.path)
                    fs.unlinkSync(file.path)
                response.status(HttpStatus.BAD_REQUEST)
                .send({
                    "status": false,
                    "message": "Missing Required field"
                }); 
            }
        }
        catch (error) {
            console.log("EmailController|sendEmail|catch|error: ", JSON.stringify(error.stack))     
            if (file && file.path && fs.existsSync(file.path)) {
                fs.unlinkSync(file.path) 
            }
                    
            response.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .send({
                    "status": false,
                    "message": JSON.stringify(error.stack)
                });
        }
        
        
        
    }
}
