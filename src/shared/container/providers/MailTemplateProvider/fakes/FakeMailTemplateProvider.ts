/* eslint-disable no-empty-pattern */
import IMailTemplateProvider from '../models/IMailTemplateProvider';
import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';

class FakeMailTemplateProvider implements IMailTemplateProvider {
  public async parse({}: IParseMailTemplateDTO): Promise<string> {
    return 'Mail content';
  }
}

export default FakeMailTemplateProvider;
