import buildingStore from "../System/Lib/Widgets";

function getText() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("INI adalah text");
        }, 1000);
    });
}

interface TypedData {
    No: number;
    Name: string;
    Email: string;
    Phone: string;
    Address: string;
}

const useSampleState = buildingStore(
    {
        number: 0,
        text: "",
        data: [] as TypedData[],
    },
    {
        init: (state, { payload }) => {
            state.text = payload;
        },
        increment: (state,  {payload }) => {
            state.number += payload;
        },
        decrement: (state, {payload}) => {
            state.number -= payload;
        },
    },
    ibnu => getText().then(x => ibnu(x)),
    ibnu => ({
        lower: () => ibnu().text.toLowerCase(),
        upper: () => ibnu().text.toUpperCase()
    })
);

export default useSampleState;