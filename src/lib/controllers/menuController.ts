import type { TCPClient } from '../tcp/client';

export class MenuController {
  constructor(private client: TCPClient) {}

  async openMenu(): Promise<void> {
    await this.client.setMenuOn(true)();
  }

  async closeMenu(): Promise<void> {
    await this.client.setMenuOn(false)();
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
