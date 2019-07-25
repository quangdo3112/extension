// Copyright 2019 @polkadot/extension authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SignerPayload } from '@polkadot/api/types';
import { KeypairType } from '@polkadot/util-crypto/types';

export type AuthorizeRequest = [string, MessageAuthorize, string];

export type SigningRequest = [string, MessageExtrinsicSign, string];

// export type RequestMessage = MessageAuthorize | MessageAuthorizeApprove | MessageAuthorizeReject | MessageAuthorizeRequests | MessageAuthorizeSubscribe | MessageAccountCreate | MessageAccountEdit | MessageAccountForget | MessageAccountList | MessageAccountSubscribe | MessageExtrinsicSign | MessageExtrinsicSignApprove | MessageExtrinsicSignCancel | MessageExtrinsicSignRequests | MessageExtrinsicSignSubscribe | MessageSeedCreate | MessageSeedValidate | MessageRpcSend;
// export type ResponseMessage = MessageExtrinsicSignResponse | MessageSeedCreateResponse | MessageSeedValidateResponse;
// export type Message = RequestMessage | ResponseMessage;

// Requests

export type MessageTypes = keyof PayloadTypes; // RequestMessages TODO ?

export interface TransportRequestMessage<TMessageType extends MessageTypes> {
  id: string,
  message: TMessageType,
  origin: 'page' | 'popup',
  request: PayloadTypes[TMessageType]
}

export type PayloadTypes = {
  'authorize.tab': MessageAuthorize,
  'authorize.approve': MessageAuthorizeApprove
  'authorize.reject': MessageAuthorizeReject
  'authorize.requests': MessageAuthorizeRequests
  'authorize.subscribe': MessageAuthorizeSubscribe
  'accounts.create': MessageAccountCreate
  'accounts.edit': MessageAccountEdit
  'accounts.forget': MessageAccountForget
  'accounts.list': MessageAccountList
  'accounts.subscribe': MessageAccountSubscribe
  'extrinsic.sign': MessageExtrinsicSign
  'signing.approve': MessageExtrinsicSignApprove
  'signing.cancel': MessageExtrinsicSignCancel
  'signing.requests': MessageExtrinsicSignRequests
  'signing.subscribe': MessageExtrinsicSignSubscribe
  'seed.create': MessageSeedCreate
  'seed.validate': MessageSeedValidate
  'rpc.send': MessageRpcSend
  'rpc.sendSubscribe': MessageRpcSendSubscribe
};

type IsNull<T, K extends keyof T> = { [K1 in Exclude<keyof T, K>]: T[K1] } & T[K] extends null ? K : never
type NullKeys<T> = { [K in keyof T]: IsNull<T, K> }[keyof T]
export type NullMessageTypes = NullKeys<PayloadTypes>

export type MessageAuthorize = {
  origin: string;
}

export type MessageAuthorizeApprove = {
  id: string;
}

export type MessageAuthorizeReject = {
  id: string;
}

export type MessageAuthorizeRequests = null;

export type MessageAuthorizeSubscribe = null;

export type MessageAccountCreate = {
  name: string;
  password: string;
  suri: string;
  type?: KeypairType;
}

export type MessageAccountEdit = {
  address: string;
  name: string;
}

export type MessageAccountForget = {
  address: string;
}

export type MessageAccountList = null;

export type MessageAccountSubscribe = null;

export type MessageExtrinsicSign = {
  payload: SignerPayload
}

export type MessageExtrinsicSignApprove = {
  id: string;
  password: string;
}

export type MessageExtrinsicSignCancel = {
  id: string;
}

export type MessageExtrinsicSignRequests = null;

export type MessageExtrinsicSignSubscribe = null;

export type MessageSeedCreate = {
  length?: 12 | 24;
  type?: KeypairType;
}

export type MessageSeedValidate = {
  seed: string;
  type?: KeypairType;
}

export type MessageRpcSend = {
  method: string,
  params?: any[]
}

export type MessageRpcSendSubscribe = {
  method: string,
  params?: any[]
}

// Responses

type NonNullResponseTypes = {
  'extrinsic.sign': MessageExtrinsicSignResponse,
  'seed.create': MessageSeedCreateResponse,
  'seed.validate': MessageSeedValidateResponse,
};

export type ResponseTypes = {
  [K in Exclude<MessageTypes, keyof NonNullResponseTypes>]: null;
} & NonNullResponseTypes;

export interface TransportSubscriptionNotification {
  subscriptionId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  response?: any;
}

export interface TransportResponseMessage<TMessage extends ResponseMessage> {
  error?: string;
  id: string;
  response?: TMessage;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscription?: any;
}

export interface MessageExtrinsicSignResponse {
    id: string;
    signature: string;
}

export interface MessageSeedCreateResponse {
    address: string;
    seed: string;
}

export interface MessageSeedValidateResponse {
    address: string;
    seed: string;
}

export interface MessageRpcSendResponse {
    result: any
}