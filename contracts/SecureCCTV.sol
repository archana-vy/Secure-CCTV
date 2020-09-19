// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 < 0.8.0;

contract SecureCCTV {
    uint public count = 0;

    struct Video {
        string id;
        string hashVal;
    }

    mapping(uint => Video) public videos;

    function addVideo(string memory _id,string memory _hash) public {
        count++;
        videos[count] = Video(_id, _hash);
    }
}