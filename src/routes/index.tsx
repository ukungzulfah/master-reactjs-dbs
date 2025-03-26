import NotFound from "../pages/NotFound";
import EditorLayout from "../layouts/EditorLayout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import TutorialLayout from "../layouts/TutorialLayout";
import ContentTutor from "../pages/tutorial/ContentTutor";
import Welcome from "../pages/tutorial/Welcome";
import Sample from "../layouts/Sample";
import Trin from "../layouts/Trin";
import SimpleState from "../layouts/SimpleState";
import TableSample from "../layouts/TableSample";
import RouteSample from "../layouts/RouteSample";

const AppRoutes = () => {

  return (
    <Router>
      <Routes>
        <Route path="/route" element={<RouteSample />}></Route>
        <Route path="/table" element={<TableSample />}></Route>
        <Route path="/state" element={<SimpleState />}></Route>
        <Route path="/trin" element={<Trin />}></Route>
        <Route path="/sample" element={<Sample />}></Route>

        <Route path="/" element={<TutorialLayout />}>
          <Route index element={<Welcome />} />
          <Route path="*" element={<ContentTutor />} />
        </Route>
        <Route path="/editor" element={<EditorLayout />}></Route>
        <Route path="/main" element={<MainLayout />}></Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;