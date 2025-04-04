import * as swarmui from "@rzyns/swarmui-client";
import { api, atom, createStore, injectStore } from "@zedux/react";
import { MRT_RowData, MRT_RowSelectionState, MRT_SortingState, MRT_TableState } from "mantine-react-table";

export const selectedModelAtom = atom<MRT_RowSelectionState>("selectedModel", () => {
    return createStore<MRT_RowSelectionState>(null, {});
});

// export const tableStateAtom = atom("tableState", () => {
//     const store = injectStore<MRT_TableState<Model>>();

//     store.use({
//         columnFilterFns: injectStore(),
//         columnFilters: injectStore(),
//         columnOrder: injectStore(),
//         columnPinning: injectStore(),
//         columnSizing: injectStore(),
//         columnSizingInfo: injectStore(),
//         columnVisibility: injectStore(),
//         creatingRow: injectStore(),
//         density: injectStore(),
//         editingRow: injectStore(),
//         globalFilter: injectStore(),
//         globalFilterFn: injectStore(),
//         draggingColumn: injectStore(),
//         draggingRow: injectStore(),
//         editingCell: injectStore(),
//         expanded: injectStore(),
//         grouping: injectStore(),
//         hoveredColumn: injectStore(),
//         hoveredRow: injectStore(),
//         isFullScreen: injectStore(),
//         isLoading: injectStore(),
//         isSaving: injectStore(),
//         pagination: injectStore(),
//         rowPinning: injectStore(),
//         rowSelection: injectStore(),
//         showAlertBanner: injectStore(),
//         showColumnFilters: injectStore(),
//         showGlobalFilter: injectStore(),
//         showLoadingOverlay: injectStore(),
//         showProgressBars: injectStore(),
//         showSkeletons: injectStore(),
//         showToolbarDropZone: injectStore(),
//         sorting: injectStore(),
//     } satisfies KnownHierarchyDescriptor<MRT_TableState<Model>>);
//     return store;
// });

export type WarmUI_ManagedTableState = Pick<
    MRT_TableState<swarmui.model.Model>,
    "isLoading" | "sorting" | "rowSelection"
>;
export const _tableStateAtom = atom<WarmUI_ManagedTableState>("tableState", {
    isLoading: false,
    rowSelection: {},
    sorting: [],
} satisfies WarmUI_ManagedTableState);

export const tableStateAtom = atom("tableState", () => {
    const store = injectStore<WarmUI_ManagedTableState>();

    return api(store).setExports({
        setIsLoading: (isLoading: boolean) => store.setState((state) => ({ ...state, isLoading })),
        setRowSelection: (rowSelection: MRT_RowSelectionState) =>
            store.setState((state) => ({ ...state, rowSelection })),
        setSorting: (sorting: MRT_SortingState) => store.setState((state) => ({ ...state, sorting })),
    });
});

export function emptyTableState<A extends MRT_RowData>(): MRT_TableState<A> {
    return {
        columnFilterFns: {},
        columnFilters: [],
        columnOrder: [],
        columnPinning: {},
        columnSizing: {},
        columnSizingInfo: {
            columnSizingStart: [],
            deltaOffset: null,
            deltaPercentage: null,
            isResizingColumn: false,
            startOffset: null,
            startSize: null,
        },
        columnVisibility: {},
        creatingRow: null,
        density: "md",
        editingRow: null,
        globalFilter: null,
        globalFilterFn: "fuzzy",
        draggingColumn: null,
        draggingRow: null,
        editingCell: null,
        expanded: true,
        grouping: [],
        hoveredColumn: null,
        hoveredRow: null,
        isFullScreen: false,
        isLoading: false,
        isSaving: false,
        pagination: {
            pageIndex: 0,
            pageSize: 0,
        },
        rowPinning: {},
        rowSelection: {},
        showAlertBanner: true,
        showColumnFilters: true,
        showGlobalFilter: true,
        showLoadingOverlay: true,
        showProgressBars: true,
        showSkeletons: true,
        showToolbarDropZone: true,
        sorting: [],
    };
}

export function injectIndexedDb() {}
