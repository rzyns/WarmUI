import * as React from "react";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { ActionIcon, Badge, Box, Code, Group, Text, TextInput, Tooltip, UnstyledButton } from "@mantine/core";
import { Link } from "@/Link";
import { UserButton } from "../UserButton/UserButton";
import classes from "./NavbarSearch.module.css";

export type Collection = {
    label: string;
    emoji: string;
};

export type NavbarSearchProps = {
    links: Link[];
    collections: Collection[];
};

export function NavbarSearch({ links, collections }: NavbarSearchProps) {
    const mainLinks = links.map((link) => (
        <UnstyledButton key={link.label} className={classes.mainLink}>
            <div className={classes.mainLinkInner}>
                <link.icon size={20} className={classes.mainLinkIcon} stroke={1.5} />
                <Link to={link.path}>{link.label}</Link>
            </div>
            {link.notifications && (
                <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
                    {link.notifications}
                </Badge>
            )}
        </UnstyledButton>
    ));

    const collectionLinks = collections.map((collection) => (
        <a
            href="#"
            onClick={(event) => event.preventDefault()}
            key={collection.label}
            className={classes.collectionLink}
        >
            <Box component="span" mr={9} fz={16}>
                {collection.emoji}
            </Box>{" "}
            {collection.label}
        </a>
    ));

    return (
        <nav className={classes.navbar}>
            <div className={classes.section}>
                <UserButton />
            </div>

            <TextInput
                placeholder="Search"
                size="xs"
                leftSection={<IconSearch size={12} stroke={1.5} />}
                rightSectionWidth={70}
                rightSection={<Code className={classes.searchCode}>Ctrl + K</Code>}
                styles={{ section: { pointerEvents: "none" } }}
                mb="sm"
            />

            <div className={classes.section}>
                <div className={classes.mainLinks}>{mainLinks}</div>
            </div>

            <div className={classes.section}>
                <Group className={classes.collectionsHeader} justify="space-between">
                    <Text size="xs" fw={500} c="dimmed">
                        Collections
                    </Text>
                    <Tooltip label="Create collection" withArrow position="right">
                        <ActionIcon variant="default" size={18}>
                            <IconPlus size={12} stroke={1.5} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
                <div className={classes.collections}>{collectionLinks}</div>
            </div>
        </nav>
    );
}

export default NavbarSearch;
