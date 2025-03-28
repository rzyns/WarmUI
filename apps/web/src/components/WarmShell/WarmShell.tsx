import { AppShell, Burger, Code, Group, Skeleton, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MantineLogo } from '@mantinex/mantine-logo';
import NavbarSearch from '../NavBarSearch/NavbarSearch';
import { routes } from '@/Router';
import { IconVector } from '@tabler/icons-react';
import { selectedModelAtom } from "../../atoms.js";
import { useAtomState } from '@zedux/react';

export function WarmShell({ children }: { children?: React.ReactNode }) {
    const [opened, { toggle }] = useDisclosure();
    const [selectedModel] = useAtomState(selectedModelAtom);

    return (
        <AppShell
            layout="alt"
            header={{ height: 60 }}
            footer={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            aside={{ width: 300, breakpoint: 'md', collapsed: { desktop: false, mobile: true } }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <MantineLogo size={30} />
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="md">
                <Group>
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <Text>Navbar</Text>
                </Group>
                <NavbarSearch links={routes} collections={[]} />
            </AppShell.Navbar>
            <AppShell.Main>
                {children}
            </AppShell.Main>
            <AppShell.Aside p="md"><Code><pre>{JSON.stringify(selectedModel, null, 4)}</pre></Code></AppShell.Aside>
            <AppShell.Footer p="md">Footer</AppShell.Footer>
        </AppShell>
    );
}

export default WarmShell;
