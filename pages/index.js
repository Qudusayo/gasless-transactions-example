import { useState } from "react";
import { ethers } from "ethers";
import Greeter from "../artifacts/contracts/Greeter.sol/Greeter.json";
import { Biconomy } from "@biconomy/mexa";

const greeterAddress = "0x19dFbcc38aa618043Ca36Daa2E052AABEAfDbe29";

function App() {
  const [greeting, setGreetingValue] = useState();

  async function requestAccounts() {
    return await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  async function fetchGreeting() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      try {
        const data = await contract.greet();
        console.log("data: ", data);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  async function setGreeting() {
    if (!greeting) return;
    if (typeof window.ethereum !== "undefined") {
      const accounts = await requestAccounts();
      const biconomy = new Biconomy(window.ethereum, {
        apiKey: "59fRCMXvk.8a1652f0-b522-4ea7-b296-98628499aee3",
        debug: true,
        contractAddresses: [greeterAddress],
      });
      const provider = await biconomy.provider;

      const contractInstance = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        biconomy.ethersProvider
      );
      await biconomy.init();

      const { data } = await contractInstance.populateTransaction.setGreeting(
        greeting
      );

      let txParams = {
        data: data,
        to: greeterAddress,
        from: accounts[0],
        signatureType: "EIP712_SIGN",
      };

      await provider.send("eth_sendTransaction", [txParams]);
    }

    // try {
    //   const accounts = await requestAccounts();

    //   fetch(`https://api.biconomy.io/api/v2/meta-tx/native`, {
    //     method: "POST",
    //     headers: {
    //       "x-api-key": "59fRCMXvk.8a1652f0-b522-4ea7-b296-98628499aee3",
    //       "Content-Type": "application/json;charset=utf-8",
    //     },
    //     body: JSON.stringify({
    //       to: greeterAddress,
    //       apiId: "9e936574-f38d-436d-a132-3caf49f424b9",
    //       params: {
    //         greeting,
    //       },
    //       from: accounts[0],
    //       signatureType: "EIP712_SIGN",
    //     }),
    //   })
    //     .then((response) => response.json())
    //     .then(async function (result) {
    //       console.log(result);
    //     })
    //     .catch(function (error) {
    //       console.log(error);
    //     });
    // } catch (error) {
    //   console.log(error);
    // }
  }

  return (
    <div className="App">
      <div style={containerStyle}>
        <button style={buttonStyle} onClick={fetchGreeting}>
          Fetch Greeting
        </button>
        <button style={buttonStyle} onClick={setGreeting}>
          Set Greeting
        </button>
        <input
          style={inputStyle}
          onChange={(e) => setGreetingValue(e.target.value)}
          placeholder="Set greeting"
        />
      </div>
    </div>
  );
}

const containerStyle = {
  width: "900px",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  paddingTop: 100,
};

const inputStyle = {
  width: "100%",
  padding: "8px",
};

const buttonStyle = {
  width: "100%",
  marginBottom: 15,
  height: "30px",
};

export default App;
