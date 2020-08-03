import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  setStartAndEnd,
  setReceivedData,
  setDataRetrievalCompleted,
  resetAllData,
} from "../actions/appActions";
import styled from "styled-components";
import { Form, Button } from "react-bootstrap";
import { MDBDataTableV5 } from "mdbreact";
const Web3 = require("web3");
const PROVIDER = new Web3.providers.HttpProvider(
  "https://mainnet.infura.io/v3/6f8e7aa0b44943fd815f439b58334b67"
);
const web3 = new Web3(PROVIDER);
window.web3 = web3;

const Styles = styled.div`
  .homediv {
    margin-top: 10px;
  }
`;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userAddress: "",
      erc20Address: "",
      currentRunning: null,
    };
  }

  handleChange = (event, field) => {
    event.preventDefault();
    this.setState({ [field]: event.target.value });
  };

  resetData = () => {
    this.props.resetAllData(
      `${this.state.userAddress}_${this.state.erc20Address}`
    );
  };

  onSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    let latestBlock = null;
    const { appState } = this.props;
    try {
      const response = await web3.eth.getBlock("latest");
      latestBlock = response.number;
    } catch (err) {
      alert("Could not fetch latest block");
      return;
    }

    try {
      await web3.eth.getPastLogs({
        address: [this.state.erc20Address],
        topics: [
          [
            web3.utils.sha3("Transfer(address,address,uint256)"),
            web3.utils.sha3("Approval(address,address,uint256)"),
          ],
        ],
      });
    } catch (err) {
      if (err.message.indexOf("Provided address") !== -1) {
        alert(err.message);
        return;
      }
    }

    try {
      const { storedData } = appState;
      if (storedData[`${this.state.userAddress}_${this.state.erc20Address}`]) {
        const { completed } = storedData[
          `${this.state.userAddress}_${this.state.erc20Address}`
        ];
        const latestCompletedBlock =
          storedData[`${this.state.userAddress}_${this.state.erc20Address}`][
            "latestBlock"
          ];
        if (completed) {
          const startingBlock = latestCompletedBlock;
          const endingBlock = latestBlock;
          const response1 = await web3.eth.getPastLogs({
            fromBlock: startingBlock,
            toBlock: endingBlock,
            address: [this.state.erc20Address],
            topics: [
              [
                web3.utils.sha3("Approval(address,address,uint256)"),
                web3.utils.sha3("Transfer(address,address,uint256)"),
              ],
              null,
              [
                web3.utils.padLeft(this.state.userAddress, 64),
                web3.utils.padLeft(this.state.userAddress, 64),
              ],
            ],
          });
          const response2 = await web3.eth.getPastLogs({
            fromBlock: startingBlock,
            toBlock: endingBlock,
            address: [this.state.erc20Address],
            topics: [
              [
                web3.utils.sha3("Approval(address,address,uint256)"),
                web3.utils.sha3("Transfer(address,address,uint256)"),
              ],
              [
                web3.utils.padLeft(this.state.userAddress, 64),
                web3.utils.padLeft(this.state.userAddress, 64),
              ],
            ],
          });
          const response = [...response1, ...response2];
          // console.log(response);
          setReceivedData(
            startingBlock,
            endingBlock,
            this.state.userAddress,
            this.state.erc20Address,
            response
          );
          return;
        }
      }
    } catch (err) {}

    try {
      this.setState({ currentlyRunning: true });

      const { storedData } = appState;
      let currentOffset = 100000;
      let endingBlock = latestBlock;
      let startingBlock = latestBlock - currentOffset;
      if (startingBlock < 0) startingBlock = 1;
      if (
        storedData &&
        storedData[`${this.state.userAddress}_${this.state.erc20Address}`] &&
        storedData[`${this.state.userAddress}_${this.state.erc20Address}`][
          "endingBlock"
        ] &&
        storedData &&
        storedData[`${this.state.userAddress}_${this.state.erc20Address}`][
          "startingBlock"
        ]
      ) {
        endingBlock =
          storedData[`${this.state.userAddress}_${this.state.erc20Address}`][
            "endingBlock"
          ];
        startingBlock =
          storedData[`${this.state.userAddress}_${this.state.erc20Address}`][
            "startingBlock"
          ];
      }
      const { setStartAndEnd, setReceivedData } = this.props;
      setStartAndEnd(
        startingBlock,
        endingBlock,
        this.state.userAddress,
        this.state.erc20Address,
        latestBlock
      );
      while (startingBlock > 0) {
        try {
          // startingBlock = 8411835;
          // endingBlock = 8411850;
          const response1 = await web3.eth.getPastLogs({
            fromBlock: startingBlock,
            toBlock: endingBlock,
            address: [this.state.erc20Address],
            topics: [
              [
                web3.utils.sha3("Approval(address,address,uint256)"),
                web3.utils.sha3("Transfer(address,address,uint256)"),
              ],
              null,
              [
                web3.utils.padLeft(this.state.userAddress, 64),
                web3.utils.padLeft(this.state.userAddress, 64),
              ],
            ],
          });
          const response2 = await web3.eth.getPastLogs({
            fromBlock: startingBlock,
            toBlock: endingBlock,
            address: [this.state.erc20Address],
            topics: [
              [
                web3.utils.sha3("Approval(address,address,uint256)"),
                web3.utils.sha3("Transfer(address,address,uint256)"),
              ],
              [
                web3.utils.padLeft(this.state.userAddress, 64),
                web3.utils.padLeft(this.state.userAddress, 64),
              ],
            ],
          });
          const response = [...response1, ...response2];
          // console.log(response);
          setReceivedData(
            startingBlock,
            endingBlock,
            this.state.userAddress,
            this.state.erc20Address,
            response
          );
          endingBlock = startingBlock;
          startingBlock = endingBlock - currentOffset;
          if (startingBlock < 0) startingBlock = 1;
          setStartAndEnd(
            startingBlock,
            endingBlock,
            this.state.userAddress,
            this.state.erc20Address
          );
        } catch (err) {
          if (err.message && err.message.indexOf("10000") !== -1) {
            currentOffset = currentOffset - 5000;
            startingBlock = latestBlock - currentOffset;
          } else {
            this.setState({ currentlyRunning: false });
          }
          console.log(err);
        }

        // if (
        //   storedData[this.state.userAddress] &&
        //   storedData[this.state.userAddress]["data"].length >= 5000
        // ) {
        //   break;
        // }
      }
      setDataRetrievalCompleted(
        `${this.state.userAddress}_${this.state.erc20Address}`
      );
      this.setState({ currentlyRunning: false });
    } catch (err) {
      alert(err);
      this.setState({ currentlyRunning: false });
    }
  };

  render() {
    const { appState } = this.props;
    let startingBlock = null;
    let endingBlock = null;
    let data = [];
    let datatable = {
      columns: [
        {
          label: "Block Number",
          field: "blocknumber",
        },
        {
          label: "Address",
          field: "address",
        },
        {
          label: "Block Hash",
          field: "blockhash",
        },
        {
          label: "Transaction Hash",
          field: "txnhash",
        },
      ],
      rows: [],
    };
    if (
      appState.storedData &&
      appState.storedData[
        `${this.state.userAddress}_${this.state.erc20Address}`
      ] &&
      appState.storedData[
        `${this.state.userAddress}_${this.state.erc20Address}`
      ]["startingBlock"]
    ) {
      startingBlock =
        appState.storedData[
          `${this.state.userAddress}_${this.state.erc20Address}`
        ]["startingBlock"];
      endingBlock =
        appState.storedData[
          `${this.state.userAddress}_${this.state.erc20Address}`
        ]["endingBlock"];
      data =
        appState.storedData[
          `${this.state.userAddress}_${this.state.erc20Address}`
        ]["data"];
      datatable =
        appState.datatable[
          `${this.state.userAddress}_${this.state.erc20Address}`
        ];
    }
    return (
      <Styles>
        <div className="homediv">
          <Form onSubmit={this.onSubmit}>
            <Form.Group controlId="formBasicAddress">
              <Form.Label>User's ETH Address</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter address"
                value={this.state.userAddress}
                onChange={(e) => this.handleChange(e, "userAddress")}
                disabled={this.state.currentlyRunning}
              />
            </Form.Group>
            <Form.Group controlId="formBasicAssetAddress">
              <Form.Label>Desired ERC20 Token Address</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter Address"
                value={this.state.erc20Address}
                onChange={(e) => this.handleChange(e, "erc20Address")}
                disabled={this.state.currentlyRunning}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              disabled={this.state.currentlyRunning}
            >
              Submit
            </Button>{" "}
            <Button
              variant="danger"
              disabled={this.state.currentlyRunning}
              onClick={this.resetData}
            >
              Reset
            </Button>
          </Form>
          <br />
          {startingBlock && endingBlock && !!this.state.currentlyRunning && (
            <span>
              <b>{`Currently Scanning blocks: ${startingBlock}-${endingBlock}`}</b>
            </span>
          )}
          <br />
          <span>{`Total data count: ${
            appState &&
            appState.storedData &&
            appState.storedData[
              `${this.state.userAddress}_${this.state.erc20Address}`
            ] &&
            appState.storedData[
              `${this.state.userAddress}_${this.state.erc20Address}`
            ]["data"]
              ? appState.storedData[
                  `${this.state.userAddress}_${this.state.erc20Address}`
                ]["data"].length
              : 0
          }`}</span>
          <br />
          <span>
            <b>Total Transactions Found: {data ? data.length : 0}</b>
          </span>
          <MDBDataTableV5
            hover
            entriesOptions={[25, 50, 100]}
            entries={25}
            data={datatable}
          />
        </div>
      </Styles>
    );
  }
}

Home.propTypes = {
  appState: PropTypes.object.isRequired,
  setStartAndEnd: PropTypes.func.isRequired,
  setReceivedData: PropTypes.func.isRequired,
  setDataRetrievalCompleted: PropTypes.func.isRequired,
  resetAllData: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  appState: state.appStateReducer,
});

export default connect(mapStateToProps, {
  setStartAndEnd,
  setReceivedData,
  setDataRetrievalCompleted,
  resetAllData,
})(Home);
