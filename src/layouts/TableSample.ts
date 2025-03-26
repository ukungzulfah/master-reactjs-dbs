import { useSelector } from "react-redux";
import { Column, Root, Widget } from "../System/Lib/Widgets";
import { RootState } from "../store";
import { useEffect } from "react";
import useLocalState, { dummyData } from "../contexts/useLocalState";
import BodyTable from "./table/BodyTable";
import HeaderTable from "./table/HeaderTable";
import { HeaderRefProvider } from "../context/useHeaderRef";
import { BodyRefProvider } from "../context/useBodyRef";
import ToolbarTable from "./table/ToolbarTable";
import { SplitRefProvider } from "../context/useSplitRef";
import PaginationTable from "./table/PaginationTable";

export default function TableGenerate() {
  return Widget(HeaderRefProvider, {}, 
    Widget(BodyRefProvider, {}, 
      Widget(SplitRefProvider, {}, 
        Widget(App)
      )
    )
  )
}

function App() {
  const { colors } = useSelector((state: RootState) => state.theme);
  const store = useLocalState();

  useEffect(() => {
    store.setData([
      ...dummyData,
    ]);
  }, []);

  return Root({
    theme: colors,
    child: Column({
      color: "theme.background",
      children: [
        ToolbarTable(),
        HeaderTable(),
        BodyTable(),
        // FooterTable(),
        PaginationTable(),
      ]
    })
  }).builder();
}
