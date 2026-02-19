import type { RequestOptions } from "../http/request";
import { HttpClient } from "../http/request";
import type { JsonRequestBody, PathParams, SuccessResponse } from "../types/openapi";

export class AttachmentsResource {
  public constructor(private readonly http: HttpClient) {}

  public requestUpload(
    body: JsonRequestBody<"requestUpload">,
    requestOptions?: RequestOptions
  ): Promise<SuccessResponse<"requestUpload">> {
    return this.http.request<SuccessResponse<"requestUpload">>({
      method: "POST",
      path: "/v3/attachments",
      body,
      requestOptions
    });
  }

  public get(
    attachmentId: PathParams<"getAttachment">["attachmentId"],
    requestOptions?: RequestOptions
  ): Promise<SuccessResponse<"getAttachment">> {
    return this.http.request<SuccessResponse<"getAttachment">>({
      method: "GET",
      path: "/v3/attachments/{attachmentId}",
      pathParams: { attachmentId },
      requestOptions
    });
  }
}
