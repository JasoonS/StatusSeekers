import Web3 from 'web3'
import { computeNonceSignature } from '../../SeekerBackend/utils/tokenIssue'

export const actions = {
  LOADING_KEYWORD: 'LOADING_KEYWORD',
  ADD_KEYWORD: 'ADD_KEYWORD',
  MOVE_KEYWORD: 'MOVE_KEYWORD',
}

// TODO:: check that all parameters to this funciton are necessary
export const fetchKeyword = (statusSeekerInstance, web3, accounts) => {
  const internalWeb3 = web3 // This is a hack to make sure web3 has promises
  return async dispatch => {
    dispatch({
      type: actions.LOADING_KEYWORD,
    })
    // Generate random number between 0 and 11. Once we have implemented QR code support
    // this id will be generated when the users scans the QR and the corresponding word
    // will be returned without giving away it's position in the array.
    const id = Math.floor((Math.random() * 12));
    const web3 = new Web3()

    const result = await fetch('api/fetchKeyword', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({tokenIndex: 1})
    }).then(res => res.json(res))

    if (result.success == false) {
      // TODO:: check that the nonce is correctly signed
      try {
        const sig = await computeNonceSignature(result.nonce + 1, accounts[0], internalWeb3)
      } catch (e) {
        console.warn(e)
      }
    }

    statusSeekerInstance.getWord(id).then(function(keywordHex) {
      // Convert from bytes32 to string
      let keyword = web3.toAscii(keywordHex)

      // Update state with the result.
      dispatch ({
        type: actions.ADD_KEYWORD,
        keyword
      })
    })
  }
}

export const moveKeywordInList = (dragIndex, hoverIndex) => ({
  type: actions.MOVE_KEYWORD,
  dragIndex,
  hoverIndex,
})
