const { Api, JsonRpc } = require("eosjs");
const { JsSignatureProvider } = require("eosjs/dist/eosjs-jssig"); // development only
const fetch = require("node-fetch"); //node only
const { TextDecoder, TextEncoder } = require("util"); //node only
const { privateKeys, blockchainLink } = require("./env");

const signatureProvider = new JsSignatureProvider(privateKeys);
const rpc = new JsonRpc(blockchainLink, { fetch }); //required to read blockchain state
const api = new Api({
  rpc,
  signatureProvider,
  textDecoder: new TextDecoder(),
  textEncoder: new TextEncoder(),
}); //required to submit transactions

function randomNumber() {
  return Math.floor(Math.random() * Math.floor(100000));
}

function randomString(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const actions = [
  {
    account: "test1",
    name: "setvalue",
    authorization: [
      {
        actor: "eosio",
        permission: "active",
      },
    ],
    data: {
      user: "eosio",
      new_value: randomString(10),
    },
  },
  // {
  //   account: "test1",
  //   name: "getvalue",
  //   authorization: [
  //     {
  //       actor: "eosio",
  //       permission: "active",
  //     },
  //   ],
  //   data: {
  //     user: "eosio",
  //   },
  // },
  // {
  //   account: "test1",
  //   name: "hi",
  //   authorization: [
  //     {
  //       actor: "eosio",
  //       permission: "active",
  //     },
  //   ],
  //   data: {
  //     user: "eosio",
  //   },
  // },
];

function pushAction() {
  api
    .transact(
      {
        actions: [
          {
            account: "test1",
            name: "hi",
            authorization: [
              {
                actor: "eosio",
                permission: "active",
              },
            ],
            data: {
              user: randomNumber(),
              // new_value: randomNumber(),
            },
          },
        ],
      },
      {
        blocksBehind: 10,
        expireSeconds: 100,
      }
    )
    .then()
    .catch((err) => {
      console.log(err);
    });
}

async function getBlock(blockNumber) {
  const block = await rpc.get_block(blockNumber);
  console.log(block.transactions[0].trx.transaction);
}

async function getTransaction() {
  const transaction = await rpc.history_get_transaction(
    "f1d648cd811945e63a58e89507ff6ac5197937aef0d24c72577daf28be0b54db",
    530915
  );
  console.log(transaction.trx.trx.actions);
}
// setInterval(() => {
//   pushAction();
// }, 500);
// getTransaction()
// getBlock(531646)

// func()

for (var i = 0; i < 1000; i++) {
  pushAction();
}
