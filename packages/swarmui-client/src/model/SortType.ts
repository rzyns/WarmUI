import * as z from "zod";

export enum SortTypeEnum {
    // sortBy	String	What to sort the list by - Name, DateCreated, or `DateModified.	Name
    NAME = "Name",
    DATE_CREATED = "DateCreated",
    DATE_MODIFIED = "DateModified",
}

export const SortType = z.nativeEnum(SortTypeEnum);
export type SortType = z.output<typeof SortType>;
