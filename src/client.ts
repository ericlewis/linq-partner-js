import { HttpClient, type LinqPartnerClientOptions } from "./http/request";
import { AttachmentsResource } from "./resources/attachments";
import { ChatsResource } from "./resources/chats";
import { MessagesResource } from "./resources/messages";
import { PhoneNumbersResource } from "./resources/phone-numbers";
import { WebhooksResource } from "./resources/webhooks";

export class LinqPartnerClient {
  public readonly chats: ChatsResource;
  public readonly messages: MessagesResource;
  public readonly attachments: AttachmentsResource;
  public readonly phoneNumbers: PhoneNumbersResource;
  public readonly webhooks: WebhooksResource;

  public constructor(options: LinqPartnerClientOptions) {
    const http = new HttpClient(options);

    this.chats = new ChatsResource(http);
    this.messages = new MessagesResource(http);
    this.attachments = new AttachmentsResource(http);
    this.phoneNumbers = new PhoneNumbersResource(http);
    this.webhooks = new WebhooksResource(http);
  }
}
