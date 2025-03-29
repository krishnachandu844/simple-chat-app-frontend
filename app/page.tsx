"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState<string>();
  const createRoom = () => {
    const slug = Date.now();
    router.push(`/room/${slug}`);
  };
  const joinRoom = () => {
    router.push(`/room/${roomId}`);
  };

  return (
    <div className='bg-black flex justify-center items-center min-h-screen '>
      <Card className='w-[350px]'>
        <CardHeader>
          <CardTitle className='text-2xl'>Enter RoomId</CardTitle>
          <CardDescription>Enter your room Id to chat</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid w-full items-center gap-4'>
            <div className='flex flex-col space-y-1.5'>
              <Input
                id='name'
                placeholder='roomId'
                onChange={(e) => {
                  setRoomId(e.target.value);
                }}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className='flex flex-col space-y-4'>
          <Button className='w-full' onClick={joinRoom}>
            Join Room
          </Button>
          <div className='flex flex-col w-full relative'>
            <Separator />
            <span className='absolute  left-36 -top-3 '>Or</span>
          </div>
          <Button className='w-full' onClick={createRoom}>
            Create Room
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
