import React, { useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
} from "reactstrap";

const isURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export default function CreateLinkQuickAction({ onChange, apiClient }) {
  const [url, setURL] = useState("");
  const [error, setError] = useState("");

  const onSubmit = event => {
    event.preventDefault();
    if (isURL(url)) {
      apiClient.post("links", { url }).then((response) => {
        setURL("");
        onChange(response.data);
      });
    } else {
      setError("Incorrect URL");
    }
  };

  return (
    <Card>
      <CardBody>
        <Form onSubmit={onSubmit}>
          <InputGroup>
            <Input
              type="text"
              value={url}
              onChange={(e) => {
                setURL(e.target.value);
                setError("");
              }}
            />
            <InputGroupAddon addonType="append">
              <Button>Create</Button>
            </InputGroupAddon>
          </InputGroup>
        </Form>
        {error && (<Alert color="warning" className="mt-2">{error}</Alert>)}
      </CardBody>
    </Card>
  );
}
