import { useWeb3Modal, Web3Button } from "@web3modal/react";

const NavBar = () => {

  const { open, close } = useWeb3Modal();


  return (
    
    <div>
      <div className="font-mono p-2 flex justify-between border-b-2 border-b-red-300 ">
        <div className="items-center py-2">BUSDPortal </div>
        <Web3Button/>
        
      </div>
    </div>


  )
}

export default NavBar