import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/UCSBOrganizationUtils";
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function OrganizationTable({
  organizations,
  currentUser,
  testIdPrefix = "OrganizationTable",
}) {
  const navigate = useNavigate();

  const editCallback = (cell) => {
    navigate(`/ucsborganization/edit/${cell.row.values.orgCode}`);
  };

  // Stryker disable all : hard to test for query caching

  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess },
    ["/api/ucsborganization/all"],
  );
  // Stryker restore all

  const deleteCallback = async (cell) => {
    deleteMutation.mutate(cell);
  };

  const columns = [
    {
      Header: "Organization Code",
      accessor: "orgCode", // accessor is the "key" in the data
    },
    {
      Header: "Organization Translation Short",
      accessor: "orgTranslationShort",
    },
    {
      Header: "Organization Translation",
      accessor: "orgTranslation",
    },
    {
      Header: "Inactive",
      accessor: "inactive",
      // for boolean
      //   Cell: ({ cell }) => <span>{cell.value ? "True" : "False"}</span>,
      Cell: ({ value }) => (value ? "True" : "False"),
    },
  ];

  if (hasRole(currentUser, "ROLE_ADMIN")) {
    columns.push(ButtonColumn("Edit", "primary", editCallback, testIdPrefix));
    columns.push(
      ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix),
    );
  }

  return (
    <OurTable data={organizations} columns={columns} testid={testIdPrefix} />
  );
}
