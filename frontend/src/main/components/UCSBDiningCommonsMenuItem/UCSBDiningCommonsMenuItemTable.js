import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";

import {
  cellToAxiosParamsDelete,
  onDeleteSuccess,
} from "main/utils/UCSBDiningCommonsMenuItemUtils";

import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function UCSBDiningCommonsMenuItemTable({
  diningCommonsMenuItem,
  currentUser,
}) {
  const navigate = useNavigate();

  const editCallback = (cell) => {
    navigate(`/ucsbDiningCommonsMenuItem/edit/${cell.row.values.id}`);
  };

  const deleteMutation = useBackendMutation(
    cellToAxiosParamsDelete,
    { onSuccess: onDeleteSuccess },
    ["/api/ucsbDiningCommonsMenuItem/all"],
  );

  const deleteCallback = async (cell) => {
    deleteMutation.mutate(cell);
  };

  const columns = [
    {
      Header: "id",
      accessor: "id",
    },
    {
      Header: "Dining Commons Code",
      accessor: "diningCommonsCode",
    },
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Station",
      accessor: "station",
    },
  ];

  if (hasRole(currentUser, "ROLE_ADMIN")) {
    columns.push(
      ButtonColumn(
        "Edit",
        "primary",
        editCallback,
        "UCSBDiningCommonsMenuItemTable",
      ),
    );
    columns.push(
      ButtonColumn(
        "Delete",
        "danger",
        deleteCallback,
        "UCSBDiningCommonsMenuItemTable",
      ),
    );
  }

  return (
    <OurTable
      data={diningCommonsMenuItem}
      columns={columns}
      testid={"UCSBDiningCommonsMenuItemTable"}
    />
  );
}
