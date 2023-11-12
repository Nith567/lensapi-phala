// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./PhatRollupAnchor.sol";

contract TestLensApiConsumerContract is PhatRollupAnchor, Ownable {
    event ResponseReceived(uint reqId, string pair, uint256 value,uint n1,uint n2,string n3,uint n4 ,string n5,uint n6,string n7,uint n8,uint n9);
    event ErrorReceived(uint reqId, string pair, uint256 errno,uint n1,uint n2,string n3,uint n4 ,string n5,uint n6,string n7,uint n8,uint n9);

    uint constant TYPE_RESPONSE = 0;
    uint constant TYPE_ERROR = 2;

    mapping(uint => string) requests;
    uint nextRequest = 1;

    constructor(address phatAttestor) {
        _grantRole(PhatRollupAnchor.ATTESTOR_ROLE, phatAttestor);
    }

    function setAttestor(address phatAttestor) public {
        _grantRole(PhatRollupAnchor.ATTESTOR_ROLE, phatAttestor);
    }

    function request(string calldata profileId) public {
        // assemble the request
        uint id = nextRequest;
        requests[id] = profileId;
        _pushMessage(abi.encode(id, profileId));
        nextRequest += 1;
    }

    // For test
    function malformedRequest(bytes calldata malformedData) public {
        uint id = nextRequest;
        requests[id] = "malformed_req";
        _pushMessage(malformedData);
        nextRequest += 1;
    }

    function _onMessageReceived(bytes calldata action) internal override {
        require(action.length == 32 * 3, "cannot parse action");
        (uint respType, uint id, uint256 n,uint n1,uint n2,string memory n3,uint n4,string memory n5,uint n6,string memory n7, uint n8, uint n9) = abi.decode(
            action,
            (uint, uint, uint256,uint,uint,string,uint,string,uint,string,uint,uint)
        );
        if (respType == TYPE_RESPONSE) {
            emit ResponseReceived(id, requests[id],n,n1,n2,n3,n4,n5,n6,n7,n8,n9);
            delete requests[id];
        } else if (respType == TYPE_ERROR) {
            emit ErrorReceived(id, requests[id],n,n1,n2,n3,n4,n5,n6,n7,n8,n9);
            delete requests[id];
        }
    }
}
