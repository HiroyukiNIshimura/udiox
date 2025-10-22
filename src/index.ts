import { styleText } from 'node:util';
import { confirm, editor, input, select } from '@inquirer/prompts';
import * as dotenv from 'dotenv';
import { Prompt } from './prompt';

const main = async () => {
  dotenv.config();

  if (!process.env.OPENAI_API_KEY) {
    console.error('.envファイルにOPENAI_API_KEYが設定されていません。');
    process.exit(1);
  }

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

  while (true) {
    let config: {
      message: string;
      default: boolean;
    };

    if (process.env.DEFAULT_USE_EDITOR) {
      config = {
        message: '入力に環境変数$EDITORのエディタを使用しますか？',
        default: true,
      };
    } else {
      config = {
        message: '入力に環境変数$EDITORのエディタを使用しますか？',
        default: false,
      };
    }

    const useEditor = await confirm(config);

    let answer: string;
    if (useEditor) {
      // エディタを使用する場合の処理
      answer = await editor({
        message: '曲のイメージをエディタで入力してください:',
        waitForUseInput: true,
      });

      const message = styleText('cyan', answer);
      console.log(message);
    } else {
      // 通常の入力を使用する場合の処理
      answer = await input({
        message: '曲のイメージを入力してください:',
      });

      if (
        answer.toLowerCase().trim() === 'exit' ||
        answer.toLowerCase().trim() === 'quit' ||
        answer.toLowerCase().trim() === 'q'
      ) {
        break;
      }
    }

    if (!answer) {
      continue;
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
