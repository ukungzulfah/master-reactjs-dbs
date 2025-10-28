import { JSONTree } from "react-json-tree";
import { Column, Container, Center, Text, Expanded, SingleChildScrollView, Widget } from "../System/Lib/Widgets";
import { useEffect, useState } from "react";

const monokaiTheme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822', // Background utama
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e', // Warna ikon expand/collapse
  base04: '#a59f85',
  base05: '#f8f8f2', // Warna teks default
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672', // Warna untuk null, undefined
  base09: '#fd971f', // Warna untuk angka, boolean
  base0A: '#f4bf75',
  base0B: '#a6e22e', // Warna untuk string
  base0C: '#a1efe4',
  base0D: '#66d9ef', // Warna untuk key/nama properti
  base0E: '#ae81ff',
  base0F: '#cc6633'
};

export function SideLeft(props: any) {
  const { label } = props;
  const [values, setValue] = useState(props.value);
  useEffect(() => {
    console.log("props.value", props.value);
    setValue(props.value);
  }, [props.value]);

  return Column({
    children: [
      Container({
        height: 30,
        color: "#ccc",
        child: Center({ child: Text(label) })
      }),
      Expanded({
        child: SingleChildScrollView({
          child: Column({
            children: [
              Container({
                padding: 20,
                child: Widget(JSONTree, {
                  data: values,
                  theme: monokaiTheme,
                  invertTheme: true,
                  hideRoot: true,
                  shouldExpandNodeInitially: () => true,
                  collapsed: 2,
                })
              })
            ]
          })
        })
      })
    ]
  }).builder();
}
