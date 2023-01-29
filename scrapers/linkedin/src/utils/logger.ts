export class Logger {
  private readonly moduleName: string;

  constructor(moduleName: string) {
    this.moduleName = moduleName;
  }

  public log(message: String): void {
    console.log(`[${Date.now()}] - ${this.moduleName} - ${message}`);
  }
}
