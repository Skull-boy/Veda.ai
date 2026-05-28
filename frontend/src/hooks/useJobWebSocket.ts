'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAssignmentStore } from '@/store/assignmentStore';
import type { WSEvent } from '@/types';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:4000';

export function useJobWebSocket(assignmentId: string | null) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMounted = useRef(true);

  const {
    setJobStatus,
    setJobProgress,
    setGeneratedPaper,
    setErrorMessage,
  } = useAssignmentStore();

  const connect = useCallback(() => {
    if (!assignmentId || !isMounted.current) return;

    const ws = new WebSocket(`${WS_URL}/ws?assignmentId=${assignmentId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('[ws] Connected for assignment', assignmentId);
    };

    ws.onmessage = (event) => {
      try {
        const msg: WSEvent = JSON.parse(event.data as string);

        switch (msg.type) {
          case 'job:started':
            setJobStatus('processing');
            setJobProgress(msg.payload.progress ?? 10);
            break;

          case 'job:progress':
            setJobProgress(msg.payload.progress ?? 50);
            break;

          case 'job:completed':
            setJobStatus('completed');
            setJobProgress(100);
            if (msg.payload.paper) {
              setGeneratedPaper(msg.payload.paper);
            }
            ws.close();
            break;

          case 'job:failed':
            setJobStatus('failed');
            setErrorMessage(msg.payload.error ?? 'Generation failed');
            ws.close();
            break;
        }
      } catch {
        console.error('[ws] Failed to parse message');
      }
    };

    ws.onerror = () => {
      console.error('[ws] Connection error');
    };

    ws.onclose = (event) => {
      if (!event.wasClean && isMounted.current) {
        // Reconnect after 2s for non-clean closes
        reconnectTimer.current = setTimeout(connect, 2000);
      }
    };
  }, [assignmentId, setJobStatus, setJobProgress, setGeneratedPaper, setErrorMessage]);

  useEffect(() => {
    isMounted.current = true;
    connect();

    return () => {
      isMounted.current = false;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [connect]);
}
