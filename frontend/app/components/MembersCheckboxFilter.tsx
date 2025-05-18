// Custom Checkbox Filter for Members column
import { IDoesFilterPassParams } from "ag-grid-community";
import { CustomFilterProps, useGridFilter } from "ag-grid-react";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

export default forwardRef(
  (
    {
      model,
      onModelChange,
      getValue,
    }: CustomFilterProps<any, any, { value: string }>,
    ref
  ) => {
    const refInput = useRef<HTMLInputElement>(null);

    const doesFilterPass = useCallback(
      ({ node }: IDoesFilterPassParams) => {
        const value = getValue(node);
        switch (model?.value) {
          case "members":
            return value === true;
          case "non-members":
            console.log("found non-members");
            return value === false;
          default:
            return true;
        }
      },
      [model]
    );

    const afterGuiAttached = useCallback(() => {
      window.setTimeout(() => {
        refInput.current?.focus();
      });
    }, []);

    useGridFilter({
      doesFilterPass,
      afterGuiAttached,
    });

    // Expose AG Grid Filter Lifecycle callbacks
    useImperativeHandle(ref, () => {
      return {
        componentMethod(message: string) {
          alert(`Alert from MembersCheckboxFilter: ${message}`);
        },
      };
    });

    // Handle filter change
    const onFilterChange = (value: "all" | "members" | "non-members") => {
      onModelChange({ value });
    };

    return (
      <div className="ag-filter-body-wrapper ag-simple-filter-body-wrapper p-2">
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="memberFilter"
              checked={!model || model?.value === "all"}
              onChange={() => onFilterChange("all")}
              className="accent-blue-500"
            />
            <span>All Items</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="memberFilter"
              checked={model?.value === "members"}
              onChange={() => onFilterChange("members")}
              className="accent-blue-500"
            />
            <span>Members Only</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="memberFilter"
              checked={model?.value === "non-members"}
              onChange={() => onFilterChange("non-members")}
              className="accent-blue-500"
            />
            <span>Non-Members Only</span>
          </label>
        </div>
      </div>
    );
  }
);
