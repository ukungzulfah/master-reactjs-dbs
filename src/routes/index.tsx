import NotFound from "../pages/NotFound";
import EditorLayout from "../layouts/EditorLayout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import TutorialLayout from "../layouts/TutorialLayout";
import ContentTutor from "../pages/tutorial/ContentTutor";
import Welcome from "../pages/tutorial/Welcome";
import Sample from "../layouts/Sample";

const AppRoutes = () => {

  return (
    <Router>
      <Routes>
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