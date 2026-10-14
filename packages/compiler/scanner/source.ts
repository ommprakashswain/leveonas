export class Source {
  constructor(public readonly text: string) {}

  public get length(): number {
    return this.text.length;
  }

  public charAt(index: number): string {
    return this.text[index] || '\0';
  }
}
