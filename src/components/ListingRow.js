import ButtonGroup from "reactstrap/lib/ButtonGroup";
import { Button } from "reactstrap";
import React from "react";

export default function ListingRow({ doc }) {
  return (
    <tr>
      <td>{doc.client}</td>
      <td>{doc.url}</td>
      <td>{doc.shortLink}</td>
      <td>{JSON.stringify(doc.createdAt)}</td>
      <td>
        <ButtonGroup size="sm">
          <Button onClick={() => this.deleteDoc(doc)}>Delete</Button>
          <Button tag="a" href={`${doc.shortLink}?d=1`} target="_blank">
            Preview
          </Button>
          <Button>Analytics</Button>
        </ButtonGroup>
      </td>
    </tr>
  );
}
