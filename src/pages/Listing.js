import React, { Component } from "react";
import { Button, Table } from "reactstrap";
import ButtonGroup from "reactstrap/lib/ButtonGroup";

const getDateString = (firebaseDate) => {
  return JSON.stringify(firebaseDate);
};

class Listing extends Component {
  state = {
    docs: [],
    isLoading: false,
  };

  componentDidMount() {
    this.props.eventBus.on("links:change", this.load);
    this.load();
  }

  load = () => {
    this.setState({ isLoading: true }, () => {
      this.props.apiClient.get("links").then((response) => {
        this.setState({ docs: response.data, isLoading: false });
      });
    });
  }

  deleteDoc(doc) {
    this.props.apiClient.delete(`links/${doc.id}`).then(this.load);
  }

  render() {
    return (
      <div>
        <Table>
          <thead>
            <tr>
              <th>URL</th>
              <th>ShortLink</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.state.docs.map((doc) => (
              <tr key={doc.shortLink}>
                <td>{doc.url}</td>
                <td>{doc.shortLink}</td>
                <td>{getDateString(doc.createdAt)}</td>
                <td>
                  <ButtonGroup size="sm">
                    <Button onClick={() => this.deleteDoc(doc)}>Delete</Button>
                    <Button
                      tag="a"
                      href={`${doc.shortLink}?d=1`}
                      target="_blank"
                    >
                      Preview
                    </Button>
                    <Button>Analytics</Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
}
export default Listing;
