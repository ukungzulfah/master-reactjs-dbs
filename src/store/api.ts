import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: "https://jsonplaceholder.typicode.com/" }),
    tagTypes: ["Todos"],
    endpoints: (builder) => ({
        getTodos: builder.query<any, void>({ // Gunakan `void` agar Redux tahu tidak butuh parameter
            query: () => "todos",
            providesTags: ["Todos"],
        }),
        getTodoById: builder.query({
            query: (id) => `todos/${id}`,
        }),
        addTodo: builder.mutation({
            query: (newTodo) => ({
                url: "todos",
                method: "POST",
                body: newTodo,
            }),
        }),
        deleteTodo: builder.mutation({
          query: (id: number) => ({
            url: `todos/${id}`, // Pastikan `id` dikirim ke URL
            method: "DELETE",
          }),
          invalidatesTags: ["Todos"],
        }),
    }),
});

export const { useGetTodosQuery, useGetTodoByIdQuery, useAddTodoMutation, useDeleteTodoMutation } = api;