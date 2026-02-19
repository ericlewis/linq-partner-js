import type { components } from "../generated/openapi-types";
import type { RequestOptions } from "../http/request";
import { HttpClient } from "../http/request";
import { createCursorIterator } from "../pagination/cursor-iterator";
import type { JsonRequestBody, PathParams, QueryParams, SuccessResponse } from "../types/openapi";

export class MessagesResource {
  public constructor(private readonly http: HttpClient) {}

  public sendToChat(
    chatId: PathParams<"sendMessageToChat">["chatId"],
    body: JsonRequestBody<"sendMessageToChat">,
    requestOptions?: RequestOptions
  ): Promise<SuccessResponse<"sendMessageToChat">> {
    return this.http.request<SuccessResponse<"sendMessageToChat">>({
      method: "POST",
      path: "/v3/chats/{chatId}/messages",
      pathParams: { chatId },
      body,
      requestOptions
    });
  }

  public listByChat(
    chatId: PathParams<"getMessages">["chatId"],
    query?: QueryParams<"getMessages">,
    requestOptions?: RequestOptions
  ): Promise<SuccessResponse<"getMessages">> {
    return this.http.request<SuccessResponse<"getMessages">>({
      method: "GET",
      path: "/v3/chats/{chatId}/messages",
      pathParams: { chatId },
      query,
      requestOptions
    });
  }

  public listAllByChat(
    chatId: PathParams<"getMessages">["chatId"],
    query: QueryParams<"getMessages"> = {},
    requestOptions?: RequestOptions
  ): AsyncGenerator<components["schemas"]["Message"], void, void> {
    return createCursorIterator({
      initialQuery: { ...query },
      getPage: (nextQuery) => this.listByChat(chatId, nextQuery, requestOptions),
      getItems: (page) => page.messages,
      getNextCursor: (page) => page.next_cursor
    });
  }

  public getThread(
    messageId: PathParams<"getMessageThread">["messageId"],
    query?: QueryParams<"getMessageThread">,
    requestOptions?: RequestOptions
  ): Promise<SuccessResponse<"getMessageThread">> {
    return this.http.request<SuccessResponse<"getMessageThread">>({
      method: "GET",
      path: "/v3/messages/{messageId}/thread",
      pathParams: { messageId },
      query,
      requestOptions
    });
  }

  public listAllThreadMessages(
    messageId: PathParams<"getMessageThread">["messageId"],
    query: QueryParams<"getMessageThread"> = {},
    requestOptions?: RequestOptions
  ): AsyncGenerator<components["schemas"]["Message"], void, void> {
    return createCursorIterator({
      initialQuery: { ...query },
      getPage: (nextQuery) => this.getThread(messageId, nextQuery, requestOptions),
      getItems: (page) => page.messages,
      getNextCursor: (page) => page.next_cursor
    });
  }

  public sendVoiceMemoToChat(
    chatId: PathParams<"sendVoiceMemoToChat">["chatId"],
    body: JsonRequestBody<"sendVoiceMemoToChat">,
    requestOptions?: RequestOptions
  ): Promise<SuccessResponse<"sendVoiceMemoToChat">> {
    return this.http.request<SuccessResponse<"sendVoiceMemoToChat">>({
      method: "POST",
      path: "/v3/chats/{chatId}/voicememo",
      pathParams: { chatId },
      body,
      requestOptions
    });
  }

  public get(
    messageId: PathParams<"getMessage">["messageId"],
    requestOptions?: RequestOptions
  ): Promise<SuccessResponse<"getMessage">> {
    return this.http.request<SuccessResponse<"getMessage">>({
      method: "GET",
      path: "/v3/messages/{messageId}",
      pathParams: { messageId },
      requestOptions
    });
  }

  public delete(
    messageId: PathParams<"deleteMessage">["messageId"],
    body: JsonRequestBody<"deleteMessage">,
    requestOptions?: RequestOptions
  ): Promise<SuccessResponse<"deleteMessage">> {
    return this.http.request<SuccessResponse<"deleteMessage">>({
      method: "DELETE",
      path: "/v3/messages/{messageId}",
      pathParams: { messageId },
      body,
      requestOptions
    });
  }

  public sendReaction(
    messageId: PathParams<"sendReaction">["messageId"],
    body: JsonRequestBody<"sendReaction">,
    requestOptions?: RequestOptions
  ): Promise<SuccessResponse<"sendReaction">> {
    return this.http.request<SuccessResponse<"sendReaction">>({
      method: "POST",
      path: "/v3/messages/{messageId}/reactions",
      pathParams: { messageId },
      body,
      requestOptions
    });
  }
}
