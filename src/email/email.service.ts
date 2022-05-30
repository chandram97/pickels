import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';


@Injectable()
export class EmailService {
    async sendEmail(emailSubject: string, emailBody: string, emailTo: string, attachmentPath: string): Promise<any> {
        
        return new Promise((resolve,reject)=>{
            try{
                console.log(attachmentPath)
                let transporter = nodemailer.createTransport({
                    service: 'Mailgun',
                    auth: {
                    user: 'postmaster@sandbox0059f3de3d5d4d39a4962ed3a910e7fb.mailgun.org',
                    pass: '8797b822b0f0c4e96042a8a2b98b0fed-8d821f0c-3c69034e'
                    }
                });
                
                let mailPayload = {
                    from: 'postmaster@sandbox0059f3de3d5d4d39a4962ed3a910e7fb.mailgun.org',
                    to: emailTo,
                    subject: emailSubject,
                    text : emailBody,
                    html : emailBody,
                    attachments: null
                };
                if(attachmentPath)
                {
                    mailPayload.attachments = [{
                        filename: attachmentPath,
                        path: `./tmp/${attachmentPath}`
                    }]
                }
    
                transporter.sendMail(mailPayload, function (error, response) {
                    if (error) {
                        console.log("EmailService|sendEmail|Response|error:", JSON.stringify(error.stack))
                        resolve({
                            "status": false,
                            "message": JSON.stringify(error.stack)
                        })
                    }
                    else{
                        console.log("EmailService|sendEmail|Response|response:", JSON.stringify(response))
                        if(response.response === "250 Great success")
                        {
                            resolve({
                                "status": true,
                                "message": "Email Send Successfully"
                            })
                        }
                        else{
                            resolve({
                                "status": false,
                                "message": `email failed with message ${response.response}`
                            });
                        }
                    }
                });
            }
            catch (error) {
                console.log("EmailService|sendEmail|catch|error: ", JSON.stringify(error.stack))              

                reject({
                    "status": false,
                    "message": JSON.stringify(error.stack)
                })
            }
        })
    }
}
