import './style.css'
import { useEffect, useState } from "react";
import { SignClient } from "@walletconnect/sign-client";
import { Web3Modal as Web3ModalStandolone } from "@web3modal/standalone";

import { ethers } from 'ethers';
import { IntuABI } from '../ABI';

const web3Modal = new Web3ModalStandolone({
    projectId: "1bd4139fcba9da0ebb55e2d5ffa1d12d",
    standaloneChains: ["eip155:5"]
});

function WalletAbstraction() {
    const [signClient, setSignClient] = useState();
    const [sessions, setSessions] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [txHash, setTxHash] = useState();
    const reset = () => {
      setAccounts([]);
      setSessions([]);
    };
  
    async function createClient() {
      try {
        const client = await SignClient.init({
          projectId:"1bd4139fcba9da0ebb55e2d5ffa1d12d",
        })
        console.log(client);
        setSignClient(client);
        await subscribeToEvents(client);
      } catch (e) {
        console.log(e);
      }
    }
  
    async function handleConnect() {
      if (!signClient) throw Error("cannot connect, signClient is not defined")
      try {
        const proposalNamespace = {
          eip155: {
            chains: ["eip155:5"],
            methods: ["eth_sendTransaction"],
            events: ["connect", "disconnect"]
          }
        };
  
        const { uri, approval } = await signClient.connect({
          requiredNamespaces: proposalNamespace
        });
  
        console.log('uri', uri);
  
        if (uri) {
          web3Modal.openModal({ uri })
          const sessionNamespace = await approval();
          console.log("sessionNamespace", sessionNamespace)
          onSessionConnect(sessionNamespace)
          //close the modal
          web3Modal.closeModal();
        }
  
      } catch (e) {
        console.log(e);
      }
    }
  
    async function onSessionConnect(session) {
      if (!session) throw Error("session doesn't even exist")
      try {
        setSessions(session)
        setAccounts(session.namespaces.eip155.accounts[0].slice(9));
      } catch (e) {
        console.log(e);
      }
    }
  
    async function handleDisconnect() {
      try {
        await signClient.disconnect({
          topic: sessions.topic,
          code: 6000,
          message: "User disconnected"
        });
        reset();
      } catch (e) {
        console.log(e);
      }
    }
  
    async function subscribeToEvents(client) {
      if (!client)
        throw Error("No events to subscribe to b/c client is not defined");
  
      try {
        client.on("session_delete", () => {
          console.log("user disconnected the session from their wallet");
          reset();
        });
      } catch (e) {
        console.log(e);
      }
    }
  
    useEffect(() => {
      if (!signClient) {
        createClient();
      }
    }, [signClient]);
  
    return (
      <div className="App">
        {accounts.length ? (
          <>
            <p>{accounts}</p>
            <button onClick={handleDisconnect}>Disconnect</button>
            {txHash &&
              <h2> Check your Transaction Hash {" "}
                <a
                  href={`https://goerli.etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noreferer noreferrer"
                >here
                </a>
                !
              </h2>
            }
          </>
        ) : (
          <button className="btn btn-primary btn-intu" onClick={handleConnect}>Connect with Intu</button>
        )
        }
      </div>
    );
  }

const IntuButton = () => {

    const [intu, setIntu] = useState({})

    const connectIntu = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        
        const CONTRACT_ADDRESS = '0x4eA8A6DfC72A458F8892e81B785eec44093794BD'; // Goerli
        const INTUContract = await new ethers.Contract(CONTRACT_ADDRESS, IntuABI, signer);

        const result = await INTUContract.getUserVaults()
        console.log({result})

        console.log(parseInt(result[0].toString()))

        const vaultId = parseInt(result[0].toString())

        const vaultInfo = await INTUContract.getVaultInfo(vaultId)

        console.log({vaultInfo})

        setIntu(state => ({...state, vaultInfo}))
    }
        


    return (
        <div>
            {intu.vaultInfo && <p>Intu sig name: {intu.vaultInfo[0].toString()}</p>}
            {intu.vaultInfo && <p>Intu sig address: {intu.vaultInfo[3].toString()}</p>}
            <button className="btn btn-primary btn-intu" onClick={connectIntu}>Connect with Intu</button>
        </div>
    )
}

export default WalletAbstraction
