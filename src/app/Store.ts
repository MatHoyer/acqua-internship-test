import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ToDoStore = {
  todos: string[];
  doneTodos: string[];
  setTodos: (todos: string[]) => void;
  setDoneTodos: (doneTodos: string[]) => void;
  setAsDone: (doneTodo: string) => void;
  setAsTodo: (undoneTodo: string) => void;
  addTodo: (newTodo: string) => void;
};

export const useToDoStore = create(
  persist<ToDoStore>(
    (set) => ({
      todos: [],
      doneTodos: [],
      setTodos: (todos) => set({ todos }),
      setDoneTodos: (doneTodos) => set({ doneTodos }),
      setAsDone: (doneTodo) =>
        set((state) => {
          const indexInTodos = state.todos.findIndex(
            (todo) => todo === doneTodo,
          );
          if (indexInTodos === -1) return state;
          const newState = {
            todos: state.todos.filter((_, index) => index !== indexInTodos),
            doneTodos: [...state.doneTodos, state.todos[indexInTodos]],
          };
          localStorage.setItem('todos', JSON.stringify(newState));
          return newState;
        }),
      setAsTodo: (undoneTodo) =>
        set((state) => {
          const indexInDoneTodos = state.doneTodos.findIndex(
            (doneTodo) => undoneTodo === doneTodo,
          );
          if (indexInDoneTodos === -1) return state;
          const newState = {
            todos: [...state.todos, state.doneTodos[indexInDoneTodos]],
            doneTodos: state.doneTodos.filter(
              (_, index) => index !== indexInDoneTodos,
            ),
          };
          localStorage.setItem('todos', JSON.stringify(newState));
          return newState;
        }),
      addTodo: (newTodo) =>
        set((state) => {
          const newState = { todos: [...state.todos, newTodo] };
          localStorage.setItem(
            'todos',
            JSON.stringify({ todos: newState, doneTodos: state.doneTodos }),
          );
          return newState;
        }),
    }),
    {
      name: 'todos',
    },
  ),
);
