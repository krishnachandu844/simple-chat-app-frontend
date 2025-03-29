"use client";

import { Input } from "@/components/ui/input";

import { Copy, Send } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface MessageType {
  type: "client" | "server";
  message: string;
}

export default function Chat() {
  const { slug } = useParams();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [message, setMessage] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket("wss://simple-chat-app-backend-b66m.onrender.com");
    console.log(ws);
    ws.onopen = () => {
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "join",
          roomId: slug,
        })
      );
    };
    ws.onmessage = (event) => {
      setMessages([...messages, { type: "server", message: event.data }]);
    };
    return () => {
      ws.close();
    };
  }, [messages, slug]);

  const copyRoomId = async () => {
    if (slug) {
      await navigator.clipboard.writeText(slug as unknown as string);
      toast.success("Copied to clipboard");
    }
  };

  return (
    <div className='min-h-screen bg-black flex items-center justify-center p-4'>
      <div className='w-full max-w-2xl bg-zinc-900 rounded-xl shadow-2xl overflow-hidden'>
        <h1 className='font-medium p-3 text-white flex gap-1.5 text-xl items-center'>
          RoomId : {slug}{" "}
          <Copy className='cursor-pointer' onClick={copyRoomId} />
        </h1>
        <span className='text-gray-400 p-3 font-medium'>
          Note: These chats are temporary.
        </span>
        <div className='border-t border-zinc-800 p-4 bg-zinc-900'></div>
        <div className='h-[500px] overflow-y-auto p-6 flex flex-col space-y-2'>
          {messages.map((mes, id) => (
            <div
              key={id}
              className={`p-3 max-w-xs rounded-lg ${
                mes.type === "client"
                  ? "bg-white text-black self-end "
                  : "bg-zinc-800 text-zinc-200 self-start"
              }`}
            >
              {mes.message}
            </div>
          ))}
          {messages.length === 0 && (
            <div className='text-zinc-500 text-center mt-[200px]'>
              Start a conversation...
            </div>
          )}
        </div>
        <div className='border-t border-zinc-800 p-4 bg-zinc-900'>
          <div className='flex items-center gap-2'>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Type your message...'
              className='flex-1 bg-zinc-800 text-white placeholder-zinc-500 p-3 rounded-lg resize-none outline-none focus:ring-2 focus:ring-white/20 transition-all'
            />
            <button
              disabled={!message.trim()}
              onClick={() => {
                socket?.send(
                  JSON.stringify({
                    type: "chat",
                    message,
                  })
                );
                setMessages([...messages, { type: "client", message }]);
                setMessage("");
              }}
              className='p-3 rounded-lg bg-white text-black hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
