import React, { useEffect, useState } from 'react';
import Ipfs from 'ipfs';

interface IpfsContextType {
  ipfs: any;
  isIpfsReady: boolean;
  ipfsInitError: Error;
}

export const IpfsContext = React.createContext({} as IpfsContextType);

export const IpfsProvider = ({ children }) => {
  const [ipfs, setIpfs] = useState(null);
  const [isIpfsReady, setIpfsReady] = useState(false);
  const [ipfsInitError, setIpfsInitError] = useState(null);

  useEffect(() => {
    startIpfs();
    return () => {
      if (ipfs && ipfs.stop) {
        console.log('Stopping IPFS');
        ipfs.stop().catch((err) => console.error(err));
        setIpfs(null);
        setIpfsReady(false);
      }
    };
  }, []);

  const startIpfs = async () => {
    try {
      console.time('IPFS Started');
      const node = await Ipfs.create({
        repo: 'untitled',
      });
      setIpfs(node);
      console.timeEnd('IPFS Started');
      setIpfsReady(true);
    } catch (e) {
      console.error('IPFS init error:', e);
      setIpfsInitError(e);
    }
  };

  return (
    <IpfsContext.Provider value={{ ipfs, isIpfsReady, ipfsInitError }}>
      {children}
    </IpfsContext.Provider>
  );
};
