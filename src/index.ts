import { input, select } from '@inquirer/prompts';
import { Prompt } from './prompt';

const main = async () => {
  const model = await select({
    message: '使用するモデルを選択してください:',
    default: 'gpt-5-nano',
    choices: [
      {
        name: 'gpt-5-mini',
        value: 'gpt-5-mini',
        description: 'gpt-5-mini is a smaller version of gpt-5',
      },
      {
        name: 'gpt-5-nano',
        value: 'gpt-5-nano',
        description: 'gpt-5-nano is the smallest version of gpt-5',
      },
      {
        name: 'o4-mini',
        value: 'o4-mini',
        description: 'o4-mini is a smaller version of o4',
      },
      {
        name: 'gpt-4.1-mini',
        value: 'gpt-4.1-mini',
        description: 'gpt-4.1-mini is a smaller version of gpt-4.1',
      },
      {
        name: 'gpt-4.1-nano',
        value: 'gpt-4.1-nano',
        description: 'gpt-4.1-nano is the smallest version of gpt-4.1',
      },
    ],
  });

  const chat = new Prompt(model);

  const b = true;
  while (b) {
    const answer = await input({
      message: '曲のイメージを入力してください:',
    });
    if (!answer) {
      continue;
    }

    if (
      answer.toLowerCase() === 'exit' ||
      answer.toLowerCase() === 'quit' ||
      answer.toLowerCase() === 'q'
    ) {
      break;
    }
    await chat.generatePrompt(answer);
  }
};

main()
  .then(() => {})
  .catch((e) => {
    if (e instanceof Error && e.name === 'ExitPromptError') {
      console.log('SIGINTを受信しました。終了します。');
    } else {
      // Rethrow unknown errors
      throw e;
    }
  })
  .finally(() => {});
