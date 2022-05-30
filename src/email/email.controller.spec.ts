import { Test, TestingModule } from '@nestjs/testing';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import * as streamBuffers from 'stream-buffers';

import * as fs from 'fs';


describe('EmailController', () => {
    let emailController: EmailController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EmailController],
            providers: [EmailService],
        }).compile();

        emailController = module.get<EmailController>(EmailController);
    });

    it('should be defined', () => {
        expect(emailController).toBeDefined();
    });
    it('validation failed', async () => {
        const mockRequest = () => {
            return {
            };
        };


        const mockResponse = () => {
            const res = {};
            res['json'] = jest.fn().mockReturnValue(res);
            res['send'] = jest.fn().mockReturnValue(res);
            res['status'] = jest.fn().mockReturnValue(res);
            res['setHeader'] = jest.fn().mockReturnValue(res);
            res['header'] = jest.fn().mockReturnValue(res);
            return res;
        };
        const req = mockRequest();
        const res = mockResponse();

        await emailController.sendEmail(undefined, req, res);
        expect(res['send']).toHaveBeenCalled();
        expect(res['status']).toHaveBeenCalledWith(400);
        expect(res['send']).toHaveBeenCalledWith({
            "status": false,
            "message": "Missing Required field"
        });
    });
    it('Email Sent failed with Invalid Email', async () => {
        const mockRequest = () => {

            const body = {};
            body['emailBody'] = "test body",
                body['emailSubject'] = "test Subject",
                body['emailTo'] = "test@test.com"
            return body;
        };


        const mockResponse = () => {
            const res = {};
            res['json'] = jest.fn().mockReturnValue(res);
            res['send'] = jest.fn().mockReturnValue(res);
            res['status'] = jest.fn().mockReturnValue(res);
            res['setHeader'] = jest.fn().mockReturnValue(res);
            res['header'] = jest.fn().mockReturnValue(res);
            return res;
        };
        const req = mockRequest();
        const res = mockResponse();

        await emailController.sendEmail(undefined, req, res);

        expect(res['send']).toHaveBeenCalled();
        expect(res['status']).toHaveBeenCalledWith(500);

    });
    it('Email Sent Successfully without attachment', async () => {
        const mockRequest = () => {

            const body = {};
            body['emailBody'] = "test body",
                body['emailSubject'] = "test Subject",
                body['emailTo'] = "chandram97@gmail.com"
            return body;
        };


        const mockResponse = () => {
            const res = {};
            res['json'] = jest.fn().mockReturnValue(res);
            res['send'] = jest.fn().mockReturnValue(res);
            res['status'] = jest.fn().mockReturnValue(res);
            res['setHeader'] = jest.fn().mockReturnValue(res);
            res['header'] = jest.fn().mockReturnValue(res);
            return res;
        };
        const req = mockRequest();
        const res = mockResponse();

        await emailController.sendEmail(undefined, req, res);

        expect(res['send']).toHaveBeenCalled();
        expect(res['status']).toHaveBeenCalledWith(200);
        expect(res['send']).toHaveBeenCalledWith({
            "status": true,
            "message": "Email Send Successfully"
        });
    }); 
    it('Email Sent Successfully with attachment', async () => {
        const mockRequest = () => {
            const body = {};
            body['emailBody'] = "test body",
                body['emailSubject'] = "test Subject",
                body['emailTo'] = "chandram97@gmail.com"
            return body;
        };


        const filename = `test-${Date.now()}.png`

        fs.copyFileSync('./test/test.png', `./tmp/${filename}`);

        const imageBuffer = (fs.readFileSync('./test/test.png')) as Buffer;
        
        let imageFiles: Express.Multer.File ;
        const myReadableStreamBuffer = new streamBuffers.ReadableStreamBuffer({
            frequency: 10, // in milliseconds.
            chunkSize: 2048, // in bytes.
        });
        myReadableStreamBuffer.put(imageBuffer as Buffer);
        
        imageFiles = {
            buffer: imageBuffer,
            fieldname: 'attachment',
            originalname: 'test.png',
            encoding: '7bit',
            mimetype: 'image/png',
            destination: './tmp',
            filename: filename,
            path: `.tmp//${filename}`,
            size: 97079,
            stream: myReadableStreamBuffer,
        };
        
        console.log(imageFiles)

        const mockResponse = () => {
            const res = {};
            res['json'] = jest.fn().mockReturnValue(res);
            res['send'] = jest.fn().mockReturnValue(res);
            res['status'] = jest.fn().mockReturnValue(res);
            res['setHeader'] = jest.fn().mockReturnValue(res);
            res['header'] = jest.fn().mockReturnValue(res);
            return res;
        };
        const req = mockRequest();
        const res = mockResponse();
        
        await emailController.sendEmail(imageFiles, req, res);

        expect(res['send']).toHaveBeenCalled();
        expect(res['status']).toHaveBeenCalledWith(200);
        expect(res['send']).toHaveBeenCalledWith({
            "status": true,
            "message": "Email Send Successfully"
        });
    })
});


