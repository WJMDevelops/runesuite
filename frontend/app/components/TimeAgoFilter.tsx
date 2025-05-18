import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import type { IDoesFilterPassParams } from "ag-grid-community";
import type { CustomFilterProps } from "ag-grid-react";
import { useGridFilter } from "ag-grid-react";

// Time unit options for the filter
const timeUnits = [
  { value: "seconds", label: "Seconds" },
  { value: "minutes", label: "Minutes" },
  { value: "hours", label: "Hours" },
  { value: "days", label: "Days" },
  { value: "months", label: "Months" },
  { value: "years", label: "Years" },
];

// Type for filter model
interface TimeAgoFilterModel {
  type: "equals" | "lessThan" | "greaterThan";
  value: number;
  unit: string;
}

// TimeAgoFilter Component
const TimeAgoFilter = forwardRef(
  (
    {
      model,
      onModelChange,
      getValue,
    }: CustomFilterProps<any, any, { value: string }>,
    ref
  ) => {
    const [filterType, setFilterType] = useState<
      "equals" | "lessThan" | "greaterThan"
    >("lessThan");
    const [value, setValue] = useState<number>(5);
    const [unit, setUnit] = useState<string>("minutes");
    // Convert time to seconds based on unit
    const getTimeInSeconds = (value: number, unit: string): number => {
      switch (unit) {
        case "seconds":
          return value;
        case "minutes":
          return value * 60;
        case "hours":
          return value * 60 * 60;
        case "days":
          return value * 24 * 60 * 60;
        case "months":
          return value * 30 * 24 * 60 * 60; // Approximate
        case "years":
          return value * 365 * 24 * 60 * 60; // Approximate
        default:
          return value;
      }
    };

    // Implement the filter logic
    const doesFilterPass = useCallback(
      ({ node }: IDoesFilterPassParams) => {
        // Get timestamp from params
        const timestamp = getValue(node);
        if (!timestamp) return false;

        // Current time in seconds (unix timestamp)
        const now = Math.floor(Date.now() / 1000);

        // Time difference in seconds
        const diffSeconds = now - timestamp;

        // Filter value in seconds
        const filterValueInSeconds = getTimeInSeconds(value, unit);

        // Compare based on filter type
        switch (filterType) {
          case "equals":
            // Allow some flexibility for "equals" (within 5% of the value)
            const margin = filterValueInSeconds * 0.05;
            return Math.abs(diffSeconds - filterValueInSeconds) <= margin;
          case "lessThan":
            return diffSeconds < filterValueInSeconds;
          case "greaterThan":
            return diffSeconds > filterValueInSeconds;
          default:
            return false;
        }
      },
      [filterType, value, unit]
    );

    // Expose AG Grid required methods
    useImperativeHandle(ref, () => {
      return {
        componentMethod(message: string) {
          alert(`Alert from PartialMatchFilterComponent: ${message}`);
        },
      };
    });

    return (
      <div className="ag-filter-body-wrapper" style={{ padding: "10px" }}>
        <div className="ag-filter-body">
          <div style={{ marginBottom: "10px" }}>
            <select
              className="ag-filter-select"
              value={filterType}
              onChange={(e) => {
                setFilterType(
                  e.target.value as "equals" | "lessThan" | "greaterThan"
                );
              }}
              style={{ width: "100%", padding: "5px", marginBottom: "5px" }}
            >
              <option value="equals">Equals</option>
              <option value="lessThan">Less than</option>
              <option value="greaterThan">Greater than</option>
            </select>
          </div>

          <div
            style={{
              display: "flex",
              gap: "5px",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <input
              type="number"
              value={value}
              min={1}
              onChange={(e) => {
                setValue(parseInt(e.target.value) || 1);
              }}
              style={{ width: "80px", padding: "5px" }}
            />

            <select
              value={unit}
              onChange={(e) => {
                setUnit(e.target.value);
              }}
              style={{ padding: "5px", flexGrow: 1 }}
            >
              {timeUnits.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>

            <span>ago</span>
          </div>
        </div>

        <div className="ag-filter-apply-panel">
          <button
            type="button"
            className="ag-standard-button ag-filter-apply-panel-button"
            onClick={() => {}}
            style={{
              padding: "5px 10px",
              background: "var(--ag-control-panel-background-color)",
              border: "1px solid var(--ag-border-color)",
              borderRadius: "4px",
            }}
          >
            Apply Filter
          </button>
          <button
            type="button"
            className="ag-standard-button ag-filter-apply-panel-button"
            onClick={() => {
              setFilterType("lessThan");
              setValue(5);
              setUnit("minutes");
            }}
            style={{
              padding: "5px 10px",
              background: "var(--ag-control-panel-background-color)",
              border: "1px solid var(--ag-border-color)",
              borderRadius: "4px",
              marginLeft: "5px",
            }}
          >
            Reset
          </button>
        </div>
      </div>
    );
  }
);

export default TimeAgoFilter;
