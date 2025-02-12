// Copyright 2019 @polkadot/extension-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Prefix } from '@polkadot/util-crypto/address/types';

import React, { useState } from 'react';
import settings from '@polkadot/ui-settings';
import { setAddressPrefix } from '@polkadot/util-crypto';

import { Dropdown, Header } from '../../components';
import { Back } from '../../partials';

const options = settings.availablePrefixes.map(({ text, value }): { text: string; value: string } => ({
  text: value === -1
    ? 'Substrate (default)'
    : text,
  value: `${value}`
}));

export default function Settings (): React.ReactElement<{}> {
  const [prefix, setPrefix] = useState(`${settings.prefix}`);

  // FIXME check against index, we need a better solution
  const _onChangePrefix = (value: string): void => {
    const prefix = parseInt(value, 10) as Prefix;

    setPrefix(value);
    setAddressPrefix((prefix as number) === -1 ? 42 : prefix);

    settings.set({ prefix });
  };

  return (
    <div>
      <Header label='settings' />
      <Back />
      <Dropdown
        label='display addresses formatted for'
        onChange={_onChangePrefix}
        options={options}
        value={`${prefix}`}
      />
    </div>
  );
}
