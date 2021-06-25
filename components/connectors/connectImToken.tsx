import { FC, useCallback } from 'react';
import { ConnectWalletProps } from './types';
import ConnectButtonMobile from './connectButtonMobile';
import iconUrl from 'assets/icons/imtoken.svg';
import { useConnect, useConfig } from 'hooks';
import { openWindow } from 'utils';

const ConnectImToken: FC<ConnectWalletProps> = (props) => {
  const { onConnect, ...rest } = props;
  const { connectors } = useConfig();
  const connect = useConnect();
  const connector = connectors.imtoken;

  const openInWallet = useCallback(() => {
    const url = encodeURIComponent(window.location.href);
    openWindow(`imtokenv2://navigate?screen=DappView&url=${url}`);

    return;
  }, []);

  const handleConnect = useCallback(async () => {
    const hasInjected = typeof window !== 'undefined' && 'ethereum' in window;

    if (!hasInjected) {
      openInWallet();
      return;
    }

    onConnect?.();
    await connect(connector);
  }, [onConnect, connect, connector, openInWallet]);

  return (
    <ConnectButtonMobile {...rest} iconSrc={iconUrl} onClick={handleConnect}>
      imToken
    </ConnectButtonMobile>
  );
};

export default ConnectImToken;