import { useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
  sendMessageFailure,
  sendMessageStart,
  sendMessageSuccess,
  streamFailure,
  streamRunning,
  streamStart,
  streamStop,
  streamSuccess,
} from '../../redux/chat/chatSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { Message } from '../../types';
import Spinner from '../Spinner';

const Prompt = () => {
  const { showSidebar, loading } = useSelector(
    (state: RootState) => state.chat
  );
  const dispatch = useDispatch<AppDispatch>();

  const [prompt, setPrompt] = useState('');

  const controller = new AbortController();
  const signal = controller.signal;

  // For changing the submit button's color bg when input is not empty
  const isPromptEmpty = prompt.trim() === '';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() !== '') {
      try {
        await submitPrompt(prompt);
      } catch (error) {
        dispatch(sendMessageFailure(error));
      }
    }
  };

  const handleStopStream = () => {
    controller.abort();
  };

  const submitPrompt = async (prompt: string) => {
    const userPrompt: Message = { content: prompt, isBot: false };
    let accumulatedChunks = '';

    dispatch(sendMessageStart());
    setPrompt('');
    dispatch(sendMessageSuccess(userPrompt));

    // Prepare the request options
    const requestOptions = {
      method: 'POST',
      body: JSON.stringify({ content: prompt }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      signal,
    };

    try {
      dispatch(streamStart());
      const response = await fetch(
        import.meta.env.VITE_API_URL,
        requestOptions
      );

      if (!response.ok || response.body === null) {
        throw new Error(`Client Error: ${response.statusText}`);
      }

      const reader = response.body.getReader();

      // eslint-disable-next-line no-constant-condition
      while (true) {
        // Read the next chunk of data from the stream
        const chunk = await reader.read();
        const { done, value } = chunk;

        // If done is true, the stream has ended
        if (done) {
          dispatch(
            streamSuccess({
              content: accumulatedChunks,
              isBot: true,
            })
          );
          break;
        }

        const decodedChunk = new TextDecoder()
          .decode(value)
          .replace(/["'`}]/g, '');

        accumulatedChunks += decodedChunk;
        dispatch(streamRunning(decodedChunk));
      }
    } catch (error) {
      const isTypeError = error instanceof TypeError;

      if (signal.aborted) {
        dispatch(streamStop());
      }

      if (isTypeError) {
        const message = error.message;
        if (message === 'network error') {
          // Ignore network error and continue as the response is not empty (Server's Issue)
          dispatch(
            streamSuccess({
              content: accumulatedChunks,
              isBot: true,
            })
          );
        }
        if (message === 'Failed to fetch') {
          dispatch(
            streamFailure(
              'Failed to response! Please check the Internet connection.'
            )
          );
        }
      } else {
        dispatch(
          streamFailure(
            'Something Went Wrong! Please try reloading the conversation.'
          )
        );
      }
    }
  };

  return (
    <div
      className={`${
        showSidebar ? 'md:px-24' : 'md:px-64'
      } px-8 pt-1 w-full 2xl:w-[60%]`}
    >
      <form
        onSubmit={handleSendMessage}
        className={`flex bg-default border border-gray-600 rounded-2xl pl-4 pr-2 py-2`}
      >
        <input
          type='text'
          placeholder='Message...'
          disabled={loading}
          className='w-full border-none focus:outline-none bg-transparent placeholder:font-semibold'
          onChange={handleInputChange}
          value={prompt}
        />
        <button
          className={`w-8 h-8 flex items-center justify-center rounded-lg p-2 ${
            isPromptEmpty && !loading ? 'bg-gray-500' : 'bg-gray-200'
          }`}
          title='Enter Prompt'
          disabled={!loading && isPromptEmpty}
          onClick={loading ? handleStopStream : undefined}
        >
          <div className='text-default '>
            {loading ? <Spinner /> : <FaArrowUp />}
          </div>
        </button>
      </form>
    </div>
  );
};

export default Prompt;
