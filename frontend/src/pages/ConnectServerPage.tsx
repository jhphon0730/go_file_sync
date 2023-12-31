import { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"


import { CustomErrorDialog } from "../../wailsjs/go/main/App"
import { InitialConnectServerPage } from "../../wailsjs/go/initial/Initial"
import { SendAutoConnectServer, StartClient } from "../../wailsjs/go/tcpclient/TCPClient"
import { GetPort } from "../../wailsjs/go/tcpserver/TCPServer"
import { EventsOn } from "../../wailsjs/runtime/runtime"

import Alert from "../components/common/Alert"
import Loading from "../components/common/Loading"

import "../styles/pages/connect_server_page_style.css"

const ConnectServerPage = () => {
  const navigate = useNavigate()
  const [IPState, setIPState] = useState<string>("localhost")
  const [portState, setPortState] = useState<number>()
  // 상대 PC가 실행 중인 PC에 연결을 했는지...
  const [connectListeningIsLoading, setConnectListeningIsLoading] = useState<boolean>(false)
  const [acceptSuccessState, setAcceptSuccessState] = useState<boolean>(false)

  // 상대 PC 연결 이후에 로딩 상태라면...
  // 상대 PC 연결을 안 하고 연결을 받았다면...
  EventsOn("server_accept_success", () => {
    setAcceptSuccessState(true)
    if (connectListeningIsLoading) {
      navigate("/dir")
    }
  })

  // 상대 PC와의 연결이 끊겼다면 State 초기화
  // 혹은 연결 대기 중에 상대 PC 서버가 종료 상태라면
  EventsOn("server_shutdown", () => {
    setAcceptSuccessState(false)
    setConnectListeningIsLoading(false)
  })
  
  EventsOn("server_auto_connect", async (IPState, port) => {
    if (!IPState) {
      return
    }

    const serverConnectState = await StartClient(IPState, port)

    if (!serverConnectState || acceptSuccessState) {
      return
    }

    setAcceptSuccessState(true)

    navigate("/dir")
  })
  
  useEffect(() => {
    setAcceptSuccessState(false)
    setConnectListeningIsLoading(false)
  }, [])

  useEffect(() => {
    (async () => {
      InitialConnectServerPage(String(await GetPort()))
    })()
  }, [])

  const ChangeIPStateHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const enteredPort: string = e.target.value;
    
    setIPState(() => enteredPort)
    return  
  }

  const ChangePortStateHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const enteredPort: number = +e.target.value;
  
    if (!Number.isNaN(enteredPort)) setPortState(() => enteredPort);
  }

  // 현재 실행 중인 서버의 Port는 접속 불가능 하게
  const StartClientHandler = async () => {
    const serverPort = await GetPort()
    
    if (serverPort == portState) {
      CustomErrorDialog("현재 PC에서 실행 중인 서버에 접속할 수 없습니다.")
      return
    }

    if (!portState || !IPState) {
      return
    }

    const serverConnectState = await StartClient(IPState, portState)

    if (!serverConnectState) {
      return
    }

    await SendAutoConnectServer(serverPort)

    setConnectListeningIsLoading(true)

    // 상대 PC로부터 연결을 받은 상태이며 서버를 연결 한다면...
    if (acceptSuccessState) {
      navigate("/dir")
    }
  }

  return (
    <Fragment>
      { !connectListeningIsLoading ? 
      <div className="connect_server_page">
          <Alert text="연결할 PC의 IP, PORT를 입력하세요." />
        <div className="connect_server_page_port_inp_areas">
          <input type="text" value={IPState} placeholder="IP를 입력하세요." onChange={ChangeIPStateHandler}/>
          <input type="text" inputMode="numeric" value={portState} placeholder="PORT를 입력하세요." onChange={ChangePortStateHandler}/>
          <div className="connect_server_page_port_inp_area">
            <button type="button" onClick={StartClientHandler}>서버 연결</button>
          </div>
        </div>
      </div>
      :
      <Fragment>
        <Loading />
      </Fragment>
      }
    </Fragment>
  )
}

export default ConnectServerPage