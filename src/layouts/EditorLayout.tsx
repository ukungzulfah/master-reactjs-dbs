import { CircularProgress, Column, Container, Expanded, Root, Row, Stack, Widget, Text } from '../System/Lib/Widgets';
import EditorRight from './editor/EditorRight';
import HeaderTop from './editor/EditorTop';
import EditorConsole from './editor/EditorConsole';
import HidePanel from './editor/HidePanel';
import { useEffect, useState } from 'react';
import FlowEditor from '../pages/FlowEditor';
import { useNavigate } from 'react-router-dom';
import ApiFetcher from '../System/Lib/ApiFetcher';
import { API_URL } from '../assets/config/config';
import storeEnvirontment from '../context/storeEnvirontment';
import ServiceSetting from '../services/ServiceSetting';
import storeProject from '../context/storeProject';
import SelectProject from '../pages/project/SelectProject';

function EditorLayout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hideSideRight, setHideSideRight] = useState(false);
  const [message, __] = useState("Loading...");
  const storeEnv = storeEnvirontment();
  const proj = storeProject();

  useEffect(() => {
    if (Object.keys(storeEnv.state.config).length == 0) {
      ServiceSetting.getByType("global_environtment").then((response: any) => {
        const setting_data = response[0].setting_data || "{}";
        storeEnv.setConfig(JSON.parse(setting_data));
      }).catch((error: any) => {
        console.log(error.message);
      });
    }

    if(!proj.state.selectProject) {
      SelectProject();
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetcher = new ApiFetcher(API_URL, token);
    fetcher.get("/validate-token").then((response: any) => {
      if (response.code === 200) {
        if (!response.data.valid) {
          navigate("/login");
          return;
        }
        setLoading(false);
      } else {
        sessionStorage.removeItem("auth_token");
        navigate("/login");
      }
    }).catch((_: any) => {
      sessionStorage.removeItem("auth_token");
      navigate("/login");
    });
  }, [navigate]);

  if (loading) {
    return Root({
      backgroundColor: "#ccc",
      child: Column({
        center: true,
        children: [
          Container({
            width: 50,
            height: 50,
            child: CircularProgress()
          }),
          Text(message, {
            marginTop: 10,
            fontSize: 16,
            color: "#000"
          })
        ]
      })
    }).builder();
  }

  const MainRoot = () => Root({
    backgroundColor: "black",
    userSelect: "none",
    color: "white",
    child: Stack({
      children: [
        Container({
          child: Column({
            children: [
              Widget(HeaderTop),
              Expanded({
                child: Row({
                  children: [
                    Expanded({
                      child: Stack({
                        children: [
                          Widget(FlowEditor),
                          Widget(EditorConsole),
                        ]
                      })
                    }),
                    Container({
                      width: hideSideRight ? 75 : 300, color: "#ccc",
                      child: Widget(EditorRight, { hideSideRight })
                    }),
                  ]
                })
              }),
            ]
          })
        }),
        HidePanel(hideSideRight, setHideSideRight),
      ]
    })
  }).builder();

  return Widget(MainRoot);
}

export default EditorLayout;