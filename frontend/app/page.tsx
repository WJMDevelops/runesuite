"use client";

import { useState, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ClientSideRowModelModule,
  ColumnAutoSizeModule,
  ColDef,
  GridApi,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  DateFilterModule,
  themeQuartz,
  colorSchemeDark,
  ValidationModule,
  RowSelectionModule,
  CustomFilterModule,
  PaginationModule,
  CellStyleModule,
} from "ag-grid-community";
import MembersCheckboxFilter from "./components/MembersCheckboxFilter";
import MembersFloatingFilter from "./components/MembersFloatingFilter";
import TimeAgoFilter from "./components/TimeAgoFilter";

// Register only community modules
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  ColumnAutoSizeModule,
  ValidationModule,
  RowSelectionModule,
  CustomFilterModule,
  PaginationModule,
  CellStyleModule,
]);

// Define interface for item data structure
interface Item {
  best_sell_quantity: string;
  highalch: number;
  id: number;
  low: number;
  "low + 15%": number;
  max_profit: number;
  members: boolean;
  name: string;
  "sell 1 profit": number;
  "sell 1 profit 15%": number;
  "sell 10 profit": number;
  "sell 10 profit 15%": number;
  "sell 5 profit": number;
  "sell 5 profit 15%": number;
  "sell 50 profit": number;
  "sell 50 profit 15%": number;
  lowTime: number;
}

// Keys for sorting
type SortKey = keyof Item;

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false); // State to track refresh operation
  const [error, setError] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<SortKey>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    {
      name: true,
      low: true,
      best_sell_quantity: true,
      max_profit: true,
      lowTime: true,
      "sell 1 profit": true,
      "sell 5 profit": true,
      "sell 10 profit": true,
      "sell 50 profit": true,
      "low + 15%": false,
      "sell 1 profit 15%": false,
      "sell 5 profit 15%": false,
      "sell 10 profit 15%": false,
      "sell 50 profit 15%": false,
      highalch: false,
      members: true,
    }
  );
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);

  // Reference to the AG Grid API
  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  // Function to fetch items data
  const fetchItems = async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await fetch("http://172.21.183.57:5000/api/items");

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      setItems(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching items:", err);
      setError("Failed to load items. Please try again later.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Handle refresh button click
  const handleRefresh = () => {
    fetchItems(true);
  };

  // Fetch data on initial load
  useEffect(() => {
    fetchItems();
  }, []);

  // Sort function
  const handleSort = (column: SortKey) => {
    if (sortColumn === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New column, default to ascending
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  // Column config
  const columns = [
    { key: "name" as SortKey, label: "Name", align: "left" },
    { key: "low" as SortKey, label: "Low", align: "right" },
    {
      key: "best_sell_quantity" as SortKey,
      label: "Best Sell Quantity",
      align: "center",
    },
    {
      key: "max_profit" as SortKey,
      label: "Max Profit",
      align: "right",
    },
    { key: "lowTime" as SortKey, label: "Low Time", align: "center" },
    { key: "sell 1 profit" as SortKey, label: "Sell 1 Profit", align: "right" },
    { key: "sell 5 profit" as SortKey, label: "Sell 5 Profit", align: "right" },
    {
      key: "sell 10 profit" as SortKey,
      label: "Sell 10 Profit",
      align: "right",
    },
    {
      key: "sell 50 profit" as SortKey,
      label: "Sell 50 Profit",
      align: "right",
    },
    { key: "low + 15%" as SortKey, label: "Low + 15%", align: "right" },
    {
      key: "sell 1 profit 15%" as SortKey,
      label: "Sell 1 Profit 15%",
      align: "right",
    },
    {
      key: "sell 5 profit 15%" as SortKey,
      label: "Sell 5 Profit 15%",
      align: "right",
    },
    {
      key: "sell 10 profit 15%" as SortKey,
      label: "Sell 10 Profit 15%",
      align: "right",
    },
    {
      key: "sell 50 profit 15%" as SortKey,
      label: "Sell 50 Profit 15%",
      align: "right",
    },
    { key: "highalch" as SortKey, label: "HighAlch", align: "right" },
    { key: "members" as SortKey, label: "Members", align: "center" },
  ];

  // AG Grid Column Definitions
  const columnDefs = useMemo<ColDef[]>(() => {
    return columns
      .filter((column) => visibleColumns[column.key])
      .map((column) => {
        // Customize column definitions based on column type
        switch (column.key) {
          case "name":
            return {
              field: column.key,
              headerName: column.label,
              sortable: true,
              filter: "agTextColumnFilter",
              filterParams: {
                filterOptions: [
                  "contains",
                  "notContains",
                  "startsWith",
                  "endsWith",
                  "equals",
                  "notEqual",
                ],
                defaultOption: "contains",
                debounceMs: 200,
                caseSensitive: false,
              },
              resizable: true,
              pinned: "left",
              minWidth: 200,
            };
          case "members":
            return {
              field: column.key,
              headerName: column.label,
              sortable: true,
              // Use our custom filter component
              filter: MembersCheckboxFilter,
              // Configure floating filter for the header
              floatingFilter: true,
              floatingFilterComponent: MembersFloatingFilter,
              // Keep the cell renderer to display boolean as Yes/No
              cellRenderer: (params: { value: boolean }) =>
                params.value ? "Yes" : "No",
              resizable: true,
              width: 120,
              cellStyle: { textAlign: "center" },
            };
          case "best_sell_quantity":
            return {
              field: column.key,
              headerName: column.label,
              sortable: true,
              filter: "agNumberColumnFilter",
              resizable: true,
              width: 150,
              cellStyle: { textAlign: "center" },
            };
          case "lowTime":
            return {
              field: column.key,
              headerName: column.label,
              sortable: true,
              filter: TimeAgoFilter,
              filterParams: {
                filterOptions: ["equals", "notEqual", "inRange"],
                defaultOption: "equals",
                inRangeInclusive: true,
              },
              // Custom cell renderer to format Unix timestamp as relative time
              cellRenderer: (params: any) => {
                if (!params.value) return "N/A";
                
                const timestamp = params.value * 1000; // Convert to milliseconds
                const now = Date.now();
                const diffSeconds = Math.floor((now - timestamp) / 1000);
                
                // Format as relative time
                if (diffSeconds < 60) {
                  return `${diffSeconds} seconds ago`;
                } else if (diffSeconds < 3600) {
                  const minutes = Math.floor(diffSeconds / 60);
                  return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
                } else if (diffSeconds < 86400) {
                  const hours = Math.floor(diffSeconds / 3600);
                  return `${hours} hour${hours > 1 ? 's' : ''} ago`;
                } else {
                  const days = Math.floor(diffSeconds / 86400);
                  return `${days} day${days > 1 ? 's' : ''} ago`;
                }
              },
              resizable: true,
              width: 140,
              cellStyle: { textAlign: "center" },
            };
          default:
            // For all numeric columns
            return {
              field: column.key,
              headerName: column.label,
              sortable: true,
              filter: "agNumberColumnFilter",
              filterParams: {
                filterOptions: [
                  "equals",
                  "notEqual",
                  "lessThan",
                  "lessThanOrEqual",
                  "greaterThan",
                  "greaterThanOrEqual",
                  "inRange",
                ],
                defaultOption: "greaterThan",
                allowedCharPattern: "\\d\\-\\,\\.",
                inRangeInclusive: true,
              },
              cellRenderer: (params: any) => formatNumber(params.value),
              resizable: true,
              width: 140,
              cellStyle: { textAlign: "right" },
            };
        }
      });
  }, [columns, visibleColumns, formatNumber]);

  // Default grid options
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      minWidth: 100,
      flex: 1,
      floatingFilter: true,
      filterParams: {
        buttons: ["reset", "apply"],
        closeOnApply: true,
      },
    }),
    []
  );

  // Column visibility handler for AG Grid
  const onColumnVisibilityChanged = (params: any) => {
    const updatedVisibility = { ...visibleColumns };
    const allColumns = params.columnApi.getAllColumns();

    allColumns.forEach((column: any) => {
      const colId = column.getColId();
      if (colId !== "name") {
        // Name column always stays visible
        updatedVisibility[colId] = column.isVisible();
      }
    });

    setVisibleColumns(updatedVisibility);
  };

  // Set the theme based on dark mode
  const [theme, setTheme] = useState<
    "ag-theme-alpine" | "ag-theme-alpine-dark"
  >("ag-theme-alpine");

  // Effect to detect dark mode
  useEffect(() => {
    // Check if dark mode is active in the system
    const isDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(isDarkMode ? "ag-theme-alpine-dark" : "ag-theme-alpine");

    // Add listener for changes
    const darkModeListener = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "ag-theme-alpine-dark" : "ag-theme-alpine");
    };

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", darkModeListener);
    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", darkModeListener);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Duty Free Helper</h1>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className={`px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2 ${
              isRefreshing || isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isRefreshing ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Refreshing...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Refresh Data
              </>
            )}
          </button>

          <button
            onClick={() => setIsColumnDropdownOpen(!isColumnDropdownOpen)}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Column Visibility ▼
          </button>

          {isColumnDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-30 p-2 max-h-96 overflow-y-auto">
              <div className="flex justify-between items-center mb-2 px-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="font-medium">Show/Hide Columns</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsColumnDropdownOpen(false);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                {columns
                  .filter((column) => column.key !== "name") // Remove name from dropdown choices
                  .map((column) => (
                    <div
                      key={column.key}
                      className="px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center"
                    >
                      <input
                        type="checkbox"
                        id={`column-${column.key}`}
                        checked={visibleColumns[column.key]}
                        onChange={() => {
                          const updatedVisibility = {
                            ...visibleColumns,
                            [column.key]: !visibleColumns[column.key],
                          };
                          setVisibleColumns(updatedVisibility);
                        }}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`column-${column.key}`}
                        className="flex-grow text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                      >
                        {column.label}
                      </label>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-grow overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="flex-grow flex items-center justify-center">
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        ) : (
          <div
            className={`flex-grow ${theme}`}
            style={{ height: "calc(100vh - 220px)", width: "100%" }}
          >
            <AgGridReact
              theme={themeQuartz.withPart(colorSchemeDark)}
              rowData={items}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              animateRows={true}
              domLayout="normal"
              enableCellTextSelection={true}
              pagination={true}
              paginationPageSize={50}
              rowSelection="multiple"
              onGridReady={(params) => {
                setGridApi(params.api);
                params.api.sizeColumnsToFit();
              }}
              onFirstDataRendered={(params) => {
                params.api.sizeColumnsToFit();
              }}
              getRowId={(params) => params.data.id.toString()}
              onColumnVisible={onColumnVisibilityChanged}
            />
          </div>
        )}
      </div>
    </div>
  );
}
