import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }
  
  async sendUserConfirmation(email: string, name, url: string) {
    this.mailerService.sendMail({
      to: email,
      template: 'confirmMail',
      subject: 'Confirm your account',
      context: {
        name,
        url
      }
    })
  }
}
