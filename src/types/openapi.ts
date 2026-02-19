import type { operations } from "../generated/openapi-types";

export type OperationId = keyof operations;

type SuccessStatusCode = 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226;
type OperationResponses<Op extends OperationId> = operations[Op]["responses"];
type SuccessStatusForOperation<Op extends OperationId> = Extract<keyof OperationResponses<Op>, SuccessStatusCode>;
type JsonContent<T> = T extends { content: { "application/json": infer C } } ? C : void;

type OperationParameters<Op extends OperationId> = operations[Op] extends { parameters: infer P } ? P : never;
type OperationRequestBody<Op extends OperationId> = operations[Op] extends { requestBody?: infer B } ? B : never;

export type SuccessResponse<Op extends OperationId> = JsonContent<OperationResponses<Op>[SuccessStatusForOperation<Op>]>;

export type PathParams<Op extends OperationId> = OperationParameters<Op> extends { path?: infer P } ? P : never;
export type QueryParams<Op extends OperationId> = OperationParameters<Op> extends { query?: infer Q } ? Q : never;
export type HeaderParams<Op extends OperationId> = OperationParameters<Op> extends { header?: infer H } ? H : never;

export type JsonRequestBody<Op extends OperationId> =
  OperationRequestBody<Op> extends { content: { "application/json": infer C } } ? C : never;
