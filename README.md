# COMMAND.TS

타입스크립트로 작성된 discord.js 커맨드 프레임워크입니다.

## 설치

```
npm i discord.js reflect-metadata @pikostudio/command.ts
```

## 설정

tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "skipLibCheck": true
  }
}
```

index.ts

```ts
import 'reflect-metadata'
import { CommandClient } from '@pikostudio/command.ts'

const client = new CommandClient({
  currentDir: __dirname,
  commandHandler: {
    prefix: '!',
  },
  watch: true,
  // auto로 설정시 자동으로 애플리케이션에서 가져옵니다.
  owners: 'auto',
})

client.loadExtensions('extensions/test')

client.login('token')
```

extensions/test.ts

```ts
import { Arg, Command, Extension, Listener, Msg } from '@pikostudio/command.ts'
import { Message } from 'discord.js'

export default class Test extends Extension {
  @Command()
  say(
    @Msg() msg: Message, // 메시지 받기
    @Arg({ required: true, rest: true }) content: string, // 인자 받기
    // + 인자는 순서대로 받습니다. rest를 사용하려면 꼭 마지막 인자로 사용해주세요
  ) {
    return msg.reply(content)
  }

  // 로드 이벤트
  load() {}

  // 언로드 이벤트

  unload() {}

  // 명령어 사용시 실행됩니다. 반환된 값이 false일시 명령어 사용을 중지합니다.
  /*async*/ permit(/* message */) {
    return true
  }

  @Listener('ready') // 리스너
  async ready() {
    console.log('bot ready!')
  }
}
```
