// *** YOU ARE LIMITED TO THE FOLLOWING IMPORTS TO BUILD YOUR PHAT CONTRACT     ***
// *** ADDING ANY IMPORTS WILL RESULT IN ERRORS & UPLOADING YOUR CODE TO PHALA  ***
// *** NETWORK WILL FAIL. IF YOU WANT TO KNOW MORE, JOIN OUR DISCORD TO SPEAK   ***
// *** WITH THE PHALA TEAM AT https://discord.gg/5HfmWQNX THANK YOU             ***
import "@phala/pink-env";
import { Coders } from "@phala/ethers";

type HexString = `0x${string}`


// ETH ABI Coders available
/*
// Basic Types
// Encode uint
const uintCoder = new Coders.NumberCoder(32, false, "uint256");
// Encode Bytes
const bytesCoder = new Coders.BytesCoder("bytes");
// Encode String
const stringCoder = new Coders.StringCoder("string");
// Encode Address
const addressCoder = new Coders.AddressCoder("address");

// ARRAYS
//
// ***NOTE***
// IF YOU DEFINE AN TYPED ARRAY FOR ENCODING, YOU MUST ALSO DEFINE THE SIZE WHEN DECODING THE ACTION REPLY IN YOUR
// SOLIDITY SMART CONTRACT.
// EXAMPLE for an array of string with a length of 10
//
// index.ts
const stringCoder = new Coders.StringCoder("string");
const stringArrayCoder = new Coders.ArrayCoder(stringCoder, 10, "string[]");
function encodeReply(reply: [number, number, string[]]): HexString {
  return Coders.encode([uintCoder, uintCoder, stringArrayCoder], reply) as HexString;
}

const stringArray = string[10];

export default function main(request: HexString, settings: string): HexString {
  return encodeReply([0, 1, stringArray]);
}
// OracleConsumerContract.sol
function _onMessageReceived(bytes calldata action) internal override {
    (uint respType, uint id, string[10] memory data) = abi.decode(
        action,
        (uint, uint, string[10])
    );
}
// Encode Array of addresses with a length of 10
const stringArrayCoder = new Coders.ArrayCoder(stringCoder, 10, "string");
// Encode Array of addresses with a length of 10
const addressArrayCoder = new Coders.ArrayCoder(addressCoder, 10, "address");
// Encode Array of bytes with a length of 10
const bytesArrayCoder = new Coders.ArrayCoder(bytesCoder, 10, "bytes");
// Encode Array of uint with a length of 10
const uintArrayCoder = new Coders.ArrayCoder(uintCoder, 10, "uint256");
 */

// eth abi coder
const uintCoder = new Coders.NumberCoder(32, false, "uint256");
const bytesCoder = new Coders.BytesCoder("bytes");
const stringCoder = new Coders.StringCoder("string")
const bytes32Coder = new Coders.BytesCoder("bytes32");
const bytes32ArrayCoder = new Coders.ArrayCoder(bytes32Coder, 32, "bytes32[]");
const bytesArrayCoder = new Coders.ArrayCoder(bytesCoder, 32, "bytes");

const stringArrayCoder = new Coders.ArrayCoder(stringCoder, 32, "string[]");

function encodeReply(reply: [number,number,number,number,number,string[],string,number,string,number,string,number,number]): HexString {
  return Coders.encode([uintCoder,uintCoder,uintCoder,uintCoder,uintCoder,stringArrayCoder,stringCoder, uintCoder,stringCoder,uintCoder,stringCoder,uintCoder,uintCoder], reply) as HexString;
}

// Defined in TestLensOracle.sol
const TYPE_RESPONSE = 0;
const TYPE_ERROR = 2;

enum Error {
  BadLensProfileId = "BadLensProfileId",
  FailedToFetchData = "FailedToFetchData",
  FailedToDecode = "FailedToDecode",
  MalformedRequest = "MalformedRequest",
  BadRequestString = "BadRequestString"
}

function errorToCode(error: Error): number {
  switch (error) {
    case Error.BadLensProfileId:
      return 1;
    case Error.FailedToFetchData:
      return 2;
    case Error.FailedToDecode:
      return 3;
    case Error.MalformedRequest:
      return 4;
    default:
      return 0;
  }
}

function isHexString(str: string): boolean {
  const regex = /^0x[0-9a-f]+$/;
  return regex.test(str.toLowerCase());
}

function stringToHex(str: string): string {
  var hex = "";
  for (var i = 0; i < str.length; i++) {
    hex += str.charCodeAt(i).toString(16);
  }
  return "0x" + hex;
}


function Bridge(apiUrl: string, reqStr: string):any {
  const bridgeApiEndpoint ='https://bridge-api.public.zkevm-test.net/bridges/0x5E117b7056Ff0d42Af07ff6050DdcE22FA76F6d8';

  let headers = {
    "Content-Type": "application/json",
    "User-Agent": "phat-contract",
  };

  const response = pink.httpRequest({
    url:apiUrl,
    method: "GET",
    headers,
    returnTextBody: true
  });
  if (response.statusCode !== 200) {
    console.log(
      `wrong 200: ${response.statusCode}, error: ${
         response.body
      }}`
    );
    throw Error.FailedToFetchData;
  }
  console.info(response);
  let respBody = response.body;
  if (typeof respBody !== "string") {
    throw Error.FailedToDecode;
  }
  return JSON.parse(respBody);
}


function Bridge2(deposit_cnt:number, net_id: number):any {
  const bridgeApiEndpoint2 =`https://bridge-api.public.zkevm-test.net/merkle-proof?deposit_cnt=${deposit_cnt}&net_id=${net_id}`

  let headers = {
    "Content-Type": "application/json",
    "User-Agent": "phat-contract",
  };

  const response = pink.httpRequest({
    url:bridgeApiEndpoint2,
    method: "GET",
    headers,
    returnTextBody: true
  });
  if (response.statusCode !== 200) {
    console.log(
      `wrong 200: ${response.statusCode}, error: ${
         response.body
      }}`
    );
    throw Error.FailedToFetchData;
  }
  console.info(response);
  let respBody = response.body;
  if (typeof respBody !== "string") {
    throw Error.FailedToDecode;
  }
  return JSON.parse(respBody);
}

function parseProfileId(hexx: string): string {
  var hex = hexx.toString();
  if (!isHexString(hex)) {
    throw Error.BadLensProfileId;
  }
  hex = hex.slice(2);
  var str = "";
  for (var i = 0; i < hex.length; i += 2) {
    const ch = String.fromCharCode(parseInt(hex.substring(i, i + 2), 16));
    str += ch;
  }
  return str;
}

function parseReqStr(hexStr: string): string {
  var hex = hexStr.toString();
  if (!isHexString(hex)) {
    throw Error.BadRequestString;
  }
  hex = hex.slice(2);
  var str = "";
  for (var i = 0; i < hex.length; i += 2) {
    const ch = String.fromCharCode(parseInt(hex.substring(i, i + 2), 16));
    str += ch;
  }
  return str;
}


export default function main(request: HexString, secrets: string): HexString {
  console.log(`handle req: ${request}`);

  let requestId, encodedReqStr;
  try {
    [requestId, encodedReqStr] = Coders.decode([uintCoder, bytesCoder], request);
  } catch (error) {
    console.info("Malformed request received");
    return encodeReply([TYPE_ERROR, 0, errorToCode(error as Error),0,0,['sd','sdf','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],'23',2,'sd',3,'s',23,34]);
  }

  const parsedHexReqStr = parseReqStr(encodedReqStr as string);
  console.log(`Request received for profile ${parsedHexReqStr}`);

  try {
    console.info('try here ')
    const respData = Bridge(secrets, parsedHexReqStr);
    let stats1: number = respData.deposits[0].deposit_cnt;
    let stats2: number = respData.deposits[0].network_id;
    
    let stats10: number = respData.deposits[0].orig_net;
    let stats9: string = respData.deposits[0].orig_addr;
    let stats8: number = respData.deposits[0].dest_net;
    let stats7: string = respData.deposits[0].dest_addr;
    let stats6: number = respData.deposits[0].amount;
    let stats5: string = respData.deposits[0].metadata;
    
const respData2=Bridge2(stats1,stats2)   

let stat3:number=respData2.proof.main_exit_root
let stat11:number=respData2.proof.rollup_exit_root

let stats4:string=respData2.proof.merkle_proof

let merkleProofArray: string[] = respData2.proof.merkle_proof.split(",");
// console.log("response for stats  is:", [TYPE_RESPONSE, requestId, stats1,stats2,stat3,stats4,stats5,stats6,stats7,stats8,stats9,stats10,stat11]);
    return encodeReply([TYPE_RESPONSE, requestId,stats1,stats2,stat3,merkleProofArray,stats5,stats6,stats7,stats8,stats9,stats10,stat11]);
  }
 catch (error) {
    console.info("error as ")
    if (error === Error.FailedToFetchData) {
      throw error;
    } else {
      // ,number,number,string,string,number,string,number,string,number,number
      // Otherwise, tell the client we cannot process it
      console.log("errors", [TYPE_ERROR, requestId, error]);
      return encodeReply([TYPE_ERROR, requestId, errorToCode(error as Error),1,1,['sd','sdf','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],'23',2,'sd',3,'s',23,34]);
    }
  }
}