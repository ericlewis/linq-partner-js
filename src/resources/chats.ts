import type { components } from "../generated/openapi-types";
import type { RequestOptions } from "../http/request";
import { HttpClient } from "../http/request";
import { createCursorIterator } from "../pagination/cursor-iterator";
import type { JsonRequestBody, PathParams, QueryParams, SuccessResponse } from "../types/openapi";

export class ChatsResource {
  public constructor(private readonly http: HttpClient) {}

  public create(body: JsonRequestBody<"createChat">, requestOptions?: RequestOptions): Promise<SuccessResponse<"createChat">> {
    return this.http.request<SuccessResponse<"createChat">>({
      method: "POST",
      path: "/v3/chats",
      body,
      requestOptions
    });
  }

  public list(query: QueryParams<"listChats">, requestOptions?: RequestOptions): Promise<SuccessResponse<"listChats">> {
    return this.http.request<SuccessResponse<"listChats">>({
      method: "GET",
      path: "/v3/chats",
      query,
      requestOptions
    });
  }

  public listAll(
    query: QueryParams<"listChats">,
    requestOptions?: RequestOptions
  ): AsyncGenerator<components["schemas"]["Chat"], void, void> {
    return createCursorIterator({
      initialQuery: { ...query },
      getPage: (nextQuery) => this.list(nextQuery, requestOptions),
      getItems: (page) => page.chats,
      getNextCursor: (page) => page.next_cursor
    });
  }

  public get(chatId: PathParams<"getChat">["chatId"], requestOptions?: RequestOptions): Promise<SuccessResponse<"getChat">> {
    return this.http.request<SuccessResponse<"getChat">>({
      method: "GET",
      path: "/v3/chats/{chatId}",
      pathParams: { chatId },
      requestOptions
    });
  }

  public update(
    chatId: PathParams<"updateChat">["chatId"],
    body: JsonRequestBody<"updateChat">,
    requestOptions?: RequestOptions
  ): Promise<SuccessResponse<"updateChat">> {
    return this.http.request<SuccessResponse<"updateChat">>({
      method: "PUT",
      path: "/v3/chats/{chatId}",
      pathParams: { chatId },
      body,
      requestOptions
    });
  }

  public addParticipant(
    chatId: PathParams<"addParticipant">["chatId"],
    body: JsonRequestBody<"addParticipant">,
    requestOptions?: RequestOptions
  ): Promise<SuccessResponse<"addParticipant">> {
    return this.http.request<SuccessResponse<"addParticipant">>({
      method: "POST",
      path: "/v3/chats/{chatId}/participants",
      pathParams: { chatId },
      body,
      requestOptions
    });
  }

  public removeParticipant(
    chatId: PathParams<"removeParticipant">["chatId"],
    body: JsonRequestBody<"removeParticipant">,
    requestOptions?: RequestOptions
  ): Promise<SuccessResponse<"removeParticipant">> {
    return this.http.request<SuccessResponse<"removeParticipant">>({
      method: "DELETE",
      path: "/v3/chats/{chatId}/participants",
      pathParams: { chatId },
      body,
      requestOptions
    });
  }

  public startTyping(
    chatId: PathParams<"startTyping">["chatId"],
    requestOptions?: RequestOptions
  ): Promise<SuccessResponse<"startTyping">> {
    return this.http.request<SuccessResponse<"startTyping">>({
      method: "POST",
      path: "/v3/chats/{chatId}/typing",
      pathParams: { chatId },
      requestOptions
    });
  }

  public stopTyping(
    chatId: PathParams<"stopTyping">["chatId"],
    requestOptions?: RequestOptions
  ): Promise<SuccessResponse<"stopTyping">> {
    return this.http.request<SuccessResponse<"stopTyping">>({
      method: "DELETE",
      path: "/v3/chats/{chatId}/typing",
      pathParams: { chatId },
      requestOptions
    });
  }

  public markAsRead(
    chatId: PathParams<"markChatAsRead">["chatId"],
    requestOptions?: RequestOptions
  ): Promise<SuccessResponse<"markChatAsRead">> {
    return this.http.request<SuccessResponse<"markChatAsRead">>({
      method: "POST",
      path: "/v3/chats/{chatId}/read",
      pathParams: { chatId },
      requestOptions
    });
  }

  public shareContactCard(
    chatId: PathParams<"shareContactWithChat">["chatId"],
    requestOptions?: RequestOptions
  ): Promise<SuccessResponse<"shareContactWithChat">> {
    return this.http.request<SuccessResponse<"shareContactWithChat">>({
      method: "POST",
      path: "/v3/chats/{chatId}/share_contact_card",
      pathParams: { chatId },
      requestOptions
    });
  }
}
