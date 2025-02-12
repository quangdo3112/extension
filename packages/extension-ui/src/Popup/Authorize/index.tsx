// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AuthRequestsFromCtx } from '../../components/types';

import React from 'react';

import { Header, withAuthRequests } from '../../components';
import Request from './Request';

interface Props {
  requests: AuthRequestsFromCtx;
}

function Authorize ({ requests }: Props): React.ReactElement<Props> {
  return (
    <div>
      <Header label='authorize' />
      {requests.map(([id, request, url], index): React.ReactNode => (
        <Request
          authId={id}
          isFirst={index === 0}
          key={id}
          request={request}
          url={url}
        />
      ))}
    </div>
  );
}

export default withAuthRequests(Authorize);
