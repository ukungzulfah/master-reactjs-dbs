import * as React from 'react';
import { DataGrid, GridRowsProp, GridColDef, useGridApiRef } from '@mui/x-data-grid';
import { Button, Column, Container, Expanded, Root, Rows } from '../System/Lib/Widgets';

const rows: GridRowsProp = [
    { id: 1, col1: 'Hello', col2: 'World' },
    { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
    { id: 3, col1: 'MUI', col2: 'is Amazing' },
    { id: 4, col1: 'React', col2: 'is Great' },
    { id: 5, col1: 'JavaScript', col2: 'is Powerful' },
    { id: 6, col1: 'TypeScript', col2: 'is Awesome' },
    { id: 7, col1: 'Node.js', col2: 'is Versatile' },
    { id: 8, col1: 'Angular', col2: 'is Robust' },
    { id: 9, col1: 'Vue.js', col2: 'is Popular' },
    { id: 10, col1: 'Svelte', col2: 'is Fast' },
    { id: 11, col1: 'Redux', col2: 'is State Management' },
    { id: 12, col1: 'Context API', col2: 'is Alternative' },
    { id: 13, col1: 'Hooks', col2: 'are Useful' },
    { id: 14, col1: 'CSS', col2: 'is Styling' },
    { id: 15, col1: 'Sass', col2: 'is Preprocessor' },
    { id: 16, col1: 'Less', col2: 'is Preprocessor' },
    { id: 17, col1: 'Tailwind CSS', col2: 'is Utility-first' },
    { id: 18, col1: 'Bootstrap', col2: 'is Framework' },
    { id: 19, col1: 'Material-UI', col2: 'is Component Library' },
    { id: 20, col1: 'Ant Design', col2: 'is Another Component Library' },
    { id: 21, col1: 'GraphQL', col2: 'is Query Language' },
    { id: 22, col1: 'Apollo', col2: 'is GraphQL Client' },
    { id: 23, col1: 'Prisma', col2: 'is ORM' },
    { id: 24, col1: 'Sequelize', col2: 'is ORM' },
    { id: 25, col1: 'PostgreSQL', col2: 'is Database' },
    { id: 26, col1: 'MySQL', col2: 'is Database' },
    { id: 27, col1: 'MongoDB', col2: 'is NoSQL Database' },
    { id: 28, col1: 'Firebase', col2: 'is Backend-as-a-Service' },
    { id: 29, col1: 'AWS', col2: 'is Cloud Platform' },
    { id: 30, col1: 'Azure', col2: 'is Cloud Platform' },
    { id: 31, col1: 'Google Cloud', col2: 'is Cloud Platform' },
    { id: 32, col1: 'Docker', col2: 'is Containerization' },
    { id: 33, col1: 'Kubernetes', col2: 'is Container Orchestration' },
    { id: 34, col1: 'Git', col2: 'is Version Control' },
    { id: 35, col1: 'GitHub', col2: 'is Platform' },
    { id: 36, col1: 'Bitbucket', col2: 'is Platform' },
    { id: 37, col1: 'JIRA', col2: 'is Project Management' },
    { id: 38, col1: 'Confluence', col2: 'is Collaboration' },
    { id: 39, col1: 'Slack', col2: 'is Communication' },
    { id: 40, col1: 'Zoom', col2: 'is Video Conferencing' },
];

const columns: GridColDef[] = [
    {
        field: 'rowNumber',
        headerName: '#',
        width: 70,
        renderCell: (params) => params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
    },
    { field: 'col1', headerName: 'Column 1', width: 150 },
    { field: 'col2', headerName: 'Column 2', width: 150 },
];

export default function Dashboard() {
    return Root({
        child: Column({
            children: [
                Container({
                    height: 40,
                    padding: 5,
                    child: Rows({
                        children: [
                            Button("", {
                                icon: "refresh",
                                backgroundColor: "green",
                                click: () => {
                                    console.log("Click")
                                }
                            })
                        ]
                    })
                }),
                Expanded({
                    childReact: <DataGrid rows={rows} columns={columns} autoPageSize />
                })
            ]
        })
    }).builder();
}
