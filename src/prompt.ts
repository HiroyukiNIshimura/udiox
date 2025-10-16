import * as fs from 'node:fs';
import * as path from 'node:path';
import cliSpinner from 'cli-spinner';
import OpenAI from 'openai';
import { ParsedResponse } from 'openai/resources/responses/responses';
import { getTextFormat, PromptSchema, PromptType } from './types';

// Load environment variables
export class Prompt {
  private structureData: string;
  private model: string;

  constructor(model: string = 'gpt-5-nano') {
    this.structureData = this.getStructure();
    this.model = model;
  }

  private getStructure(): string {
    const filePath = path.join(__dirname, 'StructureData.md');
    return fs.readFileSync(filePath, 'utf-8');
  }

  public async generatePrompt(message: string): Promise<boolean> {
    cliSpinner.Spinner.setDefaultSpinnerString(18);
    const spinner = new cliSpinner.Spinner('Generating prompt... %s');

    try {
      const apiKey = process.env.OPENAI_API_KEY;

      if (!apiKey) {
        console.error(
          'Error: OPENAI_API_KEY is not set in environment variables',
        );
        return false;
      }

      spinner.start();

      const client = new OpenAI({
        apiKey: apiKey,
      });

      const response = await client.responses.parse({
        model: this.model,
        input: [
          { role: 'developer', content: this.structureData },
          { role: 'user', content: message },
        ],
        text: {
          format: getTextFormat(PromptSchema, 'response'),
        },
      });

      spinner.stop(true);

      if (response.output) {
        this.print(response);
        return true;
      }
    } catch (error) {
      console.error('Error generating prompt:', error);
      return false;
    } finally {
      if (spinner.isSpinning()) {
        spinner.stop(true);
      }
    }
    return false;
  }

  private print(
    response: ParsedResponse<null> & {
      _request_id?: string | null;
    },
  ): void {
    const data = response.output_parsed as unknown as PromptType;

    console.log('\n=== Generated Prompt ===');
    console.log(
      `\n${data.theme} ${data.tags.map((tag) => tag.output).join('; ')}`,
    );

    console.log('\n=== Summary ===');
    console.log(`\nReason:`);
    console.log(`\n${data.reason}`);
    console.log('\nTags:\n');
    for (const tag of data.tags) {
      console.log(`- ${tag.output} (${tag.explanation})`);
    }
    console.log('\n');
  }
}
