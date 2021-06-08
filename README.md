# dva-type

## 安装

> npm i dva-type —save-dev

## 说明

基于 TypeScript 4.1 版本的 [Template Literal Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html) 特性，实现 `dva models` 的完整类型推导和提示。

传入项目的 `models` 类型定义，返回 `state`、`actions`的类型定义。

- `state` 类型提示

<img src="https://gitee.com/lei451927/picture/raw/master/images/image-20210607180531500.png" alt="image-20210607180531500" style="zoom: 67%;" />

- `action type` 类型提示

<img src="https://gitee.com/lei451927/picture/raw/master/images/image-20210607180644700.png" alt="image-20210607180644700" style="zoom: 50%;" />

- `action payload` 类型推断

<img src="https://gitee.com/lei451927/picture/raw/master/images/image-20210607181637266.png" alt="image-20210607181637266" style="zoom: 50%;" />

## 使用

​ [Example](https://github.com/lei4519/dva-type/blob/main/examples/index.ts)

1. 定义单个 `Model` 类型（注意 `Model`、`Effect` 不是从 `dva` 中导入的）

   ```ts
   import { Effect, Model } from 'dva-type'

   interface ListModel extends Model {
     state: {
       list: any[]
     }
     effects: {
       // 定义effect 传入 payload 类型
       getList: Effect<number>

       // 不需要 payload 的 effect
       getInfo: Effect
     }
   }
   ```

2. 定义项目中所有 `Model` 的集合（**使用 `type` 而不是 `interface`**）

   ```ts
   // 使用 type 定义 models，将项目中的所有 model 进行收集
   type Models = {
     list: ListModel
     info: InfoModel
     // ...
   }
   ```

3. 将 `Models` 传入 `ResolverModels` 获取 `state` 和 `actions` 的类型

   ```ts
   import { ResolverModels } from 'dva-type'

   type State = ResolverModels<Models>['state']
   type Actions = ResolverModels<Models>['actions']
   ```

4. 使用

   ```ts
   // hooks
   useSelector<State>()
   const dispatch = useDispatch<(action: Actions) => any>()

   // class
   const mapStateToProps = (state: State) => {}
   interface Props {
     dispatch: (action: Actions) => any
   }
   ```
