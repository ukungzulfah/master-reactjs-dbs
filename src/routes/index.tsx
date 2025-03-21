import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import EditorLayout from "../layouts/EditorLayout";
// import { Route, Router, Routes } from "../System/Lib/RouteEngine";
import { Widget } from "../System/Lib/Widgets";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

const AppRoutes = () => {

  const routeList = [
    { path: "/", element: Widget(EditorLayout) },
    { path: "/login", element: Widget(Login) },
    { path: "*", element: Widget(NotFound) }
  ];
  
  // return Router({
  //   children: Routes({
  //     children: [
  //       ...routeList.map((route, index) => {
  //         return Route({
  //           ...route,
  //           key: `route-${index}`,
  //         });
  //       }),
  //     ]
  //   })
  // });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}></Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;