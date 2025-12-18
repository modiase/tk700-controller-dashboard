import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import type { TK700Client } from '../tk700-client';
import type { StateRegistry } from '../state-registry';

export interface PictureSettingsValue {
  brightness: number | null;
  contrast: number | null;
  sharpness: number | null;
}

export class PictureSettingsController {
  constructor(
    private client: TK700Client,
    private registry: StateRegistry
  ) {
    this.registry.setState('pictureSettings', {
      brightness: null,
      contrast: null,
      sharpness: null,
    });
  }

  async fetchState(): Promise<void> {
    const [brightnessResult, contrastResult, sharpnessResult] = await Promise.all([
      this.client.getBrightness()(),
      this.client.getContrast()(),
      this.client.getSharpness()(),
    ]);

    const brightness = pipe(
      brightnessResult,
      E.map(O.toNullable),
      E.getOrElse((): number | null => null)
    );

    const contrast = pipe(
      contrastResult,
      E.map(O.toNullable),
      E.getOrElse((): number | null => null)
    );

    const sharpness = pipe(
      sharpnessResult,
      E.map(O.toNullable),
      E.getOrElse((): number | null => null)
    );

    this.registry.setState('pictureSettings', { brightness, contrast, sharpness });
  }

  async adjustBrightness(direction: 'up' | 'down'): Promise<void> {
    const current = this.registry.getState<PictureSettingsValue>('pictureSettings').value;
    if (current.brightness !== null) {
      const expectedBrightness = direction === 'up' ? current.brightness + 1 : current.brightness - 1;
      this.registry.setExpectedState('pictureSettings', {
        ...current,
        brightness: expectedBrightness,
      });
    }
    await this.client.adjustBrightness(direction)();
  }

  async setBrightness(value: number): Promise<void> {
    const current = this.registry.getState<PictureSettingsValue>('pictureSettings').value;
    this.registry.setExpectedState('pictureSettings', {
      ...current,
      brightness: value,
    });
    await this.client.setBrightness(value)();
  }

  async setContrast(value: number): Promise<void> {
    const current = this.registry.getState<PictureSettingsValue>('pictureSettings').value;
    this.registry.setExpectedState('pictureSettings', {
      ...current,
      contrast: value,
    });
    await this.client.setContrast(value)();
  }

  async setSharpness(value: number): Promise<void> {
    const current = this.registry.getState<PictureSettingsValue>('pictureSettings').value;
    this.registry.setExpectedState('pictureSettings', {
      ...current,
      sharpness: value,
    });
    await this.client.setSharpness(value)();
  }
}
