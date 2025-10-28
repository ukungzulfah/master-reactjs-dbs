import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ApiFetcher, { ApiResponse } from '../../System/Lib/ApiFetcher';
import { API_URL } from '../../assets/config/config';
import { Alert } from '../../System/Lib/Widgets';

export interface ButtonConfig {
  label: string;
  icon: any;
  backgroundColor: string;
  click: Function;
}

export const buttons: ButtonConfig[] = [
  {
    label: "Run Flow",
    icon: PlayCircleOutlineIcon,
    backgroundColor: "green",
    click: ({ nodes, edges, log, run, env, sockConnect, callback }: any) => {
      if(!sockConnect) {
        Alert({
          message: "Hubungkan socket untuk melihat aktifitas flow"
        })
        return;
      }

      callback({ state: "start", data: {} });
      log.startProcess();
      run.setRunning(true);
      const result = { 
        nodes, 
        edges,
      };
      // socketConnection.send(JSON.stringify({
      //   command: "run",
      //   data: {
      //     node: result,
      //     environtment: env.getConfig()
      //   }
      // }));
      const fetcher = new ApiFetcher(API_URL, localStorage.getItem("auth_token") || '');
      fetcher.post("/run", {
        node: result,
        environtment: env.getConfig()
      })
      .then((response: ApiResponse) => {
        log.setResult(response.data);
        log.stopProcess();
        run.setRunning(false);
        console.log("response", response.data);
        if (response.success) {
        } else {
          console.log("run", run);
          console.error("API Error:", response.message, "Code:", response.code);
        }
      }).catch(e => {
        console.log("Error =>>>", e);
      });
    }
  },
];