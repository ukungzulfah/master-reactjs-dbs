import _ from "lodash";
import { Center, Click, Text, Column, Container, Expanded, Icon, MediaQuery, Modal, Positioned, Row, Space, Widget, TextField, Button, SizedBox } from "../../System/Lib/Widgets";
import { useState } from "react";
import ServiceProject from "../../services/ServiceProject";

function AddProjectComponent(_: any) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  return Positioned({
    left: (MediaQuery.width() - 500) / 2,
    top: 100,
    color: "white", 
    width: 500, 
    height: "auto", 
    radius: 12, 
    shadow: "0 4px 15px rgba(0, 0, 0, 0.1)", 
    overflow: "hidden", 
    child: Column({
      width: "100%", 
      children: [
        Container({
          color: "#f8f9fa", 
          height: 50, 
          padding: 10, 
          borderBottom: "1px solid #dee2e6", 
          child: Row({
            alignItems: "center", 
            children: [
              Expanded({
                child: Center({
                  child: Text("Create Project", {
                    fontSize: 16, 
                    fontWeight: "600",
                    color: "#343a40" 
                  })
                })
              }),

              Container({
                width: 40,
                height: 40,
                child: Click({
                  click: () => {
                    _.close();
                  },
                  child: Center({
                    child: Icon('close', { color: '#6c757d', size: 20 })
                  })
                })
              })
            ]
          })
        }),

        SizedBox({
          padding: 20,
          child: Column({
            gap: 5,
            children: [
              Text("Nama Proyek", {
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#495057",
                  textAlign: "left", 
                  width: "100%" 
              }),

              TextField({
                placeholder: "Project Name",
                radius: 6,
                fontSize: 14,
                value: name,
                onChange: (e: any) => setName(e.target.value),
              }),

              Text("Masukkan nama unik untuk proyek Anda.", {
                  fontSize: 12,
                  color: "#6c757d",
                  textAlign: "left",
                  width: "100%"
              }),
              Space(15),
              Text("Deskripsi Proyek", {
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#495057",
                  textAlign: "left",
                  width: "100%"
              }),
              Space(3),
              TextField({
                placeholder: "Project Description",
                radius: 6,
                fontSize: 14,
                value: description,
                rows: 4,
                multiline: true,
                width: "100%",
                onChange: (e: any) => setDescription(e.target.value),
              }),
              Text("Jelaskan secara singkat tentang proyek ini.", {
                  fontSize: 12,
                  color: "#6c757d",
                  textAlign: "left",
                  width: "100%"
              }),
              Space(25),
              Container({
                height: 45,
                child: Button("Create Project", {
                  confirm: true,
                  icon: 'save',
                  backgroundColor: "#007bff",
                  color: "white",
                  radius: 6,
                  fontWeight: "500",
                  fontSize: 15,
                  onClick: async () => {
                    const dataSend = {
                      project_name: name,
                      project_desc: description,
                    };
                    try {
                      const saved = await ServiceProject.create(dataSend);
                      console.log("saved", saved);
                      _.close();
                    } catch (error) {
                      console.log(error);
                    }
                  }
                })
              })
            ]
          })
        })
      ]
    })
  }).builder();
}




let obj: Record<string, any> = {};
export default function AddProject(): React.ReactElement | null {
  let dataSend = {
    close: () => {
      if (obj.panel && typeof obj.panel.unMounting === 'function') {
        obj.panel.unMounting();
      } else {
        console.error("Modal panel or unMounting method not found.");
      }
    },
  };

  obj.panel = Modal({
    fullscreen: true,
    onClose: () => console.log("Modal Close triggered"),
    child: Widget(AddProjectComponent, {
      ...dataSend,
      key: "modal-add-project"
    })
  });

  return obj.panel;
}