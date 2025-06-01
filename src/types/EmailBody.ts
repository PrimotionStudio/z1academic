export interface SendEmailBody {
  to: string;
  subject: string;
  logo: string;
  name: string;
  intro_text: string;
  body_text: string;
  action_url?: string;
  action_text?: string;
  unsubscribe_url: string;
}
