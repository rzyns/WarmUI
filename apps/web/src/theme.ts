// import { createTheme } from '@mantine/core';

// export const theme = createTheme({
//   /** Put your mantine theme override here */
// });
import { createTheme, type MantineColorsTuple } from "@mantine/core";

const myColor: MantineColorsTuple = [
    "#eeffe5",
    "#e0fbd1",
    "#c0f6a4",
    "#9ff173",
    "#83ec4a",
    "#70e930",
    "#66e820",
    "#54ce12",
    "#48b707",
    "#389e00",
];

export const theme = createTheme({
    colors: {
        myColor,
    },
});
