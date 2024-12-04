import { UppercaseConverterPipe } from './uppercase-converter.pipe';

describe('UppercaseConverterPipe', () => {
  it('create an instance', () => {
    const pipe = new UppercaseConverterPipe();
    expect(pipe).toBeTruthy();
  });
});
