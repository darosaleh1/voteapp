import { useState, useEffect, useCallback } from 'react';

const usePollStatus = (activePoll) => {
  const [pollEnded, setPollEnded] = useState(false);

  const checkPollStatus = useCallback(() => {
    if (activePoll) {
      const pollEndTime = new Date(activePoll.endTime * 1000).getTime();
      const currentTime = new Date().getTime();

      if (currentTime >= pollEndTime) {
        return true;
      }
    }
    return false;
  }, [activePoll]);

  useEffect(() => {
    if (activePoll) {
      setPollEnded(checkPollStatus());
    }
  }, [activePoll, checkPollStatus]);

  return { pollEnded };
};

export default usePollStatus;
