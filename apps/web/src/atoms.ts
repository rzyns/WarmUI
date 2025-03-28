import { atom, createStore } from "@zedux/react";
import { MRT_RowSelectionState } from "mantine-react-table";

export const selectedModelAtom = atom<MRT_RowSelectionState>("selectedModel", () => {
    return createStore<MRT_RowSelectionState>(null, {});
});
