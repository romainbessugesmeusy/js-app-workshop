import React, { Component } from "react";
import { Button, Table } from "reactstrap";
import ButtonGroup from "reactstrap/lib/ButtonGroup";
import ListingRow from "../components/ListingRow";

const getDateString = (firebaseDate) => {
  //const ts = new Timestamp(firebaseDate._seconds, firebaseDate._nanoseconds)
  //return ts.toDate().toLocaleString();
  return "";
};

class Listing extends Component {
  state = {
    docs: [],
    isLoading: false,
  };

  // Lifecycle methods
  componentDidMount() {
    this.props.eventBus.on("links:change", () => this.load());
    this.load();
  }

  componentWillUnmount() {
    this.setState({ docs: [] });
  }

  load = () => {
    this.setState({ isLoading: true }, () => {
      this.props.apiClient.get("links").then((response) => {
        this.setState({ docs: response.data, isLoading: false });
      });
    });
  };

  deleteDoc(doc) {
    this.props.apiClient.delete(`links/${doc.id}`).then(this.load);
  }

  render() {
    return (
      <div>
        <Table>
          <thead>
            <tr>
              <th>Client</th>
              <th>URL</th>
              <th>ShortLink</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.docs.map((doc) => (
              <ListingRow doc={doc} key={doc.id} />
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
}
export default Listing;
