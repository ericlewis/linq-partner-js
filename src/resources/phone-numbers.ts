import type { RequestOptions } from "../http/request";
import { HttpClient } from "../http/request";
import type { SuccessResponse } from "../types/openapi";

export class PhoneNumbersResource {
  public constructor(private readonly http: HttpClient) {}

  public list(requestOptions?: RequestOptions): Promise<SuccessResponse<"listPhoneNumbers">> {
    return this.http.request<SuccessResponse<"listPhoneNumbers">>({
      method: "GET",
      path: "/v3/phonenumbers",
      requestOptions
    });
  }
}
