
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Main from "../Page/MainMenu";
import Broadcaster from "../Page/Broadcaster";
import Watcher from "../Page/Watcher";

const Routers = () => {
    return (
        <Router>
            <Routes>
            <Route exact path="/" element={<Main />}></Route>
            <Route  path="/watcher" element={<Watcher />}></Route>
            <Route  path="/broadcaster" element={<Broadcaster />}></Route>
     
            </Routes>
        </Router>
    )
}

export default Routers;