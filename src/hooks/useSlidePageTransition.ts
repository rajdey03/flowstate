import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type TransitionDirection = 'left' | 'right';

interface NavigateOptions {
  state?: unknown;
  leaveTo?: TransitionDirection;
  duration?: number;
}

export function useSlidePageTransition(
  enterClassBySource: Record<string, string>,
  defaultEnterClass = 'page-shell--enter',
) {
  const location = useLocation();
  const navigate = useNavigate();

  const [transitionClass, setTransitionClass] = useState(() => {
    const source = location.state?.from as string | undefined;
    return source && enterClassBySource[source]
      ? enterClassBySource[source]
      : defaultEnterClass;
  });

  const navigateWithTransition = (
    to: string,
    { state, leaveTo = 'left', duration = 360 }: NavigateOptions = {},
  ) => {
    setTransitionClass(
      leaveTo === 'right' ? 'page-shell--leave-right' : 'page-shell--leave-left',
    );

    window.setTimeout(() => {
      navigate(to, { state });
    }, duration);
  };

  return { transitionClass, navigateWithTransition };
}
