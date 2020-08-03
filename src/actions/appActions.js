import * as types from "./types";

export const setStartAndEnd = (
  startingBlock,
  endingBlock,
  userAddress,
  erc20Address,
  latestBlock = null
) => (dispatch) => {
  dispatch({
    type: types.SET_START_AND_END,
    payload: {
      startingBlock,
      endingBlock,
      userAddress: `${userAddress}_${erc20Address}`,
      latestBlock,
    },
  });
};

export const setReceivedData = (
  startingBlock,
  endingBlock,
  userAddress,
  erc20Address,
  data
) => (dispatch) => {
  dispatch({
    type: types.SET_RECEIVED_DATA,
    payload: {
      startingBlock,
      endingBlock,
      userAddress: `${userAddress}_${erc20Address}`,
      data,
    },
  });
};

export const setDataRetrievalCompleted = (userAddress) => (dispatch) => {
  dispatch({
    type: types.SET_DATA_RETRIEVAL_COMPLETED,
    payload: {
      userAddress,
    },
  });
};

export const resetAllData = (userAddress) => (dispatch) => {
  dispatch({
    type: types.RESET_ALL_DATA,
    payload: {
      userAddress,
    },
  });
};
