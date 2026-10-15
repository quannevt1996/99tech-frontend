import { useCallback, useEffect, useState } from 'react';
import { fetchTokens, type Token } from '../api/prices';

export type TokensStatus = 'loading' | 'error' | 'ready';

interface TokensState {
  status: TokensStatus;
  tokens: Token[];
}

const LOADING: TokensState = { status: 'loading', tokens: [] };

const useTokens = () => {
  const [state, setState] = useState<TokensState>(LOADING);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetchTokens(controller.signal).then(
      tokens => {
        if (!controller.signal.aborted) {
          setState({ status: 'ready', tokens });
        }
      },
      () => {
        if (!controller.signal.aborted) {
          setState({ status: 'error', tokens: [] });
        }
      },
    );
    return () => controller.abort();
  }, [attempt]);

  const retry = useCallback(() => {
    setState(LOADING);
    setAttempt(prev => prev + 1);
  }, []);

  return { ...state, retry };
};

export default useTokens;
