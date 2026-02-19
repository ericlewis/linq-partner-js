import type { RequestOptions } from "../http/request";
import { HttpClient } from "../http/request";
import type { JsonRequestBody, PathParams, SuccessResponse } from "../types/openapi";

export class WebhooksResource {
  public constructor(private readonly http: HttpClient) {}

  public listEvents(requestOptions?: RequestOptions): Promise<SuccessResponse<"listWebhookEvents">> {
    return this.http.request<SuccessResponse<"listWebhookEvents">>({
      method: "GET",
      path: "/v3/webhook-events",
      requestOptions
    });
  }

  public createSubscription(
    body: JsonRequestBody<"createWebhookSubscription">,
    requestOptions?: RequestOptions
  ): Promise<SuccessResponse<"createWebhookSubscription">> {
    return this.http.request<SuccessResponse<"createWebhookSubscription">>({
      method: "POST",
      path: "/v3/webhook-subscriptions",
      body,
      requestOptions
    });
  }

  public listSubscriptions(requestOptions?: RequestOptions): Promise<SuccessResponse<"listWebhookSubscriptions">> {
    return this.http.request<SuccessResponse<"listWebhookSubscriptions">>({
      method: "GET",
      path: "/v3/webhook-subscriptions",
      requestOptions
    });
  }

  public getSubscription(
    subscriptionId: PathParams<"getWebhookSubscription">["subscriptionId"],
    requestOptions?: RequestOptions
  ): Promise<SuccessResponse<"getWebhookSubscription">> {
    return this.http.request<SuccessResponse<"getWebhookSubscription">>({
      method: "GET",
      path: "/v3/webhook-subscriptions/{subscriptionId}",
      pathParams: { subscriptionId },
      requestOptions
    });
  }

  public updateSubscription(
    subscriptionId: PathParams<"updateWebhookSubscription">["subscriptionId"],
    body: JsonRequestBody<"updateWebhookSubscription">,
    requestOptions?: RequestOptions
  ): Promise<SuccessResponse<"updateWebhookSubscription">> {
    return this.http.request<SuccessResponse<"updateWebhookSubscription">>({
      method: "PUT",
      path: "/v3/webhook-subscriptions/{subscriptionId}",
      pathParams: { subscriptionId },
      body,
      requestOptions
    });
  }

  public deleteSubscription(
    subscriptionId: PathParams<"deleteWebhookSubscription">["subscriptionId"],
    requestOptions?: RequestOptions
  ): Promise<SuccessResponse<"deleteWebhookSubscription">> {
    return this.http.request<SuccessResponse<"deleteWebhookSubscription">>({
      method: "DELETE",
      path: "/v3/webhook-subscriptions/{subscriptionId}",
      pathParams: { subscriptionId },
      requestOptions
    });
  }
}
