// Assuming Web3 is included via CDN in your HTML
let web3;
let paypalContract;
let userAccount;

const contractAbi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        }
      ],
      "name": "addName",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_message",
          "type": "string"
        }
      ],
      "name": "createRequest",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_request",
          "type": "uint256"
        }
      ],
      "name": "payRequest",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "getMyRequests",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        },
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        },
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        },
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "getMyHistory",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "action",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "message",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "otherPartyAddress",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "otherPartyName",
              "type": "string"
            }
          ],
          "internalType": "struct Paypal.sendReceive[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "getMyName",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "hasName",
              "type": "bool"
            }
          ],
          "internalType": "struct Paypal.userName",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ];
const contractAddress = '0x232dEEcF1C39fBA71E38dFa3969BFA404802e403';

window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' }); // Updated line for MetaMask
            initApp();
        } catch (error) {
            console.error("User denied account access");
        }
    } else {
        console.log('Non-Ethereum browser detected. Consider using MetaMask!');
    }
});

function initApp() {
    paypalContract = new web3.eth.Contract(contractAbi, contractAddress);

    web3.eth.getAccounts().then(accounts => {
        userAccount = accounts[0];
    });

    document.getElementById('addNameBtn').addEventListener('click', addNameToWallet);
    document.getElementById('createRequestBtn').addEventListener('click', createPaymentRequest);
    document.getElementById('payRequestBtn').addEventListener('click', payRequest);
    document.getElementById('viewRequestsBtn').addEventListener('click', viewMyRequests);
    document.getElementById('viewHistoryBtn').addEventListener('click', viewMyHistory);
}

function addNameToWallet() {
    const name = document.getElementById('nameInput').value;
    paypalContract.methods.addName(name).send({from: userAccount})
        .then(result => {
            console.log('Name added:', result);
        }).catch(error => {
            console.error(error);
        });
}

function createPaymentRequest() {
    const user = document.getElementById('requestUserInput').value;
    const amount = document.getElementById('requestAmountInput').value;
    const message = document.getElementById('requestMessageInput').value;
    paypalContract.methods.createRequest(user, web3.utils.toWei(amount, 'ether'), message)
        .send({from: userAccount})
        .then(result => {
            console.log('Request created:', result);
        }).catch(error => {
            console.error(error);
        });
}

function payRequest() {
    const toAddress = document.getElementById('payToAddressInput').value;
    const amount = document.getElementById('payAmountInput').value; // Get amount from input

    if (!web3.utils.isAddress(toAddress)) {
        console.error("Invalid address");
        return;
    }

    if (!amount || isNaN(amount) || amount <= 0) {
        console.error("Invalid or empty amount");
        return;
    }

    web3.eth.sendTransaction({
        from: userAccount,
        to: toAddress,
        value: web3.utils.toWei(amount, 'ether'),
        gas: 21000 // Standard gas limit for a simple transfer
    }).then(result => {
        console.log('Transaction successful:', result);
    }).catch(error => {
        console.error(error);
    });
}

function viewMyRequests() {
    paypalContract.methods.getMyRequests(userAccount)
        .call()
        .then(result => {
            console.log('My requests:', result);
            // Additional logic to display requests on the page
        }).catch(error => {
            console.error(error);
        });
}

function viewMyHistory() {
    paypalContract.methods.getMyHistory(userAccount)
        .call()
        .then(result => {
            console.log('My history:', result);
            // Additional logic to display history on the page
        }).catch(error => {
            console.error(error);
        });
}

// Additional helper functions as needed...
