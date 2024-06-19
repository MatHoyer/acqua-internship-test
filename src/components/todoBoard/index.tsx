'use client';

import { useToDoStore } from '@/app/Store';
import SmartBar from '@/components/smartBar';
import { useDragAndDrop } from '@formkit/drag-and-drop/react';
import { useEffect } from 'react';

export default function TodoBoard() {
  const todoStore = useToDoStore();

  const [todoList, todoItems, setTodoItems] = useDragAndDrop<
    HTMLUListElement,
    string
  >(todoStore.todos, {
    group: 'todoList',
    handleEnd: (data) => {
      todoStore.setAsDone(data.targetData.node.data.value);
    },
  });
  const [doneList, doneItems, setDoneItems] = useDragAndDrop<
    HTMLUListElement,
    string
  >(todoStore.doneTodos, {
    group: 'todoList',
    handleEnd: (data) => {
      todoStore.setAsTodo(data.targetData.node.data.value);
    },
  });

  useEffect(() => {
    setTodoItems(todoStore.todos);
    setDoneItems(todoStore.doneTodos);
  }, [todoStore.todos, todoStore.doneTodos, setTodoItems, setDoneItems]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-acqua-soft-white">
      <h1 className="text-3xl font-bold text-acqua-deep-blue my-6">
        Acqua Board
      </h1>
      <SmartBar />
      <div className="flex justify-center items-start gap-8 p-5">
        <ul
          ref={todoList}
          className="bg-acqua-yellow rounded-lg p-4 shadow-md w-80 h-96"
        >
          {todoItems.map((todo) => (
            <li className="p-2 bg-white rounded-lg shadow mb-2" key={todo}>
              {todo}
            </li>
          ))}
        </ul>
        <ul
          ref={doneList}
          className="bg-acqua-darker-blue rounded-lg p-4 shadow-md w-80 text-white h-96"
        >
          {doneItems.map((done) => (
            <li
              className="p-2 rounded-lg line-through decoration-acqua-retro-yellow decoration-2 shadow mb-2"
              key={done}
            >
              {done}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
