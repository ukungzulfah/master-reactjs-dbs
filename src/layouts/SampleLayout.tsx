import { Column, Container, Divider, ListItemText, Menu, MenuItem, Root, Rows, SizedBox, Text } from "../System/Lib/Widgets";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CreateIcon from '@mui/icons-material/Create';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import BugReportIcon from '@mui/icons-material/BugReport';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const MainLayout = () => {
	return Root({
		fullscreen: true,
		child: Column({
			center: true,
			children: [
				Container({
					width: 200,
					height: 100,
					color: "red",
					onContextMenu: (e: any) => {
						const menu = Menu(e, {
							anchorPosition: { left: e.clientX + 2, top: e.clientY - 6 },
							children: [
								{ label: "Run Flow", icon: <PlayArrowIcon style={{ color: "green" }} /> },
								{ label: "Debug Flow", icon: <BugReportIcon style={{ color: "blue" }} /> },
								{ label: "Edit Flow", icon: <CreateIcon /> },
								"divider",
								{ label: "Delete Edge", icon: <TrendingUpIcon style={{ color: "red" }} /> },
								{ label: "Delete Node", icon: <RemoveCircleOutlineIcon style={{ color: "red" }} /> },
							].map((item: any) => {
								if (item === "divider") {
									return Divider({ width: 200 });
								}
								return MenuItem({
									onClick: () => menu.unMounting(),
									child: ListItemText({
										child: Rows({
											children: [
												item.icon
													? Container({ width: 30, childReact: item.icon })
													: SizedBox({ width: 30 }),
												Text(item.label)
											]
										})
									})
								});
							})
						});
					}
				})
			]
		})
	}).builder();
};

export default MainLayout;