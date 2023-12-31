import { Fragment, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSyncFileDataContext } from "../../contexts/SyncFileDataContext"
import { EventsOn } from "../../../wailsjs/runtime/runtime"

import { StartSyncFiles, StartTogeterSyncFiles } from "../../../wailsjs/go/tcpserver/TCPServer"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faX, faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons"

import "../../styles/common/sidebar_style.css"

const Sidebar = () => {
  const navigatate = useNavigate()
  const { synchronizedFiles } = useSyncFileDataContext()

  const [isOpen, setIsOpen] = useState<boolean>(false)

  EventsOn("start_together_sync_files", (() => {
    StartTogeterSyncFiles(synchronizedFiles!, synchronizedFiles!.length)
  }))


  const ToggleSidebar = (): void => {
    setIsOpen((prev) => {
      return !prev
    })
    return 
  }
  
  const SyncFilesHandler = async (): Promise<void> => {
    await StartSyncFiles(synchronizedFiles!, synchronizedFiles!.length)
    return
  }

  return (
    <Fragment>
      <nav className="sidebar_nav">
        <div className="sidebar_nav_toggle_icon">
          <button className="sidebar_nav_toggle_btn" type="button" onClick={ToggleSidebar}>
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </nav>
      <div className={`sidebar ${isOpen == true ? 'active' : ''}`}>
        <div className="sidebar_header">
          <h4>폴더 동기화</h4>
          <button className="sidebar_toggle_btn" type="button" onClick={ToggleSidebar}>
            <FontAwesomeIcon icon={faX}/>
          </button>
        </div>
        <div className="sidebar_content">
          <ul>
            <li onClick={() => {}}><p>로그 확인</p></li>
          </ul>
        </div>
      </div>
      <div className={`sidebar_overlay ${isOpen == true ? 'active' : ''}`} onClick={ToggleSidebar}></div>
    </Fragment>
  )
}

export default Sidebar