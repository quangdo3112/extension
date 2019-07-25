// Copyright 2019 @polkadot/extension authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { injectExtension } from '@polkadot/extension-inject';

import Injected from './Injected';
import { notificationHandler } from './NotificationHandler';
import { RequestMessage, ResponseTypes, TransportRequestMessage, TransportResponseMessage, TransportSubscriptionNotification, ResponseMessage, MessageSeedCreate, MessageTypes } from '../background/types';

// when sending a message from the injector to the extension, we
//  - create an event - this we send to the loader
//  - the loader takes this event and uses port.postMessage to background
//  - on response, the loader creates a reponse event
//  - this injector, listens on the events, maps it to the original
//  - resolves/rejects the promise with the result (or sub data)

interface Handler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve: (data: any) => void;
  reject: (error: Error) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscriber?: (data: any) => void;
}

type Handlers = Record<string, Handler>;

const handlers: Handlers = {};
let idCounter = 0;

// a generic message sender that creates an event, returning a promise that will
// resolve once the event is resolved (by the response listener just below this)
function sendMessage<TRequestMessage extends RequestMessage>(message: TRequestMessage['message'], request: TRequestMessage['payload'] = null, subscriber?: (data: any) => void): Promise<ResponseTypes[TRequestMessage['message']]> {
  return new Promise((resolve, reject): void => {
    const id = `${Date.now()}.${++idCounter}`;

    handlers[id] = { resolve, reject, subscriber };

    const transportRequestMessage: TransportRequestMessage<TRequestMessage> = { id, message, origin: 'page', request };
    window.postMessage(transportRequestMessage, '*');
  });
}












// a generic message sender that creates an event, returning a promise that will
// resolve once the event is resolved (by the response listener just below this)
function sendMessage2<TMessageType extends MessageTypes, TRequestMessage extends RequestMessage>(message: TMessageType, request: TRequestMessage['payload'] = null, subscriber?: (data: any) => void): Promise<ResponseTypes[TMessageType]> {
  return new Promise((resolve, reject): void => {
    const id = `${Date.now()}.${++idCounter}`;

    handlers[id] = { resolve, reject, subscriber };

    const transportRequestMessage: TransportRequestMessage<TRequestMessage> = { id, message, origin: 'page', request };
    window.postMessage(transportRequestMessage, '*');
  });
}

async function toast2() {
  const toto: ResponseTypes['seed.create'] = 12;
  const ax: boolean = await sendMessage2('seed.create', { length: 12, type: 'ed25519' });
  const ax: boolean = await sendMessage2('seed.create', true });
  // const a: boolean = await sendMessage2<MessageSeedCreate>('seed.create', { length: 12, type: 'ed25519' });
}




type Response = {
  'a': boolean,
  'b': number
}

function myfn<key extends keyof Response>(arg: key): Response[key] {
  const resp = { a: true, b: 1 };
  return resp[arg];
}
const x: number = myfn('a');

async function toast() {
  const toto: ResponseTypes['seed.create'] = 12;
  const ax: boolean = await sendMessage('seed.create', { length: 12, type: 'ed25519'});
  const a: boolean = await sendMessage<MessageSeedCreate>('seed.create', { length: 12, type: 'ed25519'});
}













// the enable function, called by the dapp to allow access
async function enable (origin: string): Promise<Injected> {
  await sendMessage('authorize.tab', { origin });

  return new Injected(sendMessage);
}

function handleResponse<TResponseMessage extends ResponseMessage>(data: TransportResponseMessage<TResponseMessage>) {
  const handler = handlers[data.id];

  if (!handler) {
    console.error(`Unknown response: ${JSON.stringify(data)}`);
    return;
  }

  if (!handler.subscriber) {
    delete handlers[data.id];
  }

  if (data.subscription) {
    (handler.subscriber as Function)(data.subscription);
  } else if (data.error) {
    handler.reject(new Error(data.error));
  } else {
    handler.resolve(data.response);
  }
}

function handleNotification(data: TransportSubscriptionNotification) {
  notificationHandler.emit('message', data);
}

// setup a response listener (events created by the loader for extension responses)
window.addEventListener('message', ({ data, source }): void => {
  // only allow messages from our window, by the loader
  if (source !== window || data.origin !== 'content') {
    return;
  }

  if (data.id) {
    handleResponse(data);
  }
  else {
    handleNotification(data);
  }
});

injectExtension(enable, {
  name: 'polkadot-js',
  version: process.env.PKG_VERSION as string
});
