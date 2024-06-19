import { chatGPT } from '@/actions/chat-gpt';
import { useToDoStore } from '@/app/Store';
import { useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { MdOutlineWaterDrop } from 'react-icons/md';

export default function SmartBar() {
  const [error, setError] = useState(false);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const todoStore = useToDoStore();

  const handleSend = async () => {
    if (value === '') return;
    setLoading(true);
    try {
      const { todoList, doneList } = await chatGPT(
        todoStore.todos,
        todoStore.doneTodos,
        value,
      );
      todoStore.setDoneTodos(doneList);
      todoStore.setTodos(todoList);
    } catch (e) {
      setError(true);
    }
    setLoading(false);
    setValue('');
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-acqua-soft-white">
      <input
        type="text"
        value={value}
        onChange={(event) => {
          setError(false);
          setValue(event.target.value);
        }}
        placeholder="Type something..."
        className={`flex-1 p-2 text-base border rounded-lg border-gray-300 ${
          error ? 'border-red-500' : ''
        }`}
      />
      <button
        onClick={handleSend}
        className="bg-acqua-deep-blue hover:bg-acqua-darker-blue text-white p-2 rounded-lg cursor-pointer transition duration-300 ease-in-out"
        title="Send"
        disabled={loading}
      >
        {loading ? (
          <AiOutlineLoading3Quarters className="animate-spin" />
        ) : (
          <MdOutlineWaterDrop className="text-xl" />
        )}
      </button>
    </div>
  );
}
