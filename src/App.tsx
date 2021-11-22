import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Button, Card, Divider, Loader, Title, Text } from '@gnosis.pm/safe-react-components'
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'
import OpenseaBulkPurchaser from '@gsgalloway/opensea-bulk-purchaser';
import { BigNumber, getDefaultProvider } from 'ethers';
import NFTForm from './NFTForm';
import ManageListModal from './ManageListModal';
import TokenList from './TokenList';
import { TokenDescription } from './types';
import NetworkSelect from './NetworkSelect';
import { Network } from 'opensea-js';

const Container = styled.div`
  padding: 1rem;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`


const SafeApp = (): React.ReactElement => {
  const { sdk, safe } = useSafeAppsSDK()
  const [isOpen, setIsOpen] = useState(false);
  const [tokens, setTokens] = useState<TokenDescription[]>([])
  const [inputTokenID, setInputTokenID] = useState('');
  const [inputTokenContractAddress, setInputTokenContractAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState('mainnet');

  let openseaApiKey: string;
  if (selectedNetwork === "mainnet") {
    if (!process.env.REACT_APP_OPENSEA_API_KEY) {
      throw new Error("must define REACT_APP_OPENSEA_API_KEY");
    }
    openseaApiKey = process.env.REACT_APP_OPENSEA_API_KEY
  } else {
    if (!process.env.REACT_APP_RINKEBY_OPENSEA_API_KEY) {
      throw new Error("must define REACT_APP_RINKEBY_OPENSEA_API_KEY");
    }
    openseaApiKey = process.env.REACT_APP_RINKEBY_OPENSEA_API_KEY
  }

  let openseaNetworkName: Network;
  switch (selectedNetwork) {
    case "mainnet":
      openseaNetworkName = Network.Main;
      break;
    case "rinkeby":
      openseaNetworkName = Network.Rinkeby;
      break;
    default:
      throw new Error(
        `network ${selectedNetwork} is not supported by opensea-js`
      );
  }

  const onNFTFormSubmitted = () => {
    setTokens([...tokens, {id: BigNumber.from(inputTokenID), contractAddress: inputTokenContractAddress}])
  }

  const onItemDeleted = (itemId: number | string): void => {
    if (typeof(itemId) === 'string') {
      throw new Error(`itemID ${itemId} should be number`)
    }
    const newTokens = [...tokens];
    newTokens.splice(itemId, 1)
    setTokens(newTokens);
  }


  const getListItems = () => {
    return Array.from(tokens.entries()).map(([index, token]) => {
      return {
            id: index,
            iconUrl: 'someUrl',
            name: `${token.id}`,
            description: `Token at ${token.contractAddress}`,
            checked: true,
            isDeletable: true,
      };
    })
  }

  const submitTx = useCallback(async () => {
    try {
      setIsLoading(true);
      const openseaBulkPurchaser = new OpenseaBulkPurchaser(getDefaultProvider(), {openseaApiKey, network: openseaNetworkName});
      const purchaseTxs = await Promise.all(tokens.map(token => {
        return openseaBulkPurchaser.createSingleTokenPurchase(token.id, token.contractAddress, safe.safeAddress)
      }));

      const batchTx = await openseaBulkPurchaser.createBatchTransactionFromPurchases(purchaseTxs, safe.safeAddress);
      setIsLoading(false);
      await sdk.txs.send({
        txs: [{
          to: batchTx.to,
          value: BigNumber.from(batchTx.value).toString(),
          data: batchTx.data,
        }]
      })
    }
    catch (e) {
      console.error(e);
    }
  }, [tokens, safe, sdk, openseaNetworkName, openseaApiKey])

  return (
    <Container>
      {isLoading && (
        <Loader size={"lg"} />
      )}

      <Title size="md">New Batch OpenSea Purchase</Title>

      {tokens.length > 0 && (
        <Card>
          <TokenList tokens={tokens} network={openseaNetworkName} apiKey={openseaApiKey}/>
        </Card>
      )}

      <Text size="lg">Network:</Text><NetworkSelect selectedNetwork={selectedNetwork} setSelectedNetwork={setSelectedNetwork} />

      <br />

      <Button size="lg" color="primary" onClick={() => setIsOpen(!isOpen)}>
        1. Select NFTs
      </Button>
      {isOpen && (
        <ManageListModal
          title={"Add Token"}
          defaultIconUrl={"https://opensea.io/static/images/logos/opensea.svg"}
          itemList={getListItems()}
          showDeleteButton
          addButtonLabel="Add token to batch"
          formBody={<NFTForm
            tokenID={inputTokenID}
            tokenContractAddress={inputTokenContractAddress}
            onTokenIDChanged={setInputTokenID}
            onTokenContractAddressChanged={setInputTokenContractAddress}
          />}
          onSubmitForm={onNFTFormSubmitted}
          onClose={() => setIsOpen(false)}
          onItemToggle={() => undefined}
          onItemDeleted={onItemDeleted}
        />
      )}

      <Divider />

      <Button size="lg" color="primary" onClick={submitTx}>
        2. Construct Batch Transaction
      </Button>

    </Container>
  )
}

export default SafeApp
