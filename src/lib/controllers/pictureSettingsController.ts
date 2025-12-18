import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as RT from '../resultTask';
import type { TCPClient } from '../tcp/client';
import type { StateRegistry } from '../stateRegistry';

export interface PictureSettingsValue {
  brightness: number | null;
  contrast: number | null;
  sharpness: number | null;
}

export class PictureSettingsController {
  constructor(
    private client: TCPClient,
    private registry: StateRegistry
  ) {
    this.registry.setState('pictureSettings', {
      brightness: null,
      contrast: null,
      sharpness: null,
    });
  }

  async fetchState(): Promise<void> {
    this.registry.setState(
      'pictureSettings',
      await pipe(
        RT.Do,
        RT.apS('brightness', this.client.getBrightness()),
        RT.apS('contrast', this.client.getContrast()),
        RT.apS('sharpness', this.client.getSharpness()),
        RT.fold(
          (): PictureSettingsValue => ({ brightness: null, contrast: null, sharpness: null }),
          ({ brightness, contrast, sharpness }): PictureSettingsValue => ({
            brightness: brightness ?? null,
            contrast: contrast ?? null,
            sharpness: sharpness ?? null,
          }),
          (): PictureSettingsValue => ({ brightness: null, contrast: null, sharpness: null })
        ),
        TE.getOrElse(() => async (): Promise<PictureSettingsValue> => ({ brightness: null, contrast: null, sharpness: null }))
      )()
    );
  }

  async adjustBrightness(direction: 'up' | 'down'): Promise<void> {
    const current = this.registry.getState<PictureSettingsValue>('pictureSettings').value;
    if (current.brightness !== null) {
      this.registry.setExpectedState('pictureSettings', {
        ...current,
        brightness: direction === 'up' ? current.brightness + 1 : current.brightness - 1,
      });
    }
    await this.client.adjustBrightness(direction)();

    this.registry.setState('pictureSettings', {
      ...current,
      brightness: await pipe(this.client.getBrightness(10), RT.toNullable)(),
    });
  }

  async setBrightness(value: number): Promise<void> {
    const current = this.registry.getState<PictureSettingsValue>('pictureSettings').value;
    this.registry.setExpectedState('pictureSettings', {
      ...current,
      brightness: value,
    });
    await this.client.setBrightness(value)();

    this.registry.setState('pictureSettings', {
      ...current,
      brightness: await pipe(this.client.getBrightness(10), RT.toNullable)(),
    });
  }

  async setContrast(value: number): Promise<void> {
    const current = this.registry.getState<PictureSettingsValue>('pictureSettings').value;
    this.registry.setExpectedState('pictureSettings', {
      ...current,
      contrast: value,
    });
    await this.client.setContrast(value)();

    this.registry.setState('pictureSettings', {
      ...current,
      contrast: await pipe(this.client.getContrast(10), RT.toNullable)(),
    });
  }

  async setSharpness(value: number): Promise<void> {
    const current = this.registry.getState<PictureSettingsValue>('pictureSettings').value;
    this.registry.setExpectedState('pictureSettings', {
      ...current,
      sharpness: value,
    });
    await this.client.setSharpness(value)();

    this.registry.setState('pictureSettings', {
      ...current,
      sharpness: await pipe(this.client.getSharpness(10), RT.toNullable)(),
    });
  }
}
