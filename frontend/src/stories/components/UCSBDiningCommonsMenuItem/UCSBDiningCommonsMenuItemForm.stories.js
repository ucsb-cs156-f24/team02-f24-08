import React from "react";
import UCSBDateForm from "main/components/UCSBDates/UCSBDateForm";
import { ucsbDatesFixtures } from "fixtures/ucsbDatesFixtures";

export default {
  title: "comonents/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm",
  component: UCSBDiningCommonsMenuItemForm,
};

const Template = (args) => {
  return <UCSBDiningCommonsMenuItemForm {...args} />;
};

export const Create = Template.bind({});

Create.args = {
  buttonLabel: "Create",
  submitAction: (data) => {
    console.log("Submit was clicked with data: ", data);
    window.alert("Submit was clicked with data: " + JSON.stringify(data));
  },
};

export const Update = Template.bind({});

Update.args = {
  initialContents: ucsbDiningCommonsMenuItemFixtures.oneDiningCommonsMenuItem,
  buttonLabel: "Update",
  submitAction: (data) => {
    console.log("Submit was clicked with data: ", data);
    window.alert("Submit was clicked with data: " + JSON.stringify(data));
  },
};
