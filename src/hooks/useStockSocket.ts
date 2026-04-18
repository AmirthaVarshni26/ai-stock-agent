"use client";
import { useEffect, useState } from 'react';

export const useStockSocket = (symbol: string) => {
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    const socket = new WebSocket(`wss://ws.finnhub.io?token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`);

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'subscribe', symbol: symbol }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'trade') {
        setPrice(data.data[0].p);
      }
    };

    return () => socket.close();
  }, [symbol]);

  return price;
};