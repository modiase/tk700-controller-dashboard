import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import type { TK700Client } from '../tk700-client';
import type { StateRegistry } from '../state-registry';

export class MenuController {
  constructor(
    private client: TK700Client,
    private registry: StateRegistry
  ) {
    this.registry.setState('menu', null);
  }

  async fetchState(): Promise<void> {
    const result = await this.client.getMenuStatus()();
    const menuStatus = pipe(
      result,
      E.map(O.toNullable),
      E.getOrElse((): string | null => null)
    );
    this.registry.setState('menu', menuStatus);
  }

  async setMenu(on: boolean): Promise<void> {
    this.registry.setExpectedState('menu', on ? 'on' : 'off');
    await this.client.setMenuOn(on)();
  }

  async navigateUp(): Promise<void> {
    await this.client.menuUp()();
  }

  async navigateDown(): Promise<void> {
    await this.client.menuDown()();
  }

  async navigateRight(): Promise<void> {
    await this.client.menuRight()();
  }

  async navigateLeft(): Promise<void> {
    await this.client.menuLeft()();
  }

  async confirm(): Promise<void> {
    await this.client.menuEnter()();
  }

  async back(): Promise<void> {
    await this.client.menuBack()();
  }
}
