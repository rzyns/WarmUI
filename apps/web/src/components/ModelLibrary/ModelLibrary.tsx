import { Model, RawModel } from "@rzyns/swarmui-client/model/Model.js";
import {
    type MRT_SortingState,
    type MRT_RowVirtualizer,
    useMantineReactTable,
    MantineReactTable,
    MRT_ColumnDef,
    MRT_GlobalFilterTextInput,
    MRT_TablePagination,
    flexRender,
    MRT_TableBodyCellValue,
    MRT_ToolbarAlertBanner,
    MRT_TableInstance,
    MRT_RowSelectionState,
    getMRT_RowSelectionHandler,
} from "mantine-react-table";
import { useEffect, useRef, useState } from "react";
import { SwarmUIClient } from "@rzyns/swarmui-client/SwarmUIClient.js";
import { ModelType } from "@rzyns/swarmui-client/model/ModelType.js";
import { Container, Divider, Flex, Grid, Stack, TagsInput, Title } from "@mantine/core";
import { ModelCard } from "../ModelCard/ModelCard";
import { useAtomState } from "@zedux/react";
import { selectedModelAtom } from "@/atoms";

export function ModelLibrary() {
    const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);
    const [data, setData] = useState<Model[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sorting, setSorting] = useState<MRT_SortingState>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useAtomState(selectedModelAtom);

    const columns = Object.keys(RawModel.shape).map((field) => ({
        accessorKey: field,
        header: field,
        size: 150,
    } satisfies MRT_ColumnDef<Model>));

    useEffect(() => {
        try {
            //scroll to the top of the table when the sorting changes
            // rowVirtualizerInstanceRef.current?.scrollToIndex(0);
        } catch (e) {
            console.log(e);
        }
    }, [sorting]);

    useEffect(() => {
        const fetchData = async () => {
            const client = new SwarmUIClient();

            setIsLoading(true);

            await client.getNewSession();

            const models = await client.listModels({ depth: 1, path: "/il/00 other", subtype: ModelType.enum.LoRA });

            if (models.success) {
                setData(models.result.files);
            }
        };

        if (typeof window !== 'undefined') {
            fetchData().then(
                () => { },
                (e) => { throw new Error("Something went wrong", { cause: e }); },
            ).finally(() => setIsLoading(false));
        }
    }, []);

    const table = useMantineReactTable({
        columns,
        data,
        // enableBottomToolbar: true,
        // enableColumnResizing: true,
        enableColumnVirtualization: false,
        enableRowSelection: true,
        enableMultiRowSelection: false,
        // enableGlobalFilterModes: false,
        // enablePagination: false,
        // enableColumnPinning: false,
        // enableRowNumbers: true,
        enableRowVirtualization: true,
        // mantineTableContainerProps: {},
        onSortingChange: setSorting,
        onRowSelectionChange: setSelectedModel,
        state: { isLoading, sorting, rowSelection: selectedModel },
        rowVirtualizerInstanceRef,
        rowVirtualizerOptions: { overscan: 5 },
        // columnVirtualizerOptions: { overscan: 2 },
    });

    return (
        <Stack>
            <Divider />
            <Title order={4}>My Custom Headless Table</Title>
            <Flex justify="space-between" align="center">
                <TagsInput
                    placeholder="tags"
                    data={array_unique(table.getRowModel().flatRows.flatMap((row) => row.original.tags ?? []))}
                    value={[]}
                    onChange={(value) => setSelectedTags(value ?? [])}
                />
                <MRT_GlobalFilterTextInput table={table} />
                <MRT_TablePagination table={table} />
            </Flex>
            <Divider />
            <Grid fz="md" m="0" columns={4}>
                {table.getPaginationRowModel().rows.map((row, i) => (
                    <Grid.Col key={i} span={1} onClick={() => row.toggleSelected()} bg={row.getIsSelected() ? "gray" : "transparent"}>
                        <ModelCard model={row.original} />
                        <div>{JSON.stringify(row.getIsSelected())}</div>
                        {/* <div>{JSON.stringify(selectedModel)}</div> */}
                    </Grid.Col>
                ))}
            </Grid>
            <MRT_ToolbarAlertBanner stackAlertBanner table={table} />
        </Stack>
    );
}

function array_unique<A>(a: A[]): A[] {
    return Array.from(new Set(a));
}
