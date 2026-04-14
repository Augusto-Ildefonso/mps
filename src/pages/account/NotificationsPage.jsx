import { AccountNotificationsPanel } from "../../component/AccountPanels"
import Header from "../../component/Header/Header"
import BannerNav from "../../component/NavBar/BannerNav"
import NavBar from "../../component/NavBar/NavBar"

const NotificationsPage = () => {
    return (
        <div >
            <Header />
            <BannerNav />
            <div className="px-2 md:px-4 pb-20 max-w-7xl mx-auto mt-4 rounded-xl">
                <AccountNotificationsPanel />
            </div>
            <NavBar />
        </div>
    )
}

export default NotificationsPage