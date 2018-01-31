pragma solidity ^0.4.18;

contract StatusSeeker {
    
    bytes32[12] public keyWords;
    bytes32[12] public hashedKeyWords;

    function StatusSeeker(bytes32[12] _keyWords) public {
        keyWords = _keyWords;
    }

    function hasher(bytes32 _keyWord, uint256 _nonce) public pure returns (bytes32) {
        return keccak256(_keyWord, _nonce);
    } 

    function addRewardKeyWords(bytes32[12] _hashedKeyWords) public {
        hashedKeyWords = _hashedKeyWords;
    }

    function verify(bytes32[12] _attemptKeyWords, uint256[12] _nonce) public view returns (bool) {
        for (uint8 i = 0; i < 12; i++) {
            require(hashedKeyWords[i] == hasher(_attemptKeyWords[i], _nonce[i]));
        }
        return true;
    }
    
}
