import { Card, CardProps, Code, Container, Grid, Image, Pill, PillGroup, Popover, ScrollArea, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Model } from "@rzyns/swarmui-client/model/Model.js";

export type ModelCardProps = CardProps & {
    model: Model,
};

export function ModelCard(props: ModelCardProps) {
    const [opened, { close, open }] = useDisclosure(false);

    const json = <Container size="md">
        <ScrollArea>
            <Code><pre>{JSON.stringify(props.model, null, 4)}</pre></Code>
        </ScrollArea>
    </Container>;

    const card = <Card {...props} withBorder mah={400}>
        <Card.Section withBorder inheritPadding py="xs">
            <Grid columns={3}>
                <Grid.Col span={1}>
                    <Text fw={500} onMouseEnter={open} onMouseLeave={close}>
                        {props.model.title}
                        {/* {popover(<span></span>, json, opened)} */}
                    </Text>
                    <Image src={props.model.preview_image} />
                    <PillGroup>{
                        (props.model.tags ?? []).map((tag, i) => (
                            <Pill key={i} color="blue" size="sm">
                                {tag}
                            </Pill>
                        ))
                    }</PillGroup>
                </Grid.Col>
                <Grid.Col span={2}>
                    <ScrollArea.Autosize mah={670} overscrollBehavior="contain auto">
                        <Text mt="sm" c="dimmed" size="sm" dangerouslySetInnerHTML={{ __html: props.model.description }} />
                    </ScrollArea.Autosize>
                </Grid.Col>
            </Grid>
        </Card.Section>
    </Card>;

    return card;
}

function popover(target: React.ReactNode, dropdown: React.ReactNode, opened: boolean) {
    return (
        <Popover opened={opened} position="top-start">
            <Popover.Target>{target}</Popover.Target>
            <Popover.Dropdown>{dropdown}</Popover.Dropdown>
        </Popover>
    )
}
