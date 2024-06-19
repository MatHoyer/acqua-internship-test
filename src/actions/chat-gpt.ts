'use server';

import OpenAI from 'openai';
import { z } from 'zod';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const responseSchema = z.object({
  todoList: z.array(z.string()),
  doneList: z.array(z.string()),
});

export const chatGPT = async (
  todos: string[],
  doneTodos: string[],
  userInput: string,
) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'assistant',
        content: `You are an AI that must manage a todo list and a done todo list. You have to deduce what the user has done or not. If they need to add tasks to do then add it. You can deduce multiple tasks in one prompt.
        Try to SUMMARIZE your response as much as possible. You will NEVER add something that is not in todoList at the doneList. If you find nothing to update just send back todoList and doneList untouched.
        You will always answer with a valid JSON. You will begin with the opening curly brace and end with the closing curly brace.`,
      },
      {
        role: 'user',
        content: `DATA: {
          userInput: "J'ai fais du sport"
          todoList: [sport, travail, manger]
          doneList: []
        }
        Becomes:
        {
          todoList: [travail, manger]
          doneList: [sport]
        }`,
      },
      {
        role: 'user',
        content: JSON.stringify({
          userInput,
          todoList: todos,
          doneList: doneTodos,
        }),
      },
    ],
    response_format: {
      type: 'json_object',
    },
  });

  try {
    const validatedResult = responseSchema.parse(
      JSON.parse(response.choices[0].message.content || ''),
    );
    return validatedResult;
  } catch (e) {
    throw new Error('something went wrong with chatGPT');
  }
};
