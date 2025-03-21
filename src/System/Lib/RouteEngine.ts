import React from "react";
import { JSX } from "react";
import * as route from "react-router-dom";

export function Route(props: RouterProps) {
  const { path, element, children, ...rest } = props;
  return React.createElement(route.Route, {
    path,
    element,
    children,
    ...rest
  });
}

export function Routes(props: route.RoutesProps) {
  const childrenWithKeys = React.Children.map(props.children, (child, index) =>
    React.isValidElement(child)
      ? React.cloneElement(child, { key: `route-${index + 1}` })
      : child
  );

  return React.createElement(route.Routes, { ...props }, childrenWithKeys);
}

export function Router(props: route.BrowserRouterProps) {
  return React.createElement(route.BrowserRouter, { ...props }, props.children);
}

interface RouterProps {
  key?: string;
  path?: string;
  element?: JSX.Element;
  children?: JSX.Element | JSX.Element[];
}