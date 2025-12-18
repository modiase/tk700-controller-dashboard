/**
 * Frontend API client for projector control.
 * Provides typed functions for all REST endpoints: power, temperature, volume, picture settings, etc.
 */

import toast from 'svelte-french-toast';

const BASE_PATH = import.meta.env.BASE_URL || '/';
const API_BASE = `${BASE_PATH}${BASE_PATH.endsWith('/') ? '' : '/'}api`;

async function handleResponse(res: Response): Promise<any> {
  const json = await res.json();

  if (res.status === 429) {
    toast.error('Please wait, request in progress');
    throw new Error(json.error || 'Request already in progress');
  }

  if (json.error) {
    throw new Error(json.error);
  }

  return json;
}

export interface PowerStateData {
  powerOn: boolean | null;
  state: 'OFF' | 'WARMING_UP' | 'ON' | 'COOLING_DOWN' | 'UNKNOWN';
  transitionStartTime: number | null;
}

export async function getPowerState(): Promise<PowerStateData> {
  const res = await fetch(`${API_BASE}/power-state`);
  const { error, data } = await res.json();
  if (error) throw new Error(error);
  return data;
}

export async function getPowerStatus(): Promise<boolean | null> {
  const res = await fetch(`${API_BASE}/power`);
  const { error, data } = await res.json();
  if (error) throw new Error(error);
  return data;
}

export async function setPower(on: boolean): Promise<void> {
  const res = await fetch(`${API_BASE}/power`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ on }),
  });
  await handleResponse(res);
}

export async function getTemperature(): Promise<number | null> {
  const res = await fetch(`${API_BASE}/temperature`);
  const { error, data } = await res.json();
  if (error) throw new Error(error);
  return data;
}

export async function getFanSpeed(): Promise<number | null> {
  const res = await fetch(`${API_BASE}/fan`);
  const { error, data } = await res.json();
  if (error) throw new Error(error);
  return data;
}

export async function getVolume(): Promise<number | null> {
  const res = await fetch(`${API_BASE}/volume`);
  const { error, data } = await res.json();
  if (error) throw new Error(error);
  return data;
}

export async function setVolume(level: number): Promise<void> {
  const res = await fetch(`${API_BASE}/volume`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ level }),
  });
  await handleResponse(res);
}

export async function getPictureMode(): Promise<string | null> {
  const res = await fetch(`${API_BASE}/picture-mode`);
  const { error, data } = await res.json();
  if (error) throw new Error(error);
  return data;
}

export async function setPictureMode(mode: string): Promise<void> {
  const res = await fetch(`${API_BASE}/picture-mode`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode }),
  });
  await handleResponse(res);
}

export async function getBrightness(): Promise<number | null> {
  const res = await fetch(`${API_BASE}/brightness`);
  const { error, data } = await res.json();
  if (error) throw new Error(error);
  return data;
}

export async function adjustBrightness(direction: 'up' | 'down'): Promise<void> {
  const res = await fetch(`${API_BASE}/brightness`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ direction }),
  });
  await handleResponse(res);
}

export async function setBrightness(value: number): Promise<void> {
  const res = await fetch(`${API_BASE}/brightness`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value }),
  });
  await handleResponse(res);
}

export async function getContrast(): Promise<number | null> {
  const res = await fetch(`${API_BASE}/contrast`);
  const { error, data } = await res.json();
  if (error) throw new Error(error);
  return data;
}

export async function setContrast(value: number): Promise<void> {
  const res = await fetch(`${API_BASE}/contrast`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value }),
  });
  await handleResponse(res);
}

export async function getSharpness(): Promise<number | null> {
  const res = await fetch(`${API_BASE}/sharpness`);
  const { error, data } = await res.json();
  if (error) throw new Error(error);
  return data;
}

export async function setSharpness(value: number): Promise<void> {
  const res = await fetch(`${API_BASE}/sharpness`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value }),
  });
  await handleResponse(res);
}

export async function getHdmiSource(): Promise<string | null> {
  const res = await fetch(`${API_BASE}/hdmi-source`);
  const { error, data } = await res.json();
  if (error) throw new Error(error);
  return data;
}

export async function setHdmiSource(source: string): Promise<void> {
  const res = await fetch(`${API_BASE}/hdmi-source`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source }),
  });
  await handleResponse(res);
}

export async function getBlankStatus(): Promise<boolean | null> {
  const res = await fetch(`${API_BASE}/blank`);
  const { error, data } = await res.json();
  if (error) throw new Error(error);
  return data;
}

export async function setBlank(on: boolean): Promise<void> {
  const res = await fetch(`${API_BASE}/blank`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ on }),
  });
  await handleResponse(res);
}

export async function getFreezeStatus(): Promise<boolean | null> {
  const res = await fetch(`${API_BASE}/freeze`);
  const { error, data } = await res.json();
  if (error) throw new Error(error);
  return data;
}

export async function setFreeze(on: boolean): Promise<void> {
  const res = await fetch(`${API_BASE}/freeze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ on }),
  });
  await handleResponse(res);
}

export async function adjustVerticalKeystone(direction: '+' | '-'): Promise<void> {
  const res = await fetch(`${API_BASE}/keystone/vertical`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ direction }),
  });
  await handleResponse(res);
}

export async function adjustHorizontalKeystone(direction: '+' | '-'): Promise<void> {
  const res = await fetch(`${API_BASE}/keystone/horizontal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ direction }),
  });
  await handleResponse(res);
}

export async function openMenu(): Promise<void> {
  const res = await fetch(`${API_BASE}/menu/open`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  await handleResponse(res);
}

export async function closeMenu(): Promise<void> {
  const res = await fetch(`${API_BASE}/menu/close`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  await handleResponse(res);
}

export async function menuNavigate(direction: 'up' | 'down' | 'left' | 'right'): Promise<void> {
  const res = await fetch(`${API_BASE}/menu/${direction}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  await handleResponse(res);
}

export async function menuEnter(): Promise<void> {
  const res = await fetch(`${API_BASE}/menu/enter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  await handleResponse(res);
}

export async function menuBack(): Promise<void> {
  const res = await fetch(`${API_BASE}/menu/back`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  await handleResponse(res);
}
