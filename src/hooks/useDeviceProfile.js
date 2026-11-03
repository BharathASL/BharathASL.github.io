import { useState } from 'react';

function readDeviceProfile() {
  const touch = window.matchMedia('(pointer: coarse)').matches;
  const smallScreen = window.matchMedia('(max-width: 767px)').matches;
  const cores = navigator.hardwareConcurrency ?? 8;
  const memoryGb = navigator.deviceMemory ?? 8;
  const saveData = navigator.connection?.saveData === true;
  return {
    touch,
    lowPower: touch || smallScreen || cores <= 4 || memoryGb <= 4 || saveData,
  };
}

export function useDeviceProfile() {
  const [profile] = useState(readDeviceProfile);
  return profile;
}
