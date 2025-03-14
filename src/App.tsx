import { useState } from 'react';
import './App.css';
import { Root, Stack, Container, Draggable, Text, Icon, Column, Button, Portal, SizedBox } from './System/Lib/Widgets';

function App() {
  const [portal, setPortal] = useState<any>(null);

  return Root({
    fullscreen: true,
    color: "red",
    child: Stack({
      color: "black",
      children: [
        Draggable({
          child: Container({
            width: 300,
            height: 300,
            radius: 5,
            color: 'white',
            child: Column({
              center: true,
              children: [
                Icon('home', { size: 50, color: "red" }),
                Text('home', { size: 50, color: "red" }),
                Button("Create Portal", { icon: "play" }).click(() => {
                  const portal = Portal({
                    width: 500,
                    height: 500,
                    color: 'white',
                    top: 30,
                    left: 500,
                    child: Stack({
                      children: [
                        Container({
                          width: 400,
                          height: 400,
                          child: Text("SAMPLE")
                        })
                      ]
                    })
                  }).builder();
                  setPortal(portal);
                }),
                SizedBox({ height: 20 }),
                Button("Remove Portal", { icon: "play" }).click(() => {
                  if(portal) {
                    portal.unmount();
                  }
                }),
              ]
            })
          })
        }),
      ]
    })
  }).builder({ color: "blue" });
}

export default App;