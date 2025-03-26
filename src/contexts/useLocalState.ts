import buildingStore from "../System/Lib/Widgets";

interface TypedField {
    title: string;
    width: number;
}

const fields: TypedField[] = [
    {
        title: "Name",
        width: 250
    },
    {
        title: "Email",
        width: 250
    },
    {
        title: "Phone",
        width: 200
    },
    {
        title: "Address",
        width: 1000
    },
];

interface TypedData {
    No: number;
    Name: string;
    Email: string;
    Phone: string;
    Address: string;
}

export const dummyData: TypedData[] = [
    {
        No: 2,
        Name: "Jane Smith",
        Email: "jane.smith@example.com jane.smith@example.com jane.smith@example.com",
        Phone: "082345678901",
        Address: "Jl. Sudirman No. 456, Bandung, Indonesia"
    },
    {
        No: 3,
        Name: "Alice Johnson",
        Email: "alice.johnson@example.com",
        Phone: "083456789012",
        Address: "Jl. Gatot Subroto No. 789, Surabaya, Indonesia"
    },
    {
        No: 4,
        Name: "Bob Brown",
        Email: "bob.brown@example.com",
        Phone: "084567890123",
        Address: "Jl. Thamrin No. 101, Medan, Indonesia"
    },
    {
        No: 5,
        Name: "Charlie Davis",
        Email: "charlie.davis@example.com",
        Phone: "085678901234",
        Address: "Jl. Diponegoro No. 202, Yogyakarta, Indonesia"
    },
    {
        No: 6,
        Name: "Eva Green",
        Email: "eva.green@example.com",
        Phone: "086789012345",
        Address: "Jl. Ahmad Yani No. 303, Semarang, Indonesia"
    },
    {
        No: 7,
        Name: "Frank White",
        Email: "frank.white@example.com",
        Phone: "087890123456",
        Address: "Jl. Pahlawan No. 404, Malang, Indonesia"
    },
    {
        No: 8,
        Name: "Grace Black",
        Email: "grace.black@example.com",
        Phone: "088901234567",
        Address: "Jl. Hayam Wuruk No. 505, Denpasar, Indonesia"
    },
    {
        No: 9,
        Name: "Henry Wilson",
        Email: "henry.wilson@example.com",
        Phone: "089012345678",
        Address: "Jl. Gajah Mada No. 606, Palembang, Indonesia"
    },
    {
        No: 10,
        Name: "Ivy Taylor",
        Email: "ivy.taylor@example.com",
        Phone: "081123456789",
        Address: "Jl. Sisingamangaraja No. 707, Makassar, Indonesia"
    },
    {
        No: 11,
        Name: "Jack Harris",
        Email: "jack.harris@example.com",
        Phone: "082234567890",
        Address: "Jl. Teuku Umar No. 808, Balikpapan, Indonesia"
    },
    {
        No: 12,
        Name: "Karen Clark",
        Email: "karen.clark@example.com",
        Phone: "083345678901",
        Address: "Jl. Imam Bonjol No. 909, Manado, Indonesia"
    },
    {
        No: 13,
        Name: "Leo Lewis",
        Email: "leo.lewis@example.com",
        Phone: "084456789012",
        Address: "Jl. Diponegoro No. 111, Padang, Indonesia"
    },
    {
        No: 14,
        Name: "Mia Walker",
        Email: "mia.walker@example.com",
        Phone: "085567890123",
        Address: "Jl. Sudirman No. 222, Pekanbaru, Indonesia"
    },
    {
        No: 15,
        Name: "Nina Hall",
        Email: "nina.hall@example.com",
        Phone: "086678901234",
        Address: "Jl. Merdeka No. 333, Samarinda, Indonesia"
    },
    {
        No: 16,
        Name: "Oscar Young",
        Email: "oscar.young@example.com",
        Phone: "087789012345",
        Address: "Jl. Ahmad Yani No. 444, Banjarmasin, Indonesia"
    },
    {
        No: 17,
        Name: "Paul Allen",
        Email: "paul.allen@example.com",
        Phone: "088890123456",
        Address: "Jl. Gatot Subroto No. 555, Pontianak, Indonesia"
    },
    {
        No: 18,
        Name: "Quincy King",
        Email: "quincy.king@example.com",
        Phone: "089901234567",
        Address: "Jl. Thamrin No. 666, Jayapura, Indonesia"
    },
    {
        No: 19,
        Name: "Rachel Scott",
        Email: "rachel.scott@example.com",
        Phone: "081012345678",
        Address: "Jl. Pahlawan No. 777, Mataram, Indonesia"
    },
    {
        No: 20,
        Name: "Steve Adams",
        Email: "steve.adams@example.com",
        Phone: "082123456789",
        Address: "Jl. Hayam Wuruk No. 888, Kupang, Indonesia"
    }
];

const useLocalState = buildingStore(
    {
        search: "",
        isSelectOne: false,
        focus: false,
        fields: fields as TypedField[],
        select: -1,
        datastore: [] as TypedData[],
        scrollMode: "" as "" | "header" | "body" | "split",
        checkHeader: false,
        checkIndex: [] as boolean[],
        perRows: 10,
        page: 1,
    },
    {
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setPerRows: (state, action) => {
            state.perRows = action.payload;
        },
        setScrollMode: (state, action) => {
            state.scrollMode = action.payload;
        },
        setData: (state, action) => {
            state.datastore = action.payload;
            state.datastore.forEach(() => {
                state.checkIndex.push(false);
            });
        },
        setSelect: (state, action) => {
            state.select = action.payload;
        },
        setSearch: (state, action) => {
            state.search = action.payload;
        },
        setFocus: (state, action) => {
            state.focus = action.payload;
        },
        setCheckIndex: (state) => {
            state.checkIndex = state.checkIndex.map(() => false);
        },
        setCheckByIndex: (state, action) => {
            state.checkIndex[action.payload.index] = action.payload.value;
        },
        setCheckAll: (state, action) => {
            state.checkIndex = state.checkIndex.map(() => action.payload);
            state.checkHeader = action.payload;
        },
        setCheckHeder: (state, action) => {
            state.checkHeader = action.payload;
        },
    },
    () => false,
    getState => ({
        checkCheckedByIndex: (index: number) => {
            return getState().checkIndex[index];
        },
    })
);

export default useLocalState;