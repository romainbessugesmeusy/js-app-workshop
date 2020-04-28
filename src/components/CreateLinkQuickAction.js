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
  Label,
} from "reactstrap";

const isURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};


const parallel = (tasks, callback) => {

}

export default function CreateLinkQuickAction({ eventBus, apiClient }) {
  const [url, setURL] = useState("");
  const [client, setClient] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (event) => {
    // Important! Bien penser à interrompre la propagation
    // des événements natifs, sinon la page sera rechargée
    event.preventDefault();
    console.info('Form submitted', { url, client });

    if (isURL(url)) {
      apiClient.post("links", { url, client }).then((response) => {
        setURL("");
        eventBus.dispatch("links:change", response)
      });
    } else {
      setError("Incorrect URL");
    }
  };

  return (
    <Card>
      <CardBody>
        <Form onSubmit={onSubmit}>
          <div>
            <Label>Client / Prospect</Label>
            <Input
              type="text"
              value={client}
              onChange={(e) => setClient(e.target.value)}
            />
          </div>
          <div>
            <Label>URL</Label>
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
          </div>
        </Form>
        {error && (
          <Alert color="warning" className="mt-2">
            {error}
          </Alert>
        )}
      </CardBody>
    </Card>
  );
}
