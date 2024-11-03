import { Button, Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function UCSBDiningCommonsMenuItemForm({
  initialContents,
  submitAction,
  buttonLabel = "Create",
}) {
  //Stryker disable all
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: initialContents || {},
  });

  const navigate = useNavigate();

  return (
    <Form onSubmite={handleSubmit(submitAction)}>
      <Row>
        {initialContents && (
          <Col>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="id">ID</Form.Label>
              <Form.Control
                data-testid="UCSBDiningCommonsMenuItemForm-id"
                id="id"
                type="text"
                {...register("id")}
                value={initialContents.id}
                disabled
              />
            </Form.Group>
          </Col>
        )}

        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="diningCommonsCode">
              Dining Commons Code
            </Form.Label>
            <Form.Control
              data-testid="UCSBDiningCommonsMenuItemForm-diningCommonsCode"
              id="diningCommonsCode"
              type="text"
              {...register("diningCommonsCode", { required: true })}
              value={initialContents.diningCommonsCode}
              disabled
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="station">Station</Form.Label>
            <Form.Control
              data-testid="UCSBDiningCommonsMenuItemForm-station"
              id="station"
              type="text"
              {...register("station", { required: true })}
              value={initialContents.station}
              disabled
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="name">Name</Form.Label>
            <Form.Control
              data-testid="UCSBDiningCommonsMenuItemForm-name"
              id="name"
              type="text"
              {...register("name", { required: true })}
              value={initialContents.name}
              disabled
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Button
            type="submit"
            data-testid="UCSBDiningCommonsMenuItemForm-submit"
          >
            {buttonLabel}
          </Button>
          <Button
            variant="Secondary"
            onClick={() => {
              navigate(-1);
            }}
            data-testid="UCSBDiningCommonsMenuItemForm-cancel"
          ></Button>
        </Col>
      </Row>
    </Form>
  );
}

export default UCSBDiningCommonsMenuItemForm;
